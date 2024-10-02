import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import SignUp from './pages/SignUp.js';
import Login from './pages/Login.js';
import Home from './pages/Home.js';
import Search from './components/Search.js';
import Profile from './components/Profile.js';
import OtherProfile from './components/OtherProfile.js';
import AddPost from './components/AddPost.js';
import { useEffect } from 'react';
import instance from './utils/axios.js';
import { useDispatch } from 'react-redux';
import Logout from './pages/Logout.js';



function App() {
  
  let dispatch = useDispatch();
  let navigate = useNavigate();
  useEffect(() => {
    const gettingUser = async () => {
      try {
        let checker = await instance.get('/holder/getUser');
        if (checker.status === 200) {
          console.log('in app js',checker.data.data);
          dispatch({ type: 'SET_USER', payload: checker.data.data });
          navigate('/app');
        }
        else {
          navigate('/login');
        }
      } catch (error) {
        console.log(error);
        if (error.message==='Network Error' || error.response.status > 399) {
          navigate('/login');
        }
      }
      
    }

    gettingUser();
},[])
  return (
    <div className="App">
      <Routes>
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/app' element={<Home />} />
        <Route path='/search' element={<Search />}>
          <Route path=':username' element={<OtherProfile/> } />
        </Route>
        <Route path='/profile' element={<Profile />} />
        <Route path='/addPost' element={<AddPost />} />
      </Routes>
      
    </div>
  );
}

export default App;
