# VCT_AMAZON

## Overview
This project is a full-stack chatbot application that uses AWS Bedrock for natural language processing. The frontend is built with React, while the backend is powered by Node.js and Express. The application allows users to interact with the Claude model on AWS Bedrock by entering prompts and receiving AI-generated responses in real time.

## Table of Contents
- [Project Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
<!-- - Contributing -->
- [License](#license)

## Features
- **Chat Interface**: Simple and user-friendly interface for users to communicate with the Claude model.
- **AWS Bedrock Integration**: Uses the Claude model on AWS Bedrock for AI-based responses.
- **Real-time Communication**: Immediate responses through RESTful API calls.

## Tech Stack
### Frontend
- React
- Axios (for API calls)
### Backend
- Node.js
- Express
- AWS SDK (for Bedrock API calls)

## Project Structure
```plaintext
.
├── frontend           # Frontend React app
│   ├── src
│   ├── public
│   └── package.json
├── server             # Backend Node.js server
│   ├── server.js
│   └── package.json
└── README.md          # Main README for the project
```

## Installation
To run the project locally, follow these steps:
### Prerequisites
- Node.js (v14 or higher)
- npm (Node package manager)
- AWS account with access to Bedrock API
### Setup Instructions
1. **Clone the repository**:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. **Backend Setup**: Navigate to the `server` folder and install dependencies:

```bash
cd server
npm install
```

3. **Frontend Setup**: Open a new terminal, navigate to the `frontend` folder, and install dependencies:

```bash
cd frontend
npm install
```


## Usage
1. **Set up environment variables** (see [Environment Variables](#environment-variables) section).
2. **Start the backend server**:

```bash
cd server
node server.js
```

The backend server should be running on `http://localhost:3001`.

3. **Start the frontend application**:

```bash
cd frontend
npm start
```

The React app should open in your default browser at `http://localhost:3000`.

4. **Use the Chat Interface**: Open the frontend application and enter a message. The response from the Claude model should appear in the chat interface.

## Environment Variables
Create a `.env` file in the `server` directory with the following variables:

```plaintext
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

Ensure you replace `your-access-key-id` and `your-secret-access-key` with your actual AWS credentials.

<!-- ## Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch.
Commit your changes.
Push to your branch.
Create a pull request. -->

## License
This project is licensed under the MIT License. See the LICENSE file for details.

