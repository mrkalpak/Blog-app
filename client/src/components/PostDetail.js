import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from './CommentSection'; // Import the CommentSection component

const PostDetail = () => {
  const token = localStorage.getItem("");
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${id}`);
      setPost(response.data);
    };
    fetchPost();
  }, [id]);

  const formatTimeAgo = (dateString) => {
    const publishDate = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now - publishDate;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    } else {
      const diffInYears = Math.floor(diffInDays / 365);
      return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mt-4 px-5">
      <div className='px-5'>
        <span className='fw-bolder fs-1'>{post.title}</span>
        <div className='d-flex '>

        <p className='text-muted'><strong>Published:</strong> <br/> {formatTimeAgo(post.publishDate)}</p>
        <p className='text-muted ms-3'><strong>By:</strong> <br/> {post.userId.username}</p>
        </div>
      </div>
      {post.imageUrl && <img src={`${process.env.REACT_APP_API_URL}${post.imageUrl}`} alt={post.title} className="img-fluid my-3 blog-image" />}
      <div className='bg-white p-3 border rounded' dangerouslySetInnerHTML={{ __html: post.content }} />
      <CommentSection postId={id} token={token} /> {/* Add CommentSection here */}
    </div>
  );
};

export default PostDetail;
