module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { comentario } = req.body || {};
  if (!comentario || typeof comentario !== 'string' || comentario.trim().length < 5) {
    return res.status(400).json({ status: 'error', message: 'Comentario demasiado corto.' });
  }

  try {
    const url = new URL(process.env.APPS_SCRIPT_URL);
    url.searchParams.set('action', 'saveFeedback');
    url.searchParams.set('comentario', comentario.trim());

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Apps Script respondió con ${response.status}`);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    console.error('[ERROR] saveFeedback:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
