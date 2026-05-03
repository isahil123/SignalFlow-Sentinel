import React from "react";

const TargetCard = ({ target }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-4">
      <h3 className="font-bold">{target?.name || "Loading..."}</h3>
      <p className="text-gray-400 text-sm">{target?.url}</p>
    </div>
  );
};

export default TargetCard;
