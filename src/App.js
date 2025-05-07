// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { AuthGuard } from './components/AuthGuard';
//import PrivateRoute from './components/PrivateRoute';
import EditArticleWrapper from './components/EditArticels';
import LoginPage from './components/LoginPage';
import CreateArticle from './components/CreateArticles';
import ViewArticles from './components/ViewArticles';
import ViewArticle from './components/ViewArticle';
import ArticleManager from './components/ArticleManager';

axios.defaults.withCredentials = true;

function App() {
  return (
   
      <Router>
        <Routes>
          <Route path="/" element={<ViewArticles />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/article/:id" element={<ViewArticle />} />
          <Route path="/create" element={<CreateArticle />} />
          <Route path="/manager" element={<ArticleManager />} />
          <Route path="/edit" element={<EditArticleWrapper/>}/>
          </Routes>
      </Router>
    
  );
}

export default App;
