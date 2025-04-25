import React from "react";
import { Users, MessageSquare, Bell, Camera } from "lucide-react";

const Feature = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-3 bg-blue-100 rounded-full mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Users size={24} className="text-blue-600" />,
      title: "Connect with Friends",
      description:
        "Find and follow your friends, family, and interesting people around the world.",
    },
    {
      icon: <MessageSquare size={24} className="text-blue-600" />,
      title: "Real-time Messaging",
      description:
        "Chat instantly with your connections through our lightning-fast messaging system.",
    },
    {
      icon: <Bell size={24} className="text-blue-600" />,
      title: "Personalized Notifications",
      description:
        "Stay updated with notifications about the content and people you care about.",
    },
    {
      icon: <Camera size={24} className="text-blue-600" />,
      title: "Share Moments",
      description:
        "Post photos, videos, and updates to share your experiences with your network.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Our Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
