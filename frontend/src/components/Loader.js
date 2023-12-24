import React from "react";

const Loader = () => {
  return (
    <div className="loader-bg" data-testid='loader'>
      <div className="loader-track">
        <div className="loader-fill" />
      </div>
    </div>
  );
};

export default Loader;
