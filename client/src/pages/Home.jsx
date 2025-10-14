import FAQs from "../sections/HomePage/FAQs";
import Footer from "../sections/Footer";
import HeroSection from "../sections/HomePage/HeroSection";
import Navbar from "../sections/Navbar";
import Testimonials from "../sections/HomePage/Testimonials";
import WhyUs from "../sections/HomePage/WhyUs";

function Home() {
  return (
    <>
      <HeroSection/>
      <WhyUs/>
      <Testimonials/>
      <FAQs/>
    </>
  );
}

export default Home;
