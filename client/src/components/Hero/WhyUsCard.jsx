import React from "react";

function WhyUsCard({SecurityImg, title, description}) {
  return (
    <div className="border-0 p-4 rounded-lg bg-white max-w-sm mx-auto shadow-lg">
      <img src={SecurityImg} alt={title} className="mb-2 rounded-md w-full h-48 object-cover hover:scale-105 transition-all" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}

export default WhyUsCard;
