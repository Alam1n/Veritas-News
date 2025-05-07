import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Showcase() {
    const [showcaseArticles, setShowcaseArticles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchArticles() {
            const res = await fetch('https://alaminapi.pythonanywhere.com/articles');
            const data = await res.json();
            console.log(data)
            const featured = data.filter(article => article.is_showcase === true);
            console.log(data)
            setShowcaseArticles(featured);
        }

        fetchArticles();
    }, []);

    useEffect(() => {
        if (!hovered && showcaseArticles.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % showcaseArticles.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [hovered, showcaseArticles]);
    
    if (showcaseArticles.length === 0) return null;

    const currentArticle = showcaseArticles[currentIndex];
    const imgSrc = `https://alaminapi.pythonanywhere.com/${currentArticle.image_path.replace(/\\/g, "/")}`;

    // Handle next and prev manually
    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % showcaseArticles.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? showcaseArticles.length - 1 : prev - 1
        );
    };

    return (
        <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)} 
        style={{
            position: 'relative',
            width: '100%',
            maxHeight: '320px',
            overflow: 'hidden',
            marginBottom: '30px',
            borderRadius: '10px',
            justifyContent:'center',
            display:'flex',
            margin: '0 auto',
            top: 0,
            left: 0
            

        }}>
            <img
                src={imgSrc}
                alt={currentArticle.title}
                style={{
                    width: '90%',
                    height: '320px',
                    objectFit: 'cover',
                    filter: 'brightness(0.5)',
                    transition: 'all 0.5s ease',
                    
                    

                }}
            />

            {/* Text Content */}
            <div style={{
                position: 'absolute',
                top: '60%',
                left: '7%',
                transform: 'translateY(-50%)',
                color: '#fff', 
                maxWidth: '500px'
            }}>
                <h2>{currentArticle.title}</h2>
                <p>{currentArticle.content.slice(0, 150)}...</p>
                <button onClick={() => navigate(`/article/${currentArticle.id}`)} style={{
                    marginTop: '5px',
                    padding: '12px 8px',
                    backgroundColor: '#ff8c00',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>
                    Read More
                </button>
            </div>

            {/* Arrow Controls */}
            <button onClick={handlePrev} style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                backgroundColor: '#343a40',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '50%',
                cursor: 'pointer'
                
            }}>⬅</button>

            <button onClick={handleNext} style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                backgroundColor: '#343a40',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '50%',
                cursor: 'pointer'  
            }}>➡</button>

            {/* Dots for manual navigation */}
            <div style={{
                position: 'absolute',
                bottom: '15px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: '8px'
            }}>
                {showcaseArticles.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            cursor: 'pointer',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: index === currentIndex ? '#fff' : '#888',
                            transition: 'background-color 0.3s'
                        }}
                    />
                ))}
            </div>

            

        </div>

        
    );
}
