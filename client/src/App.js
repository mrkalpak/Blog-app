import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import NewPost from './pages/NewPost';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import "./App.css"
import SideNav from './components/SideNav';
import PostList from './pages/PostList';

import MyBlogsPage from './pages/MyblogsPage';
import EditPost from './components/EditPost';
const App = () => {
  const [token, setToken] = useState();
  useEffect(()=>{
    setToken(localStorage.getItem("token"));
  },[])

  

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header token={token}/>
        <div className='d-flex'>

        <SideNav />
        <main  className="content flex-grow-1 min-vh-100" >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostPage   />} />
            <Route path="/new-post" element={localStorage.getItem("token")? <NewPost /> : <LoginForm setToken={setToken} />} />
            <Route path="/myblogs" element={ localStorage.getItem("token") ? <MyBlogsPage  /> : <LoginForm setToken={setToken}  />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm setToken={setToken} />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            {/* <Route path="/edit-post/:id" component={(props) => <EditPost token={token} {...props} />} /> */}
          </Routes>
        </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
