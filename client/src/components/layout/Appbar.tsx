import { AnimatePresence, motion, Variants } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { authContext } from "../../contexts/authContext";
import { logout } from "../../services/authService";
import moon from "../../assets/moon.svg";

const Appbar = () => {
  const [logoutUser, { data }] = useMutation(logout);
  const [open, setOpen] = useState(false);

  const closeM = () => setOpen(!open);

  const {
    auth: { user },
    dispatch,
  } = useContext(authContext);

  useEffect(() => {
    if (data) {
      dispatch({ type: `LOGOUT` });
    }
  }, [data, dispatch]);

  const variants: Variants = {
    initial: {
      y: -1000,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: 1000,
      opacity: 0,
    },
  };

  return (
    <>
      <div className="appbar">
        <div className="appbar-wrapper">
          <div className="logo sm">
            <Link to="/">
              MO
              <object
                data={moon}
                className="logo-svg"
                type="image/svg+xml"
                style={{
                  transform: `rotateZ(180deg)`,
                }}
              >
                O
              </object>
              N
            </Link>
          </div>
          <div className="menu-icon sm">
            <div className="material-icons" onClick={() => setOpen(!open)}>
              {open ? "close" : "menu"}
            </div>
          </div>
          <div className="account lg">
            {user ? (
              <>
                <Link to={`/profile/${user._id}`}>
                  <span className="material-icons">account_circle</span>
                </Link>
                <span onClick={() => logoutUser()} className="material-icons">
                  power_settings_new
                </span>
              </>
            ) : (
              <>
                <Link to="/login">Log In</Link>
                <Link to="/register">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            transition={{
              type: "tween",
              duration: 0.4,
            }}
            exit="exit"
            className="menu"
          >
            <div>
              <ul id="menu-items">
                <li className="npad" onClick={closeM}>
                  <Link to="/create-property">Sell</Link>
                </li>
                <li className="npad" onClick={closeM}>
                  <Link to="/find">Find</Link>
                </li>
                <li className="npad" onClick={closeM}>
                  <Link to="/">Home</Link>
                </li>
                <li className="npad" onClick={closeM}>
                  <Link to="/listings">Listings</Link>
                </li>
                {user ? (
                  <li className="npad">
                    <Link to={`/profile/${user._id}`} onClick={closeM}>
                      Profile
                    </Link>
                  </li>
                ) : (
                  <li className="npad">
                    <Link to="/login">Log In</Link>
                    <Link style={{ marginLeft: "12px" }} to="/register">
                      Sign Up
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Appbar;
