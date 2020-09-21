import React, { FormEvent, useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import { authContext } from "../../contexts/authContext";
import { login } from "../../services/authService";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../layout/Loading";
import { Helmet } from "react-helmet";

const Login = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const ufeed = document.querySelector(".error.username");
  const pfeed = document.querySelector(".error.password");
  const history = useHistory();

  const {
    dispatch,
    auth: { user },
  } = useContext(authContext);

  useEffect(() => {
    if (user) {
      history.push("/");
    }
    // eslint-disable-next-line
  }, [user]);

  const [loginUser, { data, error, isLoading }] = useMutation(login);

  useEffect(() => {
    if (data?.errors) {
      data.errors.forEach(({ msg, param }: { msg: string; param: string }) => {
        if (param === "username") {
          ufeed!.textContent = msg;
        }
        if (param === "password") {
          pfeed!.textContent = msg;
        }
      });
    } else if (data?.user) {
      dispatch({ type: "LOGIN", payload: data.user });
    }
    // eslint-disable-next-line
  }, [data, error]);

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    ufeed!.textContent = "";
    pfeed!.textContent = "";

    let { username, password } = userData;
    if (!username) {
      ufeed!.textContent = "Username is required";
    } else if (!password) {
      pfeed!.textContent = "Password is required";
    } else if (password.length < 6) {
      pfeed!.textContent = "Password must be 6 or more characters";
    } else {
      await loginUser({ username, password });
    }

    setTimeout(() => {
      if (ufeed) ufeed.textContent = "";
      if (pfeed) pfeed.textContent = "";
    }, 4000);
  };

  return (
    <form onSubmit={onSubmit} className="auth">
      <Helmet>
        <title>Moon: Login</title>
      </Helmet>

      {isLoading && <Loading />}
      <div>
        <div>
          <h4>Login</h4>
          <div className="">
            <div className="form-item">
              <span className="form-icon material-icons">person</span>
              <input
                className="uk-input"
                type="text"
                placeholder="username"
                onChange={onChange}
                id="username"
              />{" "}
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `100%` }}
                  exit={{ height: 0 }}
                  className="error username"
                ></motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="">
            <div className="form-item">
              <span className="form-icon material-icons ">lock</span>
              <input
                className="uk-input"
                type="password"
                placeholder="password"
                id="password"
                onChange={onChange}
              />
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `100%` }}
                  exit={{ height: 0 }}
                  className="error password"
                ></motion.div>
              </AnimatePresence>
            </div>
          </div>

          <button type="submit" className="uk-button">
            Log in
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
