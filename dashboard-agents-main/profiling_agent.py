import os
import json
import openai
import logging
from dotenv import load_dotenv
from fetchai.crypto import Identity
from fetchai.registration import register_with_agentverse
from fetchai.communication import parse_message_from_agent, send_message_to_agent
from flask import Flask, request, jsonify

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Identity for the agent
profiling_identity = None

# Initialize OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/webhook', methods=['POST'])
def webhook():
    global profiling_identity
    try:
        # Parse the incoming message
        data = request.get_data().decode('utf-8')
        message = parse_message_from_agent(data)
        survey_responses = message.payload.get("survey_responses", "")
        agent_address = message.sender

        if not survey_responses:
            return jsonify({"status": "error", "message": "No survey responses provided"}), 400

        # Generate profile from survey responses
        profile = generate_profile(survey_responses)

        # Send the profile back to the client
        payload = {'profile': profile}
        send_message_to_agent(
            profiling_identity,
            agent_address,
            payload
        )
        return jsonify({"status": "profile_sent"})

    except Exception as e:
        logger.error(f"Error in webhook: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

from openai import OpenAI
import json
import logging

logger = logging.getLogger(__name__)

def generate_profile(survey_responses):
    """Generate a user profile based on survey responses."""
    try:
        # Initialize the OpenAI client
        client = OpenAI()  # assumes OPENAI_API_KEY is set in environment variables
        
        # Use OpenAI API to generate a profile
        prompt = (
            f"Given the following survey responses: {json.dumps(survey_responses)}, "
            "generate a comprehensive user profile summarizing their preferences, behaviors, and characteristics."
        )
        
        response = client.chat.completions.create(
            model="gpt-4",  # or other appropriate model
            messages=[
                {"role": "system", "content": "You are an assistant that creates user profiles from survey responses."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        profile = response.choices[0].message.content.strip()
        logger.info(f"Generated profile: {profile}")
        return profile
        
    except Exception as e:
        logger.error(f"Error generating profile: {e}")
        return ""

def init_agent():
    global profiling_identity
    try:
        profiling_identity = Identity.from_seed(os.getenv("PROFILING_AGENT_KEY"), 0)
        register_with_agentverse(
            identity=profiling_identity,
            url="http://localhost:5008/webhook",
            agentverse_token=os.getenv("AGENTVERSE_API_KEY"),
            agent_title="User Profiling Agent",
            readme="""
                <description>User Profiling Agent that creates profiles from survey responses.</description>
                <use_cases>
                    <use_case>Generate user profiles based on survey responses.</use_case>
                </use_cases>
                <payload_requirements>
                    <description>Expects survey responses in the payload.</description>
                    <payload>
                        <requirement>
                            <parameter>survey_responses</parameter>
                            <description>The user's answers to the survey questions.</description>
                        </requirement>
                    </payload>
                </payload_requirements>
            """
        )
        logger.info("Profiling agent registered successfully!")
        logger.info(f"Profiling agent address: {profiling_identity.address}")
    except Exception as e:
        logger.error(f"Error initializing agent: {e}")
        raise

if __name__ == "__main__":
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY")
    init_agent()
    app.run(host="0.0.0.0", port=5008, debug=True, use_reloader=False)