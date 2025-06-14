import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useError } from "../context/ErrorContext";
import { Link, useSearchParams } from 'react-router-dom';
import NewsItem from '../components/NewsItem';
import { newsAPI } from '../api/news';
import handleApiErrors from "../utils/handleApiErrors";

export default function News({ userId }) {
  const { userData } = useAuth();
  const { setErrorCode, setErrorMessage } = useError();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleNewsDeleted = (newsId) => {
    setNews(prevNews => prevNews.filter(item => item.post_body.news_id !== newsId));
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        let newsData;
        if (typeof userId === "undefined") {
          newsData = await newsAPI.getNews();
        } else {
          newsData = await newsAPI.getUserNews(userId);
        }
        setNews(newsData);
      } catch (err) {
          handleApiErrors(err, setErrorCode, setErrorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="news-header d-flex justify-content-between align-items-end mb-5">
              <h1 className="news-title">News</h1>
              {userData && (
                <Link to="/news/create-news" className="btn-add-news">
                  <i className="bi bi-plus-lg me-2"></i>Add News
                </Link>
              )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading news...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="card shadow text-center py-5">
              <div className="card-body">
                <i className="bi bi-newspaper display-1 text-muted mb-4"></i>
                <h3 className="card-title">No news yet</h3>
                <p className="card-text">
                  Be the first to share the news!
                </p>
                <Link to="/news/create-news" className="btn-add-news">
                  Create news
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {news.map(item => (
                <NewsItem key={item.post_body.news_id} news={item} onNewsDeleted={handleNewsDeleted} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}