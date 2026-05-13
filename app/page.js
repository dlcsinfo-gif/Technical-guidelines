"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I can help with HIV Treatment Guidelines. Please avoid entering patient-identifying information."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();

    const text = input.trim();
    if (!text) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          history: nextMessages
        })
      });

      const data = await response.json();

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.reply || data.error || "No response received."
        }
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Unable to connect to the chatbot service."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>AI Chatbot</h1>
            <p style={styles.subtitle}>Technical Guidelines | NACO</p>
          </div>
          <span style={styles.badge}>Secure</span>
        </header>

        <div style={styles.notice}>
          This assistant supports guideline-based decision-making but does not replace clinical judgement.
        </div>

        <div style={styles.chat}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(msg.role === "user" ? styles.user : styles.assistant)
              }}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.message, ...styles.assistant }}>
              Thinking...
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} style={styles.form}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            style={styles.input}
          />
          <button disabled={loading} style={styles.button}>
            Send
          </button>
        </form>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "16px",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    maxWidth: "520px",
    margin: "0 auto",
    minHeight: "calc(100vh - 32px)",
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  header: {
    padding: "18px",
    background: "#0061EB",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    margin: 0,
    fontSize: "22px"
  },
  subtitle: {
    margin: "4px 0 0",
    fontSize: "14px",
    opacity: 0.9
  },
  badge: {
    background: "#ffffff",
    color: "#0061EB",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold"
  },
  notice: {
    margin: "12px",
    padding: "12px",
    borderRadius: "14px",
    background: "#fff4e6",
    color: "#7c2d12",
    fontSize: "13px",
    lineHeight: 1.4
  },
  chat: {
    flex: 1,
    padding: "14px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  message: {
    maxWidth: "85%",
    padding: "11px 13px",
    borderRadius: "16px",
    fontSize: "15px",
    lineHeight: 1.45
  },
  user: {
    alignSelf: "flex-end",
    background: "#0061EB",
    color: "#ffffff",
    borderBottomRightRadius: "4px"
  },
  assistant: {
    alignSelf: "flex-start",
    background: "#E5E8ED",
    color: "#111827",
    borderBottomLeftRadius: "4px"
  },
  form: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid #e5e7eb"
  },
  input: {
    flex: 1,
    minHeight: "46px",
    maxHeight: "120px",
    resize: "none",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    padding: "12px",
    fontSize: "15px"
  },
  button: {
    border: 0,
    borderRadius: "14px",
    padding: "0 16px",
    background: "#0061EB",
    color: "#ffffff",
    fontWeight: "bold"
  }
};
