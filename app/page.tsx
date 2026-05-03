'use client';

import { useState } from 'react';
import { Shield, TrendingUp, AlertTriangle, Send, Upload, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', inventory: 12400, risk: 65 },
  { month: 'Feb', inventory: 9800, risk: 42 },
  { month: 'Mar', inventory: 15600, risk: 78 },
  { month: 'Apr', inventory: 8700, risk: 35 },
];

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
        q: "Uploaded inventory file",
        a: `Processed ${file.name}. Found 3 potential risks. Would you like optimization suggestions?`
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-9 h-9 text-emerald-500" />
            <h1 className="text-3xl font-bold">Resilix</h1>
          </div>
          <div className="flex items-center gap-6">
            <div>Alex Chen</div>
            <button className="text-red-400 hover:text-red-500">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 p-8 rounded-3xl">
            <Shield className="w-12 h-12 text-emerald-500 mb-6" />
            <p className="text-gray-400">Risk Level</p>
            <p className="text-6xl font-bold text-emerald-500">Low</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-3xl">
            <TrendingUp className="w-12 h-12 text-blue-500 mb-6" />
            <p className="text-gray-400">Savings This Month</p>
            <p className="text-6xl font-bold text-blue-500">€18,450</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-3xl">
            <AlertTriangle className="w-12 h-12 text-amber-500 mb-6" />
            <p className="text-gray-400">Active Alerts</p>
            <p className="text-6xl font-bold text-amber-500">3</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 bg-gray-900 rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6">Upload Inventory / Suppliers</h3>
            <label className="border-2 border-dashed border-gray-700 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600">
              <Upload className="w-16 h-16 text-gray-500 mb-4" />
              <p className="text-lg">Drop Excel or CSV here</p>
              <input type="file" className="hidden" onChange={handleFile} />
            </label>
            {fileName && <p className="mt-4 text-green-500">✓ {fileName}</p>}
          </div>

          {/* AI Chat */}
          <div className="lg:col-span-3 bg-gray-900 rounded-3xl p-8 flex flex-col" style={{height: "560px"}}>
            <h3 className="text-xl font-semibold mb-6">AI Supply Chain Agent</h3>
            
            <div className="flex-1 overflow-y-auto space-y-6 mb-6">
              {responses.length === 0 && (
                <div className="text-center text-gray-500 py-20">
                  Ask anything about your supply chain
                </div>
              )}
              {responses.map((item, i) => (
                <div key={i} className="space-y-4">
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
                placeholder="What if my supplier delays?"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-8 rounded-2xl disabled:opacity-50"
              >
                <Send />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
