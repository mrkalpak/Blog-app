import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RichTextEditor from './RichTextEditor';

const EditPost = () => {
  
  const { id } = useParams(); // Get the post ID from the URL
  const navigate  = useNavigate();
  useEffect(() => {
    // Redirect to login if the token is not present
    if (!token) {
      navigate('/login'); // Redirect to login page
    }
  }, [token, navigate]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
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
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setImageUrl(response.data.imageUrl);
      } catch (err) {
        console.error('Error fetching post:', err);
      }
    };
    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/myblogs'); // Redirect to the user's blogs after successful update
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className='text-center'>Edit Post</h2>
      <form className='my-3 border bg-white p-4 rounded-4 shadow' onSubmit={handleUpdatePost}>
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
          <label htmlFor="image" className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={handleImageChange}
          />
          {imageUrl && (
            <div className="mt-2">
              <img
                src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                alt="Post"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
        <div className='text-center'>

        <button type="submit" className="btn btn-custom-primary">Update Post</button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
