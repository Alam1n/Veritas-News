import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateArticle from './CreateArticles'; // or wherever it's located
import Navigation from './Navigation';


const ArticleManager = ({ onEdit }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://alaminapi.pythonanywhere.com/me", {
      method: "GET",
      credentials: "include", // important for session
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (!data.user) navigate("/login");
      })
      .catch(() => navigate("/login"));
    }, []);

  const fetchArticles = async () => {
    try {
      const res = await axios.get('https://alaminapi.pythonanywhere.com/view_articles');
      setArticles(res.data);
    } catch (err) {
      setErrorMsg('Failed to load articles.');
    } finally {
      setLoading(false);
    }
  };


  const [selectedArticle, setSelectedArticle] = useState(null);

  if (selectedArticle) {
    return <CreateArticle articleToEdit={selectedArticle} />;
  }


  const handleToggleShowcase = async (id, isShowcase) => {
    const showcaseCount = articles.filter(a => a.is_showcase).length;

    if (!isShowcase && showcaseCount >= 5) {
      setErrorMsg('Only 5 articles can be in the showcase.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    try {
      await axios.put(`https://alaminapi.pythonanywhere.com/article/${id}/showcase`, {
        is_showcase: !isShowcase,
      });
      fetchArticles();
    } catch (error) {
      setErrorMsg('Failed to update showcase status.');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this article?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://alaminapi.pythonanywhere.com/article/${id}/delete`);
      fetchArticles(); // Refresh the list after delete
    } catch (error) {
      setErrorMsg('Failed to delete article.');
    }
  };

  if (loading) return <p>Loading articles...</p>;
  if (errorMsg) return <p style={{ color: 'red' }}>{errorMsg}</p>;
  console.log("onEdit prop received:", onEdit);

  // 🎨 Reusable styles
const thStyle = {
  padding: '12px',
  borderBottom: '2px solid #ddd',
  color: '#333',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '12px',
  verticalAlign: 'middle'
};

const buttonStyle = (bgColor) => ({
  background: bgColor,
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  marginRight: '8px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
});


  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      
  <div>
    <Navigation />
    {/* Rest of your page */}
  </div>

  <h2 style={{ textAlign: 'center', color: '#333' }}>📑 Article Dashboard</h2>

  {errorMsg && <p style={{ color: 'red', textAlign: 'center' }}>{errorMsg}</p>}

  <table style={{
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    fontSize: '16px'
  }}>
    <thead>
      <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
        <th style={thStyle}>Title</th>
        <th style={thStyle}>Category</th>
        <th style={thStyle}>Created At</th>
        <th style={thStyle}>Showcase</th>
        <th style={thStyle}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {articles.map(article => (
        <tr key={article.id} style={{ borderBottom: '1px solid #ddd' }}>
          <td style={tdStyle}>{article.title}</td>
          <td style={tdStyle}>{article.category}</td>
          <td style={tdStyle}>{new Date(article.created_at).toLocaleString()}</td>
          <td style={tdStyle}>{article.is_showcase ? '✅' : '❌'}</td>
          <td style={tdStyle}>
            <button
              onClick={() => handleToggleShowcase(article.id, article.is_showcase)}
              style={buttonStyle(article.is_showcase ? '#ffb703' : '#219ebc')}
            >
              {article.is_showcase ? 'Remove Showcase' : 'Add Showcase'}
            </button>
            <button
              onClick={() => setSelectedArticle(article)}
              style={buttonStyle('#3a86ff')}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(article.id)}
              style={buttonStyle('#d90429')}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
};

export default ArticleManager;
