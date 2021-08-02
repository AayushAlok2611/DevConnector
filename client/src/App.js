import './App.css';
import React,{useEffect} from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Posts from './components/posts/Posts';

//Redux
import {Provider} from "react-redux"; //Combines react app with redux store
import store from "./store";
import Profile from './components/profile/Profile';
import Post from './components/post/Post';


const App = () => {

  useEffect(()=>{
    if(localStorage.token){
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());  

  },[]);
  return (
    <Provider store={store}>
    <Router>
      <React.Fragment>   
        <Navbar/>
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert/>
          <Switch>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/profiles" component={Profiles}/>
            <Route exact path="/profile/:id" component={Profile}/>
            <PrivateRoute exact path="/dashboard" component={Dashboard}/>
            <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
            <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
            <PrivateRoute exact path="/add-experience" component={AddExperience}/>
            <PrivateRoute exact path="/add-education" component={AddEducation}/>
            <PrivateRoute exact path="/posts" component={Posts}/>
            <PrivateRoute exact path="/posts/:id" component={Post}/>

          </Switch>
        </section>
      </React.Fragment>
    </Router>
    </Provider>
  );
}

export default App;
