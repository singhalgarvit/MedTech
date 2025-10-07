import React from "react";

function TestimonialCard({ testimonial ,name, title}) {
  return (
      <div className="max-w-2xl mx-auto">
        <p className="text-lg italic mb-4">{testimonial}</p>
        <p className="text-sm text-gray-600">- {name}</p>
      </div>
  );
}

export default TestimonialCard;
