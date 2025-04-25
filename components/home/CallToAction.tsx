import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to join our community?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Sign up today and start connecting with friends, sharing moments, and
          discovering new content.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/signup">Create Account</Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
