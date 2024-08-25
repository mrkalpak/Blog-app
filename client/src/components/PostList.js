import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(10); // Number of posts per page

  const fetchPosts = async (page) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts?page=${page}&limit=${limit}`);
    setPosts(response.data.posts);
    // console.log(response.data.posts);
    setTotalPages(response.data.totalPages);
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);
  const stripHtmlTags = (html) => {
    // Remove HTML tags using a regex
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };
  return (
    <div className="container mt-4">
      <h2 className='text-center' style={{color:"#1E2026"}}>All Blogs</h2>
      <div className="row">
        {posts.map((post) => (
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
        ))}
      </div>
      <div className="d-flex justify-content-center mt-4">
        <button 
          className="btn btn-secondary" 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
         <i className='bi bi-caret-left-fill'/>
        </button>
        <span className="mx-2 mt-1">{`Page ${currentPage} of ${totalPages}`}</span>
        <button 
          className="btn btn-secondary" 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
         <i className='bi bi-caret-right-fill'/>
        </button>
      </div>
    </div>
  );
};

export default PostList;
