import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ViewArticle() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    
    useEffect(() => {
        async function fetchArticle() {
            const res = await fetch(`https://alaminapi.pythonanywhere.com/article/${id}`);
            const data = await res.json();
            setArticle(data);
        }
        fetchArticle();
    }, [id]);

    if (!article) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', fontFamily: 'Arial' }}>
            <h1>{article.title}</h1>
            <div style={{ color: '#888' }}>{new Date(article.created_at).toLocaleString()}</div>
            <div style={{ color: '#888' }}>Category: {article.category}</div> {/* <-- fixed */}
            <hr />
            <p style={{ whiteSpace: 'pre-line' }}>{article.content}</p>
        </div>
    );
}
