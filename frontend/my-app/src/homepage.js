import React, { useState, useEffect } from 'react';
import Navbar from './default/header';
import Footer from './default/footer';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './css/homepage.css';
import { getUsername } from './auth/login';
import {Link, useNavigate} from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 

  const navigate = useNavigate();
  useEffect(() => {
    const username = getUsername();
    if(!!username){
        fetch('http://localhost:5000/app/home')
        .then(response => response.json())
        .then(data => setPosts(data));
        setIsLoggedIn(!!username);
    }
    else{
      navigate(`/`)
    }
    
  }, []);

  const handlePostClick = (postId) => {
    console.log(`Post ID: ${postId}`);
  }

  return (
    <div>
      <Navbar />
      <div className="post-list">
        <h1 className="post-title-heading-main">Posts</h1>
        <h2>{getUsername()}</h2>
        {posts.map((post) => (
          <div key={post.post_id} className="post-card" onClick={() => handlePostClick(post.post_id)}>
            <div className="post-header">
              <h2 className="post-title">Post {post.post_id}</h2>
              <p className="username">@{post.username}</p>
            </div>
            <p className="post-text">{post.post_text}</p>
            {post.attachment && (
              <img src={post.attachment} alt="Attachment" className="post-attachment" />
            )}
            <div className="post-stats">
              <div className="likes">
                <FaThumbsUp className="icon" /> <span className="count">{post.positive}</span>
              </div>
              <div className="dislikes">
                <FaThumbsDown className="icon" /> <span className="count">{post.negative}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
}

export default Home;
