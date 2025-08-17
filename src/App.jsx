
import { useState } from 'react';
import './App.css';
import pasteIcon from './assets/image.png';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');
    try {
      // Replace with your backend endpoint
      const response = await fetch('http://localhost:3000/predict-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // Expecting: { webcode_prediction, url_prediction, final_decision }
      setResult({
        webcode: data.webcode_prediction,
        url: data.url_prediction,
        decision: data.final_decision,
      });
    } catch (err) {
      setError('Failed to check the URL. Please try again.');
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container">
        <header className="header">
          <h1>Phishing Website Detector</h1>
        </header>
        <form className="url-form" onSubmit={handleSubmit}>
          <input
            type="url"
            className="url-input"
            placeholder="Enter website URL..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
          />
          <button
            type="button"
            className="paste-btn"
            title="Paste URL from clipboard"
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                setUrl(text);
              } catch {
                setError('Failed to read clipboard.');
              }
            }}
          >
            <img src={pasteIcon} alt="Paste" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Checking...' : 'Check URL'}
          </button>
        </form>
        <div className="result-section">
          {loading && <div className="loader">Loading...</div>}
          {result && (
            <div className={`result ${result.decision && result.decision.includes('Phishing') ? 'phishing' : 'safe'}`}>
              <div><strong>Webcode Prediction:</strong> {result.webcode === 1 ? 'Phishing' : 'Safe'}</div>
              <div><strong>URL Prediction:</strong> {result.url === 1 ? 'Phishing' : 'Safe'}</div>
              <div><strong>Final Decision:</strong> {result.decision}</div>
            </div>
          )}
          {error && <div className="error">{error}</div>}
        </div>
      </div>
  );
}

export default App;
