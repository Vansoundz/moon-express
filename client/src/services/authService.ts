import Axios from "axios";
import User from "../models/UserModel";

const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  let resp = await Axios.post(
    "/api/users/login",
    { username, password },
    { headers: { "Content-Type": "application/json" } }
  );

  return resp.data;
};

const createUser = async ({ user }: { user: User }) => {
  try {
    let resp = await (
      await Axios.post("/api/users/register", {
        ...user,
      })
    ).data;

    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUser = async () => {
  try {
    let resp = await (
      await Axios.get(`http://moon-back.herokuapp.com/api/users`)
    ).data;
    console.log(resp);
    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserById = async (key: string, id: string) => {
  try {
    const resp = await (await Axios.get(`/api/users/${id}`)).data;
    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const logout = async () => {
  let resp = await (await Axios.post("/api/users/logout")).data;
  return resp;
};

const update = async ({ user, profile }: { user: User; profile?: File }) => {
  try {
    if (!user._id) return { errors: [{ msg: "Unauthorized" }] };
    const form = new FormData();
    if (profile) {
      form.append("image", profile);
    }
    if (user.name) form.append("name", user.name);

    // @ts-ignore
    if (user.socialMedia) form.append("socialMedia", user.socialMedia);
    let resp = await (await Axios.patch(`/api/users`, form)).data;

    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { login, createUser, getUser, logout, getUserById, update };
