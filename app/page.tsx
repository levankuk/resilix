'use client';

import { useState } from 'react';
import { Shield, TrendingUp, AlertTriangle, Send, Upload } from 'lucide-react';

export default function Resilix() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState<{ q: string; a: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message;
    setMessage('');
    setResponses(prev => [...prev, { q: userMsg, a: 'Thinking...' }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();

      setResponses(prev => {
        const updated = [...prev];
        updated[updated.length - 1].a = data.reply;
        return updated;
      });
    } catch (e) {
      setResponses(prev => {
        const updated = [...prev];
        updated[updated.length - 1].a = "Sorry, I couldn't process that.";
        return updated;
      });
    }
    setLoading(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setResponses(prev => [...prev, { 
        q: "Uploaded file", 
        a: `Processed ${file.name}. Ask me for supply chain suggestions!` 
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-2">Resilix</h1>
        <p className="text-xl text-gray-400 mb-12">AI Supply Chain Assistant</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 p-8 rounded-3xl">
            <Shield className="w-12 h-12 text-emerald-500 mb-6" />
            <p className="text-gray-400">Risk Level</p>
            <p className="text-6xl font-bold text-emerald-500">Low</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-3xl">
            <TrendingUp className="w-12 h-12 text-blue-500 mb-6" />
            <p className="text-gray-400">Savings</p>
            <p className="text-6xl font-bold text-blue-500">€18,450</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-3xl">
            <AlertTriangle className="w-12 h-12 text-amber-500 mb-6" />
            <p className="text-gray-400">Alerts</p>
            <p className="text-6xl font-bold text-amber-500">3</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-8">
          <h3 className="text-2xl font-semibold mb-6">AI Agent Chat</h3>
          
          <div className="h-80 overflow-y-auto mb-6 space-y-6">
            {responses.length === 0 && (
              <p className="text-gray-500 text-center py-20">Ask me anything about your supply chain...</p>
            )}
            {responses.map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-blue-600 px-5 py-3 rounded-2xl max-w-[80%]">{item.q}</div>
                </div>
                <div className="bg-gray-800 px-5 py-4 rounded-2xl max-w-[80%]">{item.a}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="What if my supplier delays next week?"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700 px-10 rounded-2xl disabled:opacity-50"
            >
              <Send />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
