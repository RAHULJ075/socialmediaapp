import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from "./api/posts";
function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const filteredResults = posts.filter((post) =>
      post.body.toLowerCase().includes(search.toLowerCase()) ||
      post.title.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (err) {
        if (err.response) {
          console.error(err.response.data);
          console.error(err.response.status);
          console.error(err.response.headers);
        } else {
          console.error(`Error : ${err.message}`);
        }
      }
    }
    fetchPosts();
  }, [])
  const handleSubmit = (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    const allPosts = [...posts, newPost]
    setPosts(allPosts);
    setPostTitle('');
    setPostBody('');
    navigate('/');
  };

  const handleDelete = (id) => {
    const postsList = posts.filter(post => post.id !== id);
    setPosts(postsList);
    navigate('/');
  };

  return (
    <div className="App">
      <Header title="Rahul Social Media" />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home posts={searchResults} />} />
        <Route path="/newpost" element={
          <NewPost
            postBody={postBody}
            setPostBody={setPostBody}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            handleSubmit={handleSubmit}
          />
        } />
        <Route path="/post/:id" element={<PostPage posts={posts} handleDelete={handleDelete} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
