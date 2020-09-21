import React from "react";
import { ClockLoader } from "react-spinners";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "fixed",
        zIndex: 1000000,
        background: "#ffffffad",
        width: "100vw",
        top: 0,
        left: 0,
      }}
    >
      <ClockLoader />
    </div>
  );
};

export default Loading;
