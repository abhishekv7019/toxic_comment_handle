import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/PostSpecificPage.css'; // Import the CSS file
import { FaThumbsUp, FaThumbsDown, FaUserCircle } from 'react-icons/fa';
import Navbar from './default/header';
import { AiOutlinePaperClip } from 'react-icons/ai';
import {useNavigate} from 'react-router-dom';
import { getUsername } from './auth/login';
import Footer from './default/footer';

function PostSpecificPage() {
    const { postId } = useParams(); // Get postId from URL params
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentt, setCommentt] = useState('');
    
    const navigate = useNavigate();
    const handleCommentChange = (e) => {
        setCommentt(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Comment submitted:', commentt);
        postComment(commentt);
        setCommentt(''); 
    };

    const postComment = async (comment) => {
        const username = getUsername();
        try {
            const response = await fetch('http://localhost:5000/api/submit_comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment, username, postId })
            });
            if (response.ok) {
                console.log('Comment posted successfully');
                // Optionally, refresh comments after posting
                fetchPostData();
            } else {
                console.error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const fetchPostData = async () => {
        try {
            const response = await fetch('http://localhost:5000/postspecifipage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post_id: postId }),
            });

            const data = await response.json();
            setPost(data.post);
            setComments(data.comments);
        } catch (error) {
            console.error('Error fetching post data:', error);
        }
    };

    useEffect(() => {
        const username = getUsername();
    if (!!username) {
        fetchPostData();
    }
     else {
        navigate(`/`);
      }
    }, [postId]);

    // Inline CSS styles
    const styles = {
        commentBox: {
            border: '1px solid #dcdcdc',
            borderRadius: '8px',
            padding: '15px',
            width: '100%',
            boxSizing: 'border-box',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#f9f9f9',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
        textarea: {
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            resize: 'none',
            marginBottom: '10px',
            fontFamily: 'inherit',
            fontSize: '14px',
            boxSizing: 'border-box',
        },
        actions: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        icon: {
            fontSize: '24px',
            cursor: 'pointer',
        },
        button: {
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
        },
    };

    return (
        <div>
            <Navbar />
            <div className="post-specific-page">
                <h1>Post Details</h1>
                {post && (
                    <div className="post-detail">
                        <div className="post-header">
                            <div className="post-header-info">
                            <FaUserCircle className="profile-icon" />
                                <h2 className="post-username">{post.username}</h2>
                            </div>
                        </div>
                        <p className="main_post-text">{post.post_text}</p>
                        {post.image_data && <img src={post.image_data} alt="Post" className='post-image' />}
                        <div className="post-stats">
                            <div className="likes">
                                <FaThumbsUp className="icon" size={30} /> <span className="count">{post.positive}</span>
                            </div>
                            <div className="dislikes">
                                <FaThumbsDown className="icon" size={30} /> <span className="count">{post.negative}</span>
                            </div>
                        </div>
                    </div>
                )}
                <div className="comments">
                    <h2>Comments</h2>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div
                                key={comment.comment_id}
                                className={`comment ${comment.final_severity === 'positive' ? 'positive' : 'negative'}`}
                            >
                                <FaUserCircle className="profile-icon" />
                                <div className="comment-text">
                                    <p className="username">{comment.username}:</p>
                                    <p>{comment.comment_text}</p>
                                    <p className="severity">Sentiment: {comment.final_severity}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>
                <div style={styles.commentBox}>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <textarea
                            value={commentt}
                            onChange={handleCommentChange}
                            placeholder="Write a comment..."
                            style={styles.textarea}
                        />
                        <div style={styles.actions}>
                            <AiOutlinePaperClip style={styles.icon} />
                            <button type="submit" style={styles.button}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PostSpecificPage;
