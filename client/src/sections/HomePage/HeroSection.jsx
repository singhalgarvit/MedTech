
import HeroImg from '../../assets/Medicine-bro.png'
import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <div className="hero-section flex md:flex-row flex-col items-center justify-center md:justify-between px-6 md:px-20 py-12 gap-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="hero-content">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Revolutionizing Healthcare with Technology</h1>
        <p className="text-lg md:text-xl mb-8">Connecting patients and doctors through intelligent solutions — from online consultations to AI-powered diagnosis.</p>
        <Link to="/doctors" className="bg-white text-blue-500 font-semibold py-2 px-4 rounded hover:bg-gray-200 transition-all">Get Started</Link>
      </div>
      <div className="hero-image">
          <img src={HeroImg} alt="Hero" className=" md:w-lg rounded-lg hover:drop-shadow-[0_5px_10px_rgba(256,256,256,0.7)] transition-all shadow-white h-[400px]" />
      </div>
    </div>
  )
}

export default HeroSection