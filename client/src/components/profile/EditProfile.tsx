import { AnimatePresence, motion } from "framer-motion";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import User from "../../models/UserModel";
import { getUser, update } from "../../services/authService";
import Loading from "../layout/Loading";
import { Helmet } from "react-helmet";
import facebook from "../../assets/facebook.svg";
import twitter from "../../assets/twitter.svg";
import instagram from "../../assets/instagram.svg";

const EditProfile = () => {
  const { data: usr } = useQuery("get user", getUser);
  const [userData, setUserData] = useState<User>({});
  const [socialMedia, setSocialMedia] = useState<{
    facebook?: string;
    twitter?: string;
    instagram?: string;
  }>();

  useEffect(() => {
    if (usr && usr.user) setUserData(usr.user);
  }, [usr]);

  const ffeed = document.querySelector(".error.name");

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  const [updateUser, { data: user, isLoading }] = useMutation(update);
  const [profile, setProfile] = useState<File | undefined>();

  const history = useHistory();

  useEffect(() => {
    if (user && user.user) {
      toast("Profile updated successfully", { type: "success" });
      history.push(`/profile/${user.user._id}`);
    }

    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (user?.errors) {
      user.errors.forEach(({ msg, param }: { msg: string; param: string }) => {
        if (param === "name") {
          ffeed!.textContent = msg;
        }
      });

      setTimeout(() => {
        if (ffeed) ffeed.textContent = "";
      }, 4000);
    }
    // eslint-disable-next-line
  }, [user]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let { name } = userData;
    if (!name) {
      ffeed!.textContent = "Name is required";
    } else {
      userData.socialMedia = socialMedia;
      await updateUser({ user: userData, profile });
      // let resp = await register(userData);
      // if (resp) {
      //   setFeed(resp.msg);
      // } else {
      //   setFeed("");
      // }
    }

    setTimeout(() => {
      if (ffeed) ffeed.textContent = "";
    }, 4000);
  };

  const onChangeSocial = (e: FormEvent<HTMLInputElement>) => {
    setSocialMedia({
      ...socialMedia,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="auth">
      <Helmet>
        <title>Moon: Edit Profile</title>
      </Helmet>
      {isLoading && <Loading />}
      <div style={{ display: "flex" }}>
        <div style={{ margin: "auto" }}>
          <h4>Update profile</h4>

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
              <object
                data={facebook}
                className="logo-svg form-icon"
                type="image/svg+xml"
                style={{ marginTop: "10px" }}
              >
                f
              </object>
              <input
                className="uk-input"
                type="text"
                placeholder="https://facebook.com/username"
                onChange={onChangeSocial}
                id="facebook"
              />
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `100%` }}
                  exit={{ height: 0 }}
                  className="error facebook"
                ></motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="">
            <div className="form-item">
              <object
                data={twitter}
                className="logo-svg form-icon"
                type="image/svg+xml"
                style={{ marginTop: "10px" }}
              >
                t
              </object>
              <input
                className="uk-input"
                type="text"
                placeholder="https://twiter.com/username"
                onChange={onChangeSocial}
                id="twitter"
              />
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `100%` }}
                  exit={{ height: 0 }}
                  className="error twitter"
                ></motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="">
            <div className="form-item">
              <object
                data={instagram}
                className="logo-svg form-icon"
                type="image/svg+xml"
                style={{ marginTop: "10px" }}
              >
                f
              </object>
              <input
                className="uk-input"
                type="text"
                placeholder="https://instagram.com/username"
                onChange={onChangeSocial}
                id="instagram"
              />
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `100%` }}
                  exit={{ height: 0 }}
                  className="error instagram"
                ></motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="file-field ">
            {profile ? (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: `12px` }}>
                  Selected file:
                  <span>{profile.name}</span>
                </div>
                <div
                  onClick={() => setProfile(undefined)}
                  className="material-icons"
                >
                  close
                </div>
              </div>
            ) : (
              <>
                <div className="">
                  <label style={{ cursor: "pointer" }} htmlFor="file">
                    Select file
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="files"
                    hidden={true}
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;

                      if (files) {
                        setProfile(files[0]);
                      }
                    }}
                  />
                </div>
              </>
            )}
            <AnimatePresence>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `100%` }}
                exit={{ height: 0 }}
                className="error file"
              ></motion.div>
            </AnimatePresence>
          </div>

          <button className="uk-button">Edit Profile</button>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
