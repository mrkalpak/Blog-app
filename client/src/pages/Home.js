import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0);

  const fetchPosts = useCallback(async (searchTerm) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/search?query=${searchTerm}`);
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear the previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to trigger the search after 300ms of inactivity
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        fetchPosts(value);
      } else {
        setPosts([]); // Clear posts if the search term is empty
      }
    }, 300);

    setTypingTimeout(timeoutId);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    fetchPosts(query);   // Fetch posts based on the current query
  };
  const stripHtmlTags = (html) => {
    // Remove HTML tags using a regex
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };
  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1>Welcome to Our Blog</h1>
        <p>Explore a variety of articles and topics!</p>
      </div>
      <form className="input-group mb-4 mt-5" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="form-control"
          placeholder="Search for topics..."
          value={query}
          onChange={handleSearchChange}
        />
        <button type="submit" className="btn btn-custom-primary">
        <i className="bi bi-search"></i>
        </button>
      </form>
      <div className="row">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="col-md-3 mb-4" key={post._id}>
              <div className="card">
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
                  <p className="card-text">
                  <small className="text-muted">By {post.userId.username || 'Unknown'}</small>
                </p>
                  <Link to={`/posts/${post._id}`} className="btn btn-custom-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          query ? (
            <div className="col-12">
              <p className="text-center">No posts found</p>
            </div>
          ) : (
            <div className="col-12">
              <p className="text-center"></p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
