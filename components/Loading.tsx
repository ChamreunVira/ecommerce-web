import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-64 flex justify-center items-center">
      <div className="animate-spin w-20 h-20 border-4 rounded-full border-t-indigo-500 border-slate-300"></div>
    </div>
  );
};

export default Loading;
