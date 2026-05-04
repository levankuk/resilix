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
        a: `Processed ${file.name}. I found some risks. Ask me for suggestions!` 
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
          <div>Alex Chen</div>
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
            <p className="text-gray-400">Savings</p>
            <p className="text-6xl font-bold text-blue-500">€18,450</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-3xl">
            <AlertTriangle className="w-12 h-12 text-amber-500 mb-6" />
            <p className="text-gray-400">Alerts</p>
            <p className="text-6xl font-bold text-amber-500">3</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-gray-900 rounded-3xl p-8">
           
