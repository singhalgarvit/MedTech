import {Link} from "react-router-dom";
import { FaLocationDot,FaPhoneVolume  } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";

function Footer() {

    const data = [
        {
            title: "Quick Links",  
            links: [
                { name: "Home", to: "#home" },
                { name: "About", to: "#about" },
                { name: "Services", to: "#services" },
                { name: "Contact", to: "#contact" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Help", to: "#help" },
                { name: "FAQs", to: "#faqs" },
                { name: "Privacy Policy", to: "#privacy-policy" },
                { name: "Terms of Service", to: "#terms-of-service" }
            ]
        },
        {
            title: "Contact",
            links: [
                { icon: <FaLocationDot />, name: "Jaipur, India", to: "https://www.google.com/maps/search/+Jaipur%2C+Rajasthan" },
                { icon: <FaEnvelope />, name: "hello@medtech.com", to: "mailto:hello@medtech.com" },
                { icon: <FaPhoneVolume />, name: "+91 6375560097", to: "tel:+916375560097" }
            ]
        }
    ];

    const year = new Date().getFullYear();

  return (
    <div className="footer py-12 px-6 text-center bg-gray-500 text-white">
      <div className="mb-6 flex flex-col md:flex-row justify-evenly gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-4">MedTech</h2>
          <p>Transforming Healthcare With Intelligent Technology.</p>
        </div>
        {data.map((section, index) => (
            <div key={index} className="flex flex-col mb-4 items-start gap-2">
                <h2 className="text-xl font-semibold mb-2 underline">{section.title}</h2>
                {section.links.map((link, linkIndex) => (
                    <Link key={linkIndex} to={link.to} className="hover:text-black transition-all duration-300 flex gap-2 items-center">
                       {link.icon}{link.name}
                    </Link>
                ))}
            </div>
        ))}
      </div>
      <p>&copy; {year} MedTech. All rights reserved.</p>
    </div>
  );
}


export default Footer;
