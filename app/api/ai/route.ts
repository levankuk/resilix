import { NextRequest } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    temperature: 0.7,
    messages: [
      { 
        role: "system", 
        content: "You are Resilix, a practical and helpful AI supply chain expert. Give clear, actionable advice." 
      },
      { role: "user", content: message }
    ],
  });

  return Response.json({ 
    reply: completion.choices[0].message.content 
  });
}
