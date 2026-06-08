module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const url = `${process.env.APPS_SCRIPT_URL}?action=getDirectos`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Apps Script respondió con ${response.status}`);
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err) {
    console.error('[ERROR] getDirectos:', err);
    return res.status(500).json({ error: err.message });
  }
};
