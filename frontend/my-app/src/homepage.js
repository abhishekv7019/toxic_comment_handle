import React, { useState, useEffect } from 'react';
import Navbar from './default/header';
import Footer from './default/footer';
import { FaThumbsUp, FaThumbsDown, FaUserCircle } from 'react-icons/fa';
import './css/homepage.css';
import { getUsername } from './auth/login';
import { useNavigate } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = getUsername();
    if (!!username) {
      fetch('http://localhost:5000/app/home')
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPosts(data);
          } else {
            console.error('Unexpected data format:', data);
            setPosts([]);
          }
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
          setPosts([]);
        });
      setIsLoggedIn(!!username);
    } else {
      navigate(`/`);
    }
  }, [navigate]);

  const handlePostClick = (postId) => {
    navigate(`/postspecific/${postId}`);
    console.log(`Post ID: ${postId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="post-list">
        <h1 className="post-title-heading-main">Posts</h1>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post.post_id} className="post-card" onClick={() => handlePostClick(post.post_id)}>
              <div className="post-header">
                <FaUserCircle className="user-icon" size={30}/>
                <p className="username">@{post.username}</p>
              </div>
              {post.image_data && (
                <img src={post.image_data} alt="Attachment" className="post-attachment" />
              )}
              <p className="post-text">{post.post_text}</p>
              <div className="post-stats">
                <div className="likes">
                  <FaThumbsUp className="icon" /> <span className="count">{post.positive}</span>
                </div>
                <div className="dislikes">
                  <FaThumbsDown className="icon" /> <span className="count">{post.negative}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
