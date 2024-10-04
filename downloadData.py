import requests
import json
import gzip
import shutil
import time
import os
from io import BytesIO

S3_BUCKET_URL = "https://vcthackathon-data.s3.us-west-2.amazonaws.com"

# (game-changers, vct-international, vct-challengers)
LEAGUE = "vct-international"

# (2022, 2023, 2024)
YEAR = 2022

# Function to download a gzipped file from S3 and save it as a JSON file
def download_gzip_and_write_to_json(file_name):
    if os.path.isfile(f"{file_name}.json"):
        print("Already Downloaded")
        return False  # Skip if already downloaded

    remote_file = f"{S3_BUCKET_URL}/{file_name}.json.gz"
    response = requests.get(remote_file, stream=True)

    if response.status_code == 200:
        gzip_bytes = BytesIO(response.content)
        with gzip.GzipFile(fileobj=gzip_bytes, mode="rb") as gzipped_file:
            content = gzipped_file.read()
            print(f"File content: {content[:100]}")
            with open(f"{file_name}.json", 'wb') as output_file:
                output_file.write(content)
                #shutil.copyfileobj(gzipped_file, output_file)
            print(f"{file_name}.json written")
            print(f"Saving file to: {os.path.abspath(file_name)}")
        return True
    elif response.status_code == 404:
        # Ignore if not found
        return False
    else:
        print(f"Failed to download {file_name}: {response}")
        return False

# Download all esports fixture data files
def download_esports_files():
    directory = f"{LEAGUE}/esports-data"

    if not os.path.exists(directory):
        os.makedirs(directory)

    esports_data_files = ["leagues", "tournaments", "players", "teams", "mapping_data"]
    for file_name in esports_data_files:
        download_gzip_and_write_to_json(f"{directory}/{file_name}")

# Download game data using platformGameIds from the mapping file
def download_games():
    start_time = time.time()

    local_mapping_file = f"{LEAGUE}/esports-data/mapping_data.json"
    with open(local_mapping_file, "r") as json_file:
        mappings_data = json.load(json_file)

    local_directory = f"{LEAGUE}/games/{YEAR}"
    if not os.path.exists(local_directory):
        os.makedirs(local_directory)

    game_counter = 0

    for esports_game in mappings_data:
        s3_game_file = f"{LEAGUE}/games/{YEAR}/{esports_game['platformGameId']}"  # Fix: Use single quotes inside f-string

        response = download_gzip_and_write_to_json(s3_game_file)
        
        if (response == True):
            game_counter += 1
            if game_counter % 10 == 0:
                print(f"----- Processed {game_counter} games, current run time: {
                    round((time.time() - start_time)/60, 2)} minutes")
if __name__ == "__main__":
    download_esports_files()  # Download esports data
    download_games()  # Download game data based on mapping
