import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
// import Properties from "../components/property/Properties";
import Profile from "../components/profile/Profile";
import CreateProperty from "../components/property/CreateProperty";
import Find from "../components/property/Find";
import { AnimatePresence } from "framer-motion";
import RouteGuard from "./RouteGuard";
import ViewProperty from "../components/property/ViewProperty";
import Listings from "../components/property/Listings";
import SearchPage from "../components/property/SearchPage";
import EditProperty from "../components/property/EditProperty";
import Landing from "../components/landing/Landing";
import EditProfile from "../components/profile/EditProfile";

const Routes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <AnimatePresence exitBeforeEnter>
      <Switch location={location}>
        <Route path="/" exact component={Landing} />
        <Route path="/search" exact component={SearchPage} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/find" exact component={Find} />
        <Route path="/listings" exact component={Listings} />
        <Route path="/property/:id" exact component={ViewProperty} />
        <RouteGuard path="/create-property" exact component={CreateProperty} />
        <RouteGuard path="/edit/property/:id" exact component={EditProperty} />
        <RouteGuard path="/edit/profile/" exact component={EditProfile} />
        <Route path="/profile/:id" exact component={Profile} />
      </Switch>
    </AnimatePresence>
  );
};

export default Routes;
