# Data Visualisation Dashboard Agent

Creating an AI Agent using openAI model and dash Package in python to create data visualisation dashboard for any given structured data.

## Features

We have two agents in this project : 

- **Dashboard Analytics Agent:** Processes datasets and provides insightful visualizations using GPT-based suggestions.
- **Frontend Client:** Allows users to interact with the analytics agent by sending datasets and fetching dashboard links.



-**Visualization Generator:** Automatically generates visualizations such as scatter plots and pie charts for submitted datasets.

## Prerequisites

- Python 3.11+
- Virtual Environment: Recommended for managing dependencies.
- API Keys:
    - (OpenAI API Key)[https://platform.openai.com/settings/profile/api-keys]
    - (Fetch.ai Agentverse API Key)[https://agentverse.ai/profile/api-keys]
    - Identity seed phrases for agents (DASHBOARD_AGENT_KEY and CLIENT_KEY), random strings to get the same agent addresses everytime.

## Installation

### 1. Clone the Repository

```
git clone https://github.com/abhifetch/dashboard-agents.git
cd dashboard_agents
```

### 2. Create a Virtual Environment

```
python3 -m venv venv
source venv/bin/activate  # For Linux/Mac
venv\Scripts\activate     # For Windows
```

### 3. Install Dependencies
```
pip install -r requirements.txt
```

## Environment Variables

Create a .env file in the root directory of the project (where data_analytics_client.py and data_analytics_user.py are located).

### Example .env File

```
OPENAI_API_KEY="your-openai-api-key"
AGENTVERSE_API_KEY="your-agentverse-api-key"
DASHBOARD_AGENT_KEY="your-dashboard-agent-seed-phrase"
CLIENT_KEY="your-client-agent-seed-phrase"
```

## Running the Project

### 1. Start the Analytics Agent

Run the `data_analytics_client.py` to start the dashboard analytics agent:

```
python3 data_analytics_client.py
```
This will register the analytics agent with Fetch.ai's Agentverse and expose the webhook endpoint.

### 2. Start the Frontend Client
Run the `data_analytics_user.py` to start the frontend client:

```
python3 data_analytics_user.py
```
This will register the user client and enable interactions with the analytics agent.

## How to Use
### 1. Search for Available Agents
Use the following curl command to search for registered analytics agents:
```
curl -X GET http://localhost:5002/api/search-agents
```

### 2. Send Dataset to Analytics Agent
Send a dataset to the analytics agent for visualization:
```
curl -X POST http://localhost:5002/api/send-data \
-H "Content-Type: application/json" \
-d '{
  "dataPath": "data.csv", # save the data with in the same directory as agent scripts. as it is taking it locally at the momement.
  "agentAddress": "replace-with-agent-address-from-search"
}'
```

### 3. Get Dashboard URL
Poll for the generated dashboard URL:

```
curl -X GET http://localhost:5002/api/get-dashboard-response
```

If successful, you will receive a URL for the visualizations dashboard.

### Sample output

Sample output for this can be visited on : [Youtube Video](https://youtu.be/0tDdsuaSGu4)

If you wish to learn more about fetch.ai SDK please visit [GitHub](https://github.com/fetchai/fetchai)



