import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ postId, token }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${postId}`);
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('You must be logged in to comment.');
      return;
    }
    try {
        console.log(postId)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comments`,
        { postId, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  return (
    <div className="mt-4">
      
      
      <form className='border bg-white shadow rounded p-3 my-3' onSubmit={handleAddComment}>
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">Add a comment</label>
          <textarea
            id="comment"
            className="form-control"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-custom-primary">Post Comment</button>
      </form>
      <h4 className="my-3">Comments</h4>
      <div className='bg-white border rounded my-3 pt-3'>

      {comments.map((comment) => (
        <div key={comment._id} className="  px-3 py-1 ">
          <p><strong>{comment.userId.username}:</strong> </p>
          <p>{comment.content}</p>
          <hr/>
        </div>
      ))}
      </div>
    </div>
  );
};

export default CommentSection;
