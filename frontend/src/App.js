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
import React, { useState,useCallback, useEffect } from 'react';

let logoutTimer;

function App() {
  const [isToken, setisToken] = useState(null)
  const [userId, setuserId] = useState(null)
  const [tokenExpirationDateTime, settokenExpirationDateTime] = useState()

  const logging = useCallback((uid,token, expirationDate)=>{
    // to expire the localStorage after 1h
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 *60)
    settokenExpirationDateTime(tokenExpirationDate)

    setisToken(token)
    setuserId(uid)

    // setting token in the localStorage
    localStorage.setItem(
    'userData',
    JSON.stringify({userId : uid,
       token: token,
       expiration : tokenExpirationDate.toISOString()
      })
    )

  },[])

  const logout = useCallback(()=>{
    setuserId(null)
    // setisLoggedIn(false)
    setisToken(null)
    settokenExpirationDateTime(null)

    localStorage.removeItem('userData')
  },[])

  // using this so that the user is automatically logged out when the time is more than 1hr
  useEffect(() => {
    if(isToken && tokenExpirationDateTime)
    {
      const remainingTime = tokenExpirationDateTime.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout,remainingTime)
    }
    else
    {
      clearTimeout(logoutTimer)
    }
  }, [isToken,logout,tokenExpirationDateTime])

  // using localStorage data so that when the page reloads the data isn't lost
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if(storedData && storedData.token && new Date(storedData.expiration)>new Date() )
    {
      logging(storedData.userId, storedData.token)
    }
  }, [logging])
  

  let routes;
  if(isToken)
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
        <AuthContext.Provider value={{isLoggedIn: !!isToken,
        token : isToken,
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
