import React, { useState } from 'react';

export default function AgentSearch() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const searchAgents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/search-agents');
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      setAgents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setError('Failed to fetch agents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedAgent || !message.trim()) return;

    setSendingMessage(true);
    try {
      const response = await fetch('http://localhost:5001/api/send-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyResponses: message,
          agentAddress: selectedAgent.address
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      console.log('Message sent:', data);
      setMessage(''); // Clear message after sending
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h1 className="text-2xl font-bold text-center mb-4">Profile Agent Search</h1>
          <button
            onClick={searchAgents}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search for Agents'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Agent List */}
        {agents.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3">Available Agents:</h2>
            <div className="space-y-2">
              {agents.map((agent, index) => (
                <div 
                  key={agent.address || index}
                  className={`flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer
                    ${selectedAgent?.address === agent.address ? 'border-blue-500 bg-blue-50' : ''}`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div>
                    <p className="font-medium">{agent.name || 'Unnamed Agent'}</p>
                    <p className="text-sm text-gray-600">Address: {agent.address}</p>
                    {agent.description && (
                      <p className="text-sm text-gray-500">{agent.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        {selectedAgent && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-2">Send Message to {selectedAgent.name}</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your survey responses..."
              className="w-full p-2 border rounded-md mb-3 h-32"
              disabled={sendingMessage}
            />
            <button
              onClick={sendMessage}
              disabled={sendingMessage || !message.trim()}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {sendingMessage ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        )}

        {/* No Results Message */}
        {!loading && agents.length === 0 && !error && (
          <div className="text-center text-gray-500 mt-4">
            No agents found. Click the search button to find available agents.
          </div>
        )}
      </div>
    </div>
  );
}