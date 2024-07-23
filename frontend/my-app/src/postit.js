import React, { useState } from 'react';
import Header from './default/header';
import './css/postit.css'
import Footer from './default/footer';

const PostForm = () => {
  const [postText, setPostText] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleTextChange = (event) => {
    setPostText(event.target.value);
  };

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Post Text:", postText);
    console.log("Photo:", photo);
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
      <Footer/>
    </div>
  );
};

export default PostForm;
