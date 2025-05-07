import { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';


export default function CreateArticle({ articleToEdit }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('Sport');
    const [preview, setPreview] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (articleToEdit) {
            setTitle(articleToEdit.title || '');
            setContent(articleToEdit.content || '');
            setCategory(articleToEdit.category || 'Sport');
            setPreview(articleToEdit.image || '');
        }
    }, [articleToEdit]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setMessage('Title is required!');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        if (image) formData.append('image', image);

        try {
            let response;
            if (articleToEdit) {
                // Update existing article
                response = await fetch(`https://alaminapi.pythonanywhere.com/article/${articleToEdit.id}/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title,
                        content,
                        category
                    }),

                });
            } else {
                // Create new article
                response = await fetch('https://alaminapi.pythonanywhere.com/articles', {
                    method: 'POST',
                    body: formData,
                });
            }

            const result = await response.json();
            if (response.ok) {
                setMessage(articleToEdit ? 'Article updated successfully!' : 'Article created successfully!');
                setTitle('');
                setContent('');
                setCategory('Sport');
                setImage(null);
                setPreview('');
            } else {
                setMessage('Failed to save the article.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div>
             <div>
                <Navigation />
                {/* Rest of your page */}
            </div>
            <h1>{articleToEdit ? 'Edit Article' : 'Create New Article'}</h1>
            <form onSubmit={handleSubmit}>
                <label>Title:</label><br />
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /><br /><br />

                <label>Category:</label><br />
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="Sport">Sport</option>
                    <option value="Business">Business</option>
                    <option value="Innovation">Innovation</option>
                    <option value="Culture">Culture</option>
                    <option value="Arts">Arts</option>
                    <option value="Travel">Travel</option>
                    <option value="Earth">Earth</option>
                </select><br /><br />

                <label>Content:</label><br />
                <textarea rows="4" value={content} onChange={(e) => setContent(e.target.value)} required></textarea><br /><br />

                <label>Image:</label><br />
                <input type="file" onChange={handleImageChange} /><br /><br />

                {preview && <img src={preview} alt="Preview" style={{ maxWidth: '300px' }} />}<br /><br />

                <button type="submit">{articleToEdit ? 'Update' : 'Submit'}</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
