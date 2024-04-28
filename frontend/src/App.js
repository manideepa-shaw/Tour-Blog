import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import { MainHeader } from './shared/components/Navigation/MainHeader';
import { MainNavigation } from './shared/components/Navigation/MainNavigation';
import { UserPlaces } from './places/pages/UserPlaces';
import { UpdatePlace } from './places/pages/UpdatePlace';
import { Auth } from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import React, { useState,useCallback } from 'react';

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false)
  const [userId, setuserId] = useState(null)
  const logging = useCallback((uid)=>{
    setisLoggedIn(true)
    setuserId(uid)
  },[])

  const logout = useCallback(()=>{
    setuserId(null)
    setisLoggedIn(false)
  },[])

  let routes;
  if(isLoggedIn)
  {
    
    routes=(
      <Switch>
        <Route exact path="/">
            <Users />
          </Route>
          <Route path="/:userId/places" exact>
          <UserPlaces/>
          </Route>
          <Route exact path="/places/new" >
            <NewPlace />
          </Route>
          <Route exact path="/places/:placeId">
            <UpdatePlace/>
          </Route>
          <Redirect to="/" />
      </Switch>
    );
  }
  else{
    routes = (<Switch>
      <Route exact path="/">
        <Users />
      </Route>
      <Route path="/:userId/places">
        <UserPlaces/>
      </Route>
      <Route exact path="/auth">
        <Auth/>
      </Route>
      <Redirect to="/auth" />
    </Switch>)
  }
  return (
    <div className="App">
        <AuthContext.Provider value={{isLoggedIn:isLoggedIn,
        logging : logging,
        logout : logout,
        userId : userId
        }} >
          <Router>
            <MainNavigation/>
            <main>{routes}</main>
          </Router>
        </AuthContext.Provider>
    </div>
  );
}

export default App;
