import React, { createContext, FC, useReducer } from "react";
import { Auth } from "../models/UserModel";
import { Action, authReducer, initialState } from "./reducers/authReducer";

interface IAuthContext {
  auth: Auth;
  dispatch: React.Dispatch<Action>;
}

export const authContext = createContext<IAuthContext>({
  auth: initialState,
  dispatch: (v: Action) => {},
});

const AuthContext: FC = ({ children }) => {
  const [auth, authDispatch] = useReducer(authReducer, initialState);
  return (
    <authContext.Provider value={{ auth, dispatch: authDispatch }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContext;
