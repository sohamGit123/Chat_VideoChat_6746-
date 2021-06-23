import NavBar from './components/Navbar'
import "./App.css"
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import Registration from './components/screens/Registration'
import Admin from './components/screens/Admin'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import Reset from './components/screens/Reset'
import Newpassword from './components/screens/Newpassword'
import React,{useEffect,createContext,useReducer,useContext} from 'react'
import {reducer,initialState} from './reducers/userReducer'
import SubscribedUserPost from './components/screens/SubscribedUserPosts'
import Messenger from './components/screens/Messenger'
import VideoChat from './components/screens/VideoChat'

export const UserContext=createContext()


const Routing=()=>{
  const history=useHistory()
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
    console.log("state in app becomes: "+state)
    //console.log("user: "+user)
    if(user){
      dispatch({type:"USER",payload:user})
      console.log("state becomes: "+state)
      // history.push('/')
    }
    else{
      if(!history.location.pathname.startsWith('/reset') && !history.location.pathname.startsWith('/signup')){
        history.push('/signin')
      }
    }
  },[])
  return (
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>

      <Route exact path="/profile">
        <Profile/>
      </Route>

      <Route exact path="/messenger">
        <Messenger/>
      </Route>
      {
        /*
          swastik
        */ 
      }
      <Route exact path="/video">
        <VideoChat/>
      </Route>
      {
        /*
          swastik
        */ 
      }
      <Route path="/signin">
        <Signin/>
      </Route>

      <Route exact path="/signup">
        <Signup/>
      </Route>

      <Route path="/signup/:token/:email">
        <Registration/>
      </Route>

      <Route path="/admin">
        <Admin/>
      </Route>

      <Route path="/create">
        <CreatePost/>
      </Route>

      <Route path="/profile/:userid">
        <UserProfile/>
      </Route>

      <Route exact path="/reset">
          <Reset/>
      </Route>

      <Route path="/reset/:token">
          <Newpassword/>
      </Route>

      <Route path="/myfollowings">
          <SubscribedUserPost/>
      </Route>

    </Switch>
  )
}

function App() {
  const [state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <div className="sticky">
          <NavBar/>
        </div>
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
