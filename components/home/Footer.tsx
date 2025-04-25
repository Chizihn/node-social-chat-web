import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Our Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-blue-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-blue-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-blue-400">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-blue-400">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="hover:text-blue-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-blue-400">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-blue-400">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-blue-400">
                  Developers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-blue-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-blue-400">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-blue-400">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <Link href="#" className="hover:text-blue-400">
                <Facebook size={24} />
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <Twitter size={24} />
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <Instagram size={24} />
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <Linkedin size={24} />
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              Contact us at: support@example.com
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Your Social Media App. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
