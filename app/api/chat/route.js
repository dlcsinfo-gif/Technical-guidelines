export async function POST(request) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const agentUrl = process.env.DO_AGENT_URL;
    const agentKey = process.env.DO_AGENT_ACCESS_KEY;

    if (!agentUrl || !agentKey) {
      return Response.json(
        { error: "Server configuration missing" },
        { status: 500 }
      );
    }

    const messages = [
  ...history.slice(-10),
  {
    role: "user",
    content: message
  }
];

    const doResponse = await fetch(
      `${agentUrl}/api/v1/chat/completions?agent=true`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${agentKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages,
          temperature: 0.2,
          max_tokens: 800
        })
      }
    );

    const data = await doResponse.json();

    if (!doResponse.ok) {
      return Response.json(
        { error: data?.error || "DigitalOcean Agent error" },
        { status: doResponse.status }
      );
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.message ||
      "No response received.";

    return Response.json({ reply });
  } catch (error) {
    return Response.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
