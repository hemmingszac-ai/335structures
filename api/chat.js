export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, model, max_tokens } = req.body;

  // Convert any file blocks to inline base64 format OpenRouter/Gemini understands
  const converted = messages.map(m => {
    if (!Array.isArray(m.content)) return m;
    const content = m.content.map(b => {
      if (b.type === 'file') {
        return {
          type: 'image_url',
          image_url: { url: b.file.file_data } // already data:application/pdf;base64,...
        };
      }
      return b;
    });
    return { ...m, content };
  });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://study-tutor.vercel.app',
        'X-Title': 'UC Study Tutor'
      },
      body: JSON.stringify({
        model: model || 'google/gemini-2.5-flash',
        max_tokens: max_tokens || 2000,
        messages: converted
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
