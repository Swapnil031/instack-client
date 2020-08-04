import React, {useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import {BrowserRouter,Route, Switch, useHistory} from 'react-router-dom';
import {Home, Profile, UserProfile, Login, Signup, CreatePost, FollowingPosts} from './components/screens';
import {reducer, initialState} from './reducers/userReducer';

import './App.css';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);

  useEffect(()=>{
    const user = JSON.parse(sessionStorage.getItem("user"));
    if(user){
      dispatch({type:"USER", payload:user})
      history.push('/');
    }
    else{
      history.push('/login');
    }
  }, [])

  return(
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/signup'>
        <Signup />
      </Route>
      <Route path='/login'>
        <Login />
      </Route>
      <Route exact path='/profile'>
        <Profile />
      </Route>
      <Route path='/create'>
        <CreatePost />
      </Route>
      <Route path='/profile/:userid'>
        <UserProfile />
      </Route>
      <Route path='/followingPosts'>
        <FollowingPosts />
      </Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter basename="/instack-client">
        <NavBar />     
        <Routing />
        <Footer />
      </BrowserRouter> 
    </UserContext.Provider>
  );
}

export default App;
