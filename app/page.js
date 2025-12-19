"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ask`;


export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input;

    // 1️⃣ Append user message (same as Streamlit)
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();

      // 🔍 DEBUG (important)
      console.log("Backend response:", data);

      // 2️⃣ Append AI response EXACTLY like Streamlit
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `${data.response} WITH TOOL: [${data.tool_called}]`,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Backend connection failed. Please try again later.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <h1>🧠 SukoonAI</h1>
        <p>Your safe space to talk</p>
      </header>

      {/* Chat Window */}
      <main className="chat-window">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>👋 Hi, I’m SukoonAI.</p>
            <p>You can talk to me about anything.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${msg.role === "user" ? "user" : "assistant"
              }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="chat-bubble assistant typing">
            SukoonAI is thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <footer className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="What’s on your mind today?"
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </footer>
    </div>
  );
}
