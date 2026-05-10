import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-[70vh] flex justify-center items-center">
      <div className="animate-ping w-20 h-20 border-4 rounded-full border-t-orange-500 border-slate-300"></div>
    </div>
  );
};

export default Loading;
