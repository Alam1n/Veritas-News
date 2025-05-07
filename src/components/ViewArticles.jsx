import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Showcase from './ShowCase'; // Import Showcase component

export default function ViewArticles() {
    const [groupedArticles, setGroupedArticles] = useState({});
    const [categoryPages, setCategoryPages] = useState({});
    const navigate = useNavigate();

     useEffect(() => {
        async function fetchArticles() {
            const res = await fetch('https://alaminapi.pythonanywhere.com/articles');
            const data = await res.json();

            const grouped = {};
            data.forEach(article => {
                const cat = article.category || "Uncategorized";
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(article);
            });

            setGroupedArticles(grouped);

            const initPages = {};
            Object.keys(grouped).forEach(cat => initPages[cat] = 0);
            setCategoryPages(initPages);
        }

        fetchArticles();
    }, []);

    const handleNext = (category) => {
        setCategoryPages(prev => ({
            ...prev,
            [category]: prev[category] + 1
        }));
    };

    const handlePrev = (category) => {
        setCategoryPages(prev => ({
            ...prev,
            [category]: Math.max(prev[category] - 1, 0)
        }));
    };
    
    return (
        <div>
        
        {/* Sticky Header */}
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backgroundColor: '#343a40',
            padding: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <h1 style={{ color: 'white', margin: 0 }}>News App</h1>
        </header>

        {/* Sticky Category Navigation */}
        <div style={{
            display: 'flex',
            gap: '10px',
            position: 'sticky',
            top: '70px', // push below the header height
            left: '20px',
            backgroundColor: 'white',
            border: 'none',
            padding: '10px',
            zIndex: 999,
            flexWrap: 'wrap',
            alignItems: 'center'
        }}>
            <h4 style={{ margin: 0, marginRight: '10px' }}> Categories</h4>
            {Object.keys(groupedArticles).map(category => (
                <a
                    key={category}
                    href={`#${category}`}
                    onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(category);
                        if (el) {
                            const yOffset = -100;
                            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                    }}
                    style={{ textDecoration: 'none', color: '#ff8c00' }}
                >
                    {category}
                </a>
            ))}
        </div>
    {/* Showcase Section */}
            <Showcase />  {/* This will display the Showcase Section on top */}

            <h1> Articles by Category</h1>
            <hr style={{
                    border: 'none',
                    borderTop: '2px solid #343a40',
                    margin: '30px 0'
                }} />
            <div >
                {Object.entries(groupedArticles).map(([category, articles]) => {
                    const page = categoryPages[category] || 0;
                    const start = page * 4;
                    const visibleArticles = articles.slice(start, start + 4);

                    return (
                        <div key={category} id={category} style={{ marginBottom: '40px' }}>
                            <h2  style={{
                                scrollMarginTop: '100px', // Adjust based on your nav height
                                paddingTop: '10px'
                            }}>
                               {category}</h2>
                              <hr style={{
                                    border: 'none',
                                    borderTop: '2px solid #ff8c00',
                                    margin: '30px 0'
                                }} />
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {visibleArticles.map(article => {
                                    const rawPath = article.image_path.replace(/\\/g, "/");
                                    const imgSrc = `https://alaminapi.pythonanywhere.com/${rawPath}`;
                                    

                                    return (
                                        <div
                                            key={article.id}
                                            className="card"
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                width: '270px',
                                                backgroundColor: '#f9f9f9',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                display: 'flex'
                                                
                                                
                                            }}
                                            onClick={() => navigate(`/article/${article.id}`)}
                                        >
                                            <img
                                                src={imgSrc}
                                                alt={article.title}
                                                style={{ width: '100%', borderRadius: '5px' }}
                                            />
                                            <div style={{ fontWeight: 'bold' }}>{article.title}</div>
                                            <div style={{ fontSize: '13px', color: '#555' }}>{article.category}</div>
                                            <div style={{ fontSize: '12px', color: '#777' }}>
                                                {new Date(article.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ marginTop: '10px' }}>
                                {page > 0 && <button onClick={() => handlePrev(category)}  style={{
                                                                                        backgroundColor: '#ff8c00',
                                                                                        color: 'white',
                                                                                        border: 'none',
                                                                                        borderRadius: '5px',
                                                                                        padding: '6px 12px',
                                                                                        marginRight: '10px',
                                                                                        cursor: 'pointer'
                                                                                    }}>⬅ Prev</button>}
                                {start + 4 < articles.length && <button onClick={() => handleNext(category)} style={{
                                                                                        backgroundColor: '#ff8c00',
                                                                                        color: 'white',
                                                                                        border: 'none',
                                                                                        borderRadius: '5px',
                                                                                        padding: '6px 12px',
                                                                                        marginRight: '10px',
                                                                                        cursor: 'pointer'
                                                                                    }}>Next ➡</button>}
                                    
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}