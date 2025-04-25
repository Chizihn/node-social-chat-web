import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const TestimonialCard = ({
  content,
  author,
  role,
  image,
}: {
  content: string;
  author: string;
  role: string;
  image: string;
}) => {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <p className="text-gray-600 italic mb-4">&quot;{content}&quot;</p>
      </CardContent>
      <CardFooter className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={image} alt={author} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      content:
        "This platform has completely changed how I stay connected with my friends across the globe.",
      author: "Alex Johnson",
      role: "Marketing Director",
      image: "/images/user.webp",
    },
    {
      content:
        "The user experience is seamless, and I love how easy it is to share my travel experiences.",
      author: "Mia Zhang",
      role: "Travel Blogger",
      image: "/images/user.webp",
    },
    {
      content:
        "I've made so many meaningful connections since joining this community last year.",
      author: "Carlos Rodriguez",
      role: "Entrepreneur",
      image: "/images/user.webp",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
              image={testimonial.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
