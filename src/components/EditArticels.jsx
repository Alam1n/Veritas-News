import React, { useState } from 'react';
import ArticleManager from './ArticleManager'; // updated import
import CreateArticle from './CreateArticles';

export default function EditArticleWrapper() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div>
      {!selectedArticle ? (
        <ArticleManager onEdit={setSelectedArticle} />
      ) : (
        <CreateArticle articleToEdit={selectedArticle} />
      )}
    </div>
  );
}