import requests
import json
import gzip
from io import BytesIO

S3_BUCKET_URL = "https://vcthackathon-data.s3.us-west-2.amazonaws.com"
LEAGUE = "vct-international"
YEAR = 2022

# Function to stream game data from S3 bucket using public URL
def stream_game_file_from_url(file_key):
    try:
        file_url = f"{S3_BUCKET_URL}/{file_key}.json.gz"
        response = requests.get(file_url, stream=True)

        if response.status_code == 200:
            gzip_file = BytesIO(response.content)
            with gzip.GzipFile(fileobj=gzip_file, mode="rb") as gzipped_file:
                game_data = json.loads(gzipped_file.read().decode('utf-8'))
                return game_data
        else:
            print(f"Failed to stream {file_key}: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error streaming file {file_key}: {e}")
        return None

# Function to count deaths for a specific player
def count_player_deaths(json_file, player_id):
    game_data = stream_game_file_from_url(json_file)
    if not game_data:
        return None

    death_count = 0

    # Loop through the events in the game data
    for event in game_data:
        if 'playerDied' in event:
            deceased_id = event['playerDied'].get('deceasedId', {}).get('value')
            if deceased_id == player_id:
                death_count += 1

    return death_count

# Example usage
mapping_file = 'vct-international/esports-data/mapping_data.json'  # Replace with actual mapping file
player_id = 106525473804840689  # Replace with the player's ID (e.g., crashies)
deaths = 0

with open(mapping_file, 'r') as file:
    mapping_data = json.load(file)

# Loop through all games in the mapping data
for game in mapping_data:
    platform_game_id = game['platformGameId']
    game_key = f"vct-international/games/{YEAR}/{platform_game_id}"  # No replacement of colons
    game_deaths = count_player_deaths(game_key, player_id)

    if game_deaths is not None:
        print(f"Deaths in game {platform_game_id}: {game_deaths}")
        deaths += game_deaths

print(f"Total deaths for player {player_id}: {deaths}")
