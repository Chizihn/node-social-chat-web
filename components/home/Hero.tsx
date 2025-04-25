import Link from "next/link";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-center text-gray-900 mb-6">
          Connect with friends and the world around you
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-2xl mb-10">
          Join our community today and start sharing your moments with people
          who matter most to you.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/signup">Join Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
