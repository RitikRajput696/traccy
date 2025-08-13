"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import TraccyHero from "@/../public/traccy-hero.svg";
import {
  ArrowRight,
  Zap,
  Users,
  Palette,
  Star,
  CheckCircle,
} from "lucide-react";

export default function page() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description:
        "Instant response with real-time collaboration that keeps up with your thoughts.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description:
        "Work together seamlessly with unlimited team members across the globe.",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Infinite Canvas",
      description:
        "Never run out of space with our boundless digital whiteboard experience.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      content:
        "Traccy transformed how our team brainstorms. The intuitive interface makes complex ideas simple to visualize.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "UX Designer",
      content:
        "The real-time collaboration is flawless. It's like we're all in the same room, even when we're continents apart.",
      rating: 5,
    },
    {
      name: "Elena Popov",
      role: "Startup Founder",
      content:
        "From concept to execution, Traccy is our digital thinking space. Couldn't imagine working without it.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      {/* Geometric Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#000"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Geometric shapes */}
          <circle cx="100" cy="100" r="2" fill="#000" opacity="0.3">
            <animate
              attributeName="cy"
              values="100;150;100"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="300" cy="200" r="1" fill="#000" opacity="0.4">
            <animate
              attributeName="cx"
              values="300;350;300"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="700" cy="150" r="1.5" fill="#000" opacity="0.2">
            <animate
              attributeName="cy"
              values="150;200;150"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="900" cy="300" r="1" fill="#000" opacity="0.5">
            <animate
              attributeName="cx"
              values="900;950;900"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Lines */}
          <line
            x1="0"
            y1="300"
            x2="200"
            y2="300"
            stroke="#000"
            strokeWidth="1"
            opacity="0.1"
          >
            <animate
              attributeName="x2"
              values="200;250;200"
              dur="3s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="500"
            y1="0"
            x2="500"
            y2="200"
            stroke="#000"
            strokeWidth="1"
            opacity="0.1"
          >
            <animate
              attributeName="y2"
              values="200;250;200"
              dur="4s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="800"
            y1="100"
            x2="1000"
            y2="200"
            stroke="#000"
            strokeWidth="1"
            opacity="0.1"
          >
            <animate
              attributeName="y1"
              values="100;150;100"
              dur="5s"
              repeatCount="indefinite"
            />
          </line>
        </svg>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-white/90 backdrop-blur-lg border-b border-gray-100"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-black p-2 rounded-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-black">Traccy</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-light mb-8 leading-tight tracking-tight">
              <span className="font-extralight text-gray-400">Think.</span>
              <br />
              <span className="font-normal text-black">Create.</span>
              <br />
              <span className="font-medium text-black relative">
                Collaborate.
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black to-transparent"></div>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              The next-generation whiteboarding experience that transforms ideas
              into reality.
              <br />
              <span className="text-black font-normal">
                Unlimited creativity, zero boundaries.
              </span>
            </p>

            <div className="flex justify-center">
              <a
                href="/canvas"
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                Start Creating Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Demo mockup */}
            <div className="relative max-w-5xl mx-auto mt-20">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl shadow-gray-200/50">
                <Image
                  src={TraccyHero}
                  alt="whiteboarding application showcase"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-6 text-black">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Everything you need to bring your ideas to life, designed for
              modern teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center py-12 px-6 hover:bg-gray-50 transition-all duration-300 rounded-2xl border border-transparent hover:border-gray-100"
              >
                <div className="bg-black text-white p-4 rounded-2xl w-fit mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-medium mb-4 text-black">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-6 text-black">
              Loved by Teams
            </h2>
            <p className="text-xl text-gray-600 font-light">
              See what our users are saying about Traccy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
              >
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-black fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed font-light text-lg">
                  "{testimonial.content}"
                </p>
                <div className="border-t border-gray-100 pt-6">
                  <div className="font-medium text-black">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm font-light">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-light mb-8 text-black">
            Ready to Transform Your Ideas?
          </h2>
          <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
            Join thousands of teams already using Traccy to bring their visions
            to life.
          </p>
          <div className="flex justify-center">
            <a
              href="/canvas"
              className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Start Creating Today
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-8 md:mb-0">
              <div className="bg-black p-2 rounded-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-black">Traccy</span>
            </div>
            <div className="text-gray-500 font-light">
              © 2025 Traccy. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
