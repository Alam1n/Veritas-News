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

  return (
    <div>
       <div>
    <Navigation />
    {/* Rest of your page */}
  </div>
      <h2>📑 Article Dashboard</h2>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Created At</th>
            <th>Showcase</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(article => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.category}</td>
              <td>{new Date(article.created_at).toLocaleString()}</td>
              <td>{article.is_showcase ? '✅' : '❌'}</td>
              <td>
                <button onClick={() => handleToggleShowcase(article.id, article.is_showcase)}>
                  {article.is_showcase ? 'Remove Showcase' : 'Add Showcase'}
                </button>
                &nbsp;
                <button onClick={() => setSelectedArticle(article)}>Edit</button>
                &nbsp;
                <button onClick={() => handleDelete(article.id)} style={{ color: 'red' }}>
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
