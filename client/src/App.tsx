import React, { useContext, useEffect } from "react";
import Navigation from "./components/layout/Navigation";
import Routes from "./routes/Routes";

import { authContext } from "./contexts/authContext";
import { useQuery } from "react-query";
import { getUser } from "./services/authService";
import Appbar from "./components/layout/Appbar";
import Loading from "./components/layout/Loading";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { data, error } = useQuery("get user", getUser);

  const {
    dispatch,
    auth: { loading },
  } = useContext(authContext);

  useEffect(() => {
    if (data && data.user) {
      dispatch({ type: `LOGIN`, payload: data.user });
    } else if (data && data.errors) {
      dispatch({ type: `STOP` });
    } else {
      dispatch({ type: `STOP` });
    }
    if (error) {
      dispatch({ type: `STOP` });
    }
    // eslint-disable-next-line
  }, [data, error]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="app">
          <Navigation />
          <div className="">
            <Appbar />
            <Routes />
          </div>
          <ToastContainer position="top-right" hideProgressBar={true} />
        </div>
      )}
    </>
  );
};

export default App;
