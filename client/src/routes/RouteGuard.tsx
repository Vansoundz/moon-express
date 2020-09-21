import React, { ElementType, FC, useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { authContext } from "../contexts/authContext";

const RouteGuard: FC<RouteProps> = ({ component, ...rest }) => {
  const {
    auth: { user },
  } = useContext(authContext);

  const renderFn = (Component?: ElementType) => (props: RouteProps) => {
    if (!Component) return null;
    if (!user)
      return (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      );
    return <Component {...props} />;
  };

  return <Route {...rest} render={renderFn(component)} />;
};

export default RouteGuard;
