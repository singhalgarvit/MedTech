import WhyUsCard from "../../components/Hero/WhyUsCard";
import SecurityImg from "../../assets/Security.jpg";
import AiImg from "../../assets/ai.jpg";
import SupportImg from "../../assets/support.jpg";
import ScheduleImg from "../../assets/Schedule.jpg";

function WhyUs() {
  const data = [
    {
      SecurityImg: SecurityImg,
      title: "Secure Patient Data",
      description:
        "Your health information stays private — always. We use end-to-end encryption and advanced security protocols to keep your medical records completely safe.",
    },
    {
      SecurityImg: AiImg,
      title: "AI-Powered Insights",
      description:
        "Our AI algorithms analyze your health data to provide personalized insights and recommendations, helping you make informed decisions about your care.",
    },
    {
      SecurityImg: ScheduleImg,
      title: "Easy Scheduling",
      description:
        "Easily schedule appointments and manage your healthcare needs with our user-friendly platform.",
    },
    {
      SecurityImg: SupportImg,
      title: "24×7 Support",
      description:
        "Our support team is available around the clock to assist you with any questions or concerns you may have.",
    },
  ];
  return (
    <div className="text-center py-16 px-6 md:px-20 bg-gray-100">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.map((item,index) => (
          <WhyUsCard
            key={index} 
            SecurityImg={item.SecurityImg}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}

export default WhyUs;
