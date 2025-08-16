
import { useState } from 'react';
import './App.css';

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
      const response = await fetch('http://localhost:5000/api/check-phishing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResult(data.isPhishing ? 'Phishing Website Detected!' : 'Website is Safe.');
    } catch (err) {
      setError('Failed to check the URL. Please try again.');
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
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Checking...' : 'Check URL'}
        </button>
      </form>
      <div className="result-section">
        {loading && <div className="loader">Loading...</div>}
        {result && <div className={`result ${result.includes('Phishing') ? 'phishing' : 'safe'}`}>{result}</div>}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default App;
