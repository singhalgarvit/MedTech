import TestimonialCard from "../components/Hero/TestimonialCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Testimonials() {
  var settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  };

  const data = [
    {
      testimonial: "This platform has transformed my healthcare experience. Highly recommend!",
      name: "Garvit Singhal",
    },
    {
      testimonial: "Booking appointments is now faster than ever — such a smooth experience!",
      name: "Riya Sharma",
    },
    {
      testimonial: "The AI assistant gave me quick insights that helped me understand my symptoms better.",
      name: "Dr. Arjun Mehta",
    },
    {
      testimonial: "Loved the clean design and easy navigation. Feels like the future of healthcare.",
      name: "Aditi Verma",
    },
    {
      testimonial: "Finally, a medical platform that saves both time and stress. Great job, team!",
      name: "Rohan Patel",
    },
  ];

  return (
    <div className="text-center py-12 px-6 md:px-20 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">
        Testimonials
      </h2>
      <Slider {...settings}>
        {data.map(({testimonial, name}, index) => (
          <TestimonialCard key={index} testimonial={testimonial} name={name} />
        ))}
      </Slider>
    </div>
  );
}

export default Testimonials;
