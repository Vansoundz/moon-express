import React, { FormEvent, useContext, useEffect, useState } from "react";
import { createUser } from "../../services/authService";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "react-query";
import { authContext } from "../../contexts/authContext";
import { useHistory } from "react-router-dom";
import Loading from "../layout/Loading";
import User from "../../models/UserModel";
import { Helmet } from "react-helmet";

const Register = () => {
  const [userData, setUserData] = useState<User>({});

  const [pass, setPass] = useState("");
  const ufeed = document.querySelector(".error.username");
  const pfeed = document.querySelector(".error.password");
  const ffeed = document.querySelector(".error.name");
  const efeed = document.querySelector(".error.email");
  const rfeed = document.querySelector(".error.pass");

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  const [createNewUser, { data, isLoading }] = useMutation(createUser);
  const {
    dispatch,
    auth: { user },
  } = useContext(authContext);

  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push("/");
    }

    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (data?.errors) {
      data.errors.forEach(({ msg, param }: { msg: string; param: string }) => {
        if (param === "username") {
          ufeed!.textContent = msg;
        }
        if (param === "password") {
          pfeed!.textContent = msg;
        }
        if (param === "name") {
          ffeed!.textContent = msg;
        }
        if (param === "email") {
          efeed!.textContent = msg;
        }
      });

      setTimeout(() => {
        if (ufeed) ufeed.textContent = "";
        if (efeed) efeed.textContent = "";
        if (pfeed) pfeed.textContent = "";
        if (rfeed) rfeed.textContent = "";
        if (ffeed) ffeed.textContent = "";
      }, 4000);
    } else if (data?.user) {
      dispatch({ type: "LOGIN", payload: data.user });
    }
    // eslint-disable-next-line
  }, [data]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    ufeed!.textContent = "";
    pfeed!.textContent = "";

    let { username, name, email, password } = userData;
    if (!username) {
      ufeed!.textContent = "Username is required";
    } else if (!email) {
      efeed!.textContent = "Email is required";
    } else if (!password) {
      pfeed!.textContent = "Password is required";
    } else if (!name) {
      ffeed!.textContent = "Name is required";
    } else if (password.length < 6) {
      pfeed!.textContent = "Password must be 6 or more characters";
    } else if (pass !== password) {
      rfeed!.textContent = "Passwords do not match";
    } else {
      await createNewUser({ user: userData });
      // let resp = await register(userData);
      // if (resp) {
      //   setFeed(resp.msg);
      // } else {
      //   setFeed("");
      // }
    }

    setTimeout(() => {
      if (ufeed) ufeed.textContent = "";
      if (efeed) efeed.textContent = "";
      if (pfeed) pfeed.textContent = "";
      if (rfeed) rfeed.textContent = "";
      if (ffeed) ffeed.textContent = "";
    }, 4000);
  };

  return (
    <form onSubmit={onSubmit} className="auth">
      <Helmet>
        <title>Moon: Create Account</title>
      </Helmet>
      {isLoading && <Loading />}
      <div style={{ display: "flex" }}>
        <div style={{ margin: "auto" }}>
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
              <span className="form-icon material-icons">email</span>
              <input
                className="uk-input"
                type="text"
                placeholder="email"
                onChange={onChange}
                id="email"
              />{" "}
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `100%` }}
                  exit={{ height: 0 }}
                  className="error email"
                ></motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="">
            <div className="form-item">
              <span className="form-icon material-icons">person</span>
              <input
                className="uk-input"
                type="text"
                placeholder="full name"
                onChange={onChange}
                id="name"
              />
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `100%` }}
                  exit={{ height: 0 }}
                  className="error name"
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
              />{" "}
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

          <div className="">
            <div className="form-item">
              <span className="form-icon material-icons ">lock</span>
              <input
                className="uk-input"
                type="password"
                placeholder="repeat password"
                id="pass"
                onChange={(e) => setPass(e.target.value)}
              />{" "}
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `100%` }}
                  exit={{ height: 0 }}
                  className="error pass"
                ></motion.div>
              </AnimatePresence>
            </div>
          </div>

          <button className="uk-button">Sign up</button>
        </div>
      </div>
    </form>
  );
};

export default Register;
