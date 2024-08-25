import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MyBlogs = () => {
  const navigate = useNavigate();
 
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
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
    const fetchMyPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/myblogs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('No blogs found, please write one.');
        } else {
          console.error('Error fetching blogs:', err);
        }
      }
    };

    fetchMyPosts();
  }, [token]);

  const deletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(posts.filter((post) => post._id !== postId));
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <div className="container mt-4">
      <h2 className='text-center' style={{ color: "#1E2026" }}>My Blogs</h2>
      <div className="row">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="col-md-3 mb-4" key={post._id}>
              <div className="card shadow-lg">
                {post.imageUrl && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}${post.imageUrl}`}
                    className="card-img-top"
                    alt={post.title}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">
                    {stripHtmlTags(post.content).substring(0, 100)}...
                  </p>
                  <Link to={`/posts/${post._id}`} className="btn btn-custom-primary">
                    Read More
                  </Link>
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="btn btn-warning position-absolute top-0 start-0 mt-2 ms-2"
                  >
                    <i className="bi bi-pencil-fill"></i> Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="btn btn-danger position-absolute top-0 end-0 mt-2 me-2"
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">You have not uploaded any blogs yet. <Link to="/new-post">Write one</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
