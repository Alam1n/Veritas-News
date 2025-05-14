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

    const rawPath = article.image_path?.replace(/\\/g, "/");
    const imgSrc = rawPath ? `https://alaminapi.pythonanywhere.com/${rawPath}` : null;

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', fontFamily: 'Arial' }}>
            {imgSrc && (
                <img
                    src={imgSrc}
                    alt={article.title}
                    style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }}
                />
            )}
            <h1>{article.title}</h1>
            <div style={{ color: '#888' }}>{new Date(article.created_at).toLocaleString()}</div>
            <div style={{ color: '#888' }}>Category: {article.category}</div>
            <hr />
            <p style={{ whiteSpace: 'pre-line' }}>{article.content}</p>
        </div>
    );
}
