import FAQs from "../sections/FAQs";
import Footer from "../sections/Footer";
import HeroSection from "../sections/HeroSection";
import Navbar from "../sections/Navbar";
import Testimonials from "../sections/Testimonials";
import WhyUs from "../sections/WhyUs";

function Home() {
  return (
    <>
      <Navbar/>
      <HeroSection/>
      <WhyUs/>
      <Testimonials/>
      <FAQs/>
      <Footer/>
    </>
  );
}

export default Home;
