import React, { useState, useEffect } from 'react';
import Header from './default/header';
import './css/postit.css';
import {useNavigate} from 'react-router-dom';
import { getUsername } from './auth/login';
import Footer from './default/footer';

const PostForm = () => {
  const [postText, setPostText] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const handleTextChange = (event) => {
    setPostText(event.target.value);
  };
  
  useEffect(() => {
    const username = getUsername();
    if (!!username) {
      // do noting
    } else {
      navigate(`/`);
    }
  }, [navigate]);
  
  
  const handlePhotoChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('postText', postText); // Add postText to the form data
    formData.append('image', file); 
    const username = getUsername();
    formData.append('username', username);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setPostText('');
      setFile(null);
      navigate('/home');
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="unique-form-container">
        <form className="unique-post-form" onSubmit={handleSubmit}>
          <h2 className="unique-form-title">Create a New Post</h2>
          <div className="unique-form-group">
            <label htmlFor="postText">Post Text:</label>
            <textarea
              id="postText"
              className="unique-form-control"
              value={postText}
              onChange={handleTextChange}
              placeholder="What's on your mind?"
            />
          </div>
          <div className="unique-form-group">
            <label htmlFor="photo">Upload Photo:</label>
            <input
              type="file"
              id="photo"
              className="unique-form-control"
              onChange={handlePhotoChange}
            />
          </div>
          <button type="submit" className="unique-submit-button">Post</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PostForm;
