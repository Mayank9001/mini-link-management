import React from "react";
import { RotatingLines } from "react-loader-spinner";

const Loading = () => {
  return (
    <RotatingLines
        visible={true}
        height="50"
        width="50"
        strokeWidth="5"
        strokeColor="#1B48DA"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{position:"relative", display: "flex", justifyContent: "center", alignItems: "center", height:"100vh"}}
        wrapperClass=""
    />
  )
};

export default Loading;