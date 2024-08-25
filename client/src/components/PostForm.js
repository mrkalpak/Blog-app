import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from './RichTextEditor';
const PostForm = () => {
 
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  
  const [token, setToken] = useState('token');
  useEffect(()=>{
    setToken(localStorage.getItem("token"));
  },[])

  useEffect(() => {
    // Redirect to login if the token is not present
    console.log(token)
    if (!token) {
      navigate('/login'); // Redirect to login page
    }
  }, [token, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/myblogs');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className='text-center'>Create New Post</h2>
      <form className='my-3 border bg-white p-4 rounded-4 shadow' onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className='text-center'>

        <button type="submit" className="btn btn-custom-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
