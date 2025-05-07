import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav style={{ marginBottom: '20px' }}>
      <Link to="/create">📝 Create Article</Link> |{' '}
      <Link to="/manager">🛠️ Manage Articles</Link> |{' '}
      <Link to="/">🏠 Home</Link>
    </nav>
  );
};

export default Navigation;
