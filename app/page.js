"use client";

import { useState, useRef, useEffect } from "react";

const presetQuestions = [
  "What is the treatment of cryptococcal meningitis?",
  "What is the recommended first-line ART regimen?",
  "How should virological failure be managed?",
  "What is the guidance for HIV and TB co-treatment?",
  "When should ART be started after opportunistic infection?",
  "What monitoring is recommended after ART initiation?"
  "A client from a high-risk group requests oral PrEP. Their rapid HIV antibody test is negative, but they report a flu-like illness and fever two weeks ago. How should you proceed with PrEP initiation?"
];

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I can help with HIV Treatment Guidelines. Choose a preset question below or type your own."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function askQuestion(question) {
    if (!question.trim() || loading) return;

    const userMessage = { role: "user", content: question };
    const nextMessages = [...messages, userMessage];

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
          message: question,
          history: nextMessages
        })
      });

      const data = await response.json();

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            data.reply ||
            data.error ||
            "Sorry, I could not generate a response."
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

  function handleSubmit(e) {
    e.preventDefault();
    askQuestion(input);
  }

  return (
    <main style={styles.page}>
      <section style={styles.phone}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Technical Guidelines</h1>
            <p style={styles.subtitle}>AI Chatbot | NACO</p>
          </div>
          <span style={styles.badge}>Secure</span>
        </header>

        <div style={styles.notice}>
          This assistant supports guideline-based decision-making. It does not
          replace clinical judgement or specialist consultation.
        </div>

        <div style={styles.presets}>
          <p style={styles.presetsTitle}>Suggested questions</p>
          <div style={styles.presetScroller}>
            {presetQuestions.map((q) => (
              <button
                key={q}
                style={styles.presetButton}
                onClick={() => askQuestion(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.chatArea}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(msg.role === "user" ? styles.userMsg : styles.botMsg)
              }}
            >
              {msg.role === "assistant" ? (
                <FormattedAnswer text={msg.content} />
              ) : (
                msg.content
              )}
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.message, ...styles.botMsg }}>
              <div style={styles.typing}>Preparing structured answer...</div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            style={styles.input}
            rows={1}
          />
          <button disabled={loading || !input.trim()} style={styles.sendBtn}>
            Send
          </button>
        </form>
      </section>
    </main>
  );
}

function FormattedAnswer({ text }) {
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  return (
    <div style={styles.answer}>
      {lines.map((line, index) => {
        const clean = line.trim();

        if (clean.startsWith("### ")) {
          return (
            <h3 key={index} style={styles.h3}>
              {clean.replace("### ", "")}
            </h3>
          );
        }

        if (clean.startsWith("## ")) {
          return (
            <h2 key={index} style={styles.h2}>
              {clean.replace("## ", "")}
            </h2>
          );
        }

        if (clean.startsWith("# ")) {
          return (
            <h2 key={index} style={styles.h2}>
              {clean.replace("# ", "")}
            </h2>
          );
        }

        if (clean.startsWith("- ") || clean.startsWith("* ")) {
          return (
            <div key={index} style={styles.bullet}>
              <span style={styles.bulletDot}>•</span>
              <span>{clean.substring(2)}</span>
            </div>
          );
        }

        if (/^\d+\./.test(clean)) {
          return (
            <div key={index} style={styles.numbered}>
              {clean}
            </div>
          );
        }

        return (
          <p key={index} style={styles.paragraph}>
            {clean}
          </p>
        );
      })}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eaf2ff 0%, #f8fafc 100%)",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    padding: "0"
  },
  phone: {
    maxWidth: "540px",
    minHeight: "100vh",
    margin: "0 auto",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    background: "linear-gradient(135deg, #0061EB, #2f80ed)",
    color: "#ffffff",
    padding: "18px 18px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "800"
  },
  subtitle: {
    margin: "5px 0 0",
    fontSize: "15px",
    opacity: 0.95
  },
  badge: {
    background: "#ffffff",
    color: "#0061EB",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "13px"
  },
  notice: {
    margin: "14px",
    padding: "13px 14px",
    background: "#fff7ed",
    color: "#7c2d12",
    border: "1px solid #fed7aa",
    borderRadius: "18px",
    fontSize: "14px",
    lineHeight: 1.45
  },
  presets: {
    padding: "0 14px 10px"
  },
  presetsTitle: {
    margin: "0 0 8px",
    fontSize: "13px",
    color: "#475569",
    fontWeight: "700"
  },
  presetScroller: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    paddingBottom: "4px"
  },
  presetButton: {
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    color: "#1d4ed8",
    borderRadius: "999px",
    padding: "9px 12px",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap"
  },
  chatArea: {
    flex: 1,
    padding: "10px 14px 16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  message: {
    maxWidth: "90%",
    padding: "12px 14px",
    borderRadius: "18px",
    fontSize: "15px",
    lineHeight: 1.5
  },
  userMsg: {
    alignSelf: "flex-end",
    background: "#0061EB",
    color: "#ffffff",
    borderBottomRightRadius: "6px"
  },
  botMsg: {
    alignSelf: "flex-start",
    background: "#f1f5f9",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    borderBottomLeftRadius: "6px"
  },
  form: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid #e5e7eb",
    background: "#ffffff"
  },
  input: {
    flex: 1,
    minHeight: "48px",
    maxHeight: "120px",
    resize: "none",
    border: "1px solid #cbd5e1",
    borderRadius: "16px",
    padding: "12px",
    fontSize: "15px",
    outline: "none"
  },
  sendBtn: {
    border: 0,
    borderRadius: "16px",
    padding: "0 18px",
    background: "#0061EB",
    color: "#ffffff",
    fontWeight: "800",
    fontSize: "14px"
  },
  answer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  h2: {
    margin: "4px 0 6px",
    fontSize: "18px",
    color: "#0f172a"
  },
  h3: {
    margin: "8px 0 4px",
    fontSize: "16px",
    color: "#1e40af"
  },
  paragraph: {
    margin: "2px 0"
  },
  bullet: {
    display: "flex",
    gap: "8px",
    margin: "2px 0"
  },
  bulletDot: {
    color: "#0061EB",
    fontWeight: "bold"
  },
  numbered: {
    margin: "4px 0",
    fontWeight: "500"
  },
  typing: {
    color: "#475569",
    fontStyle: "italic"
  }
};
