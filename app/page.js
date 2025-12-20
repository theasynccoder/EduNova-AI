"use client";

import { UserButton } from "@clerk/nextjs";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex flex-col">
      
      {/* Top Bar */}
      <div className="w-full flex justify-end p-5">
        <UserButton />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-6 text-white">
        
        <h1 className="text-5xl font-extrabold drop-shadow-lg">
          AI-Powered Online Learning Platform
        </h1>

        <p className="mt-4 text-lg max-w-2xl opacity-90">
          Create and enroll in smart AI-generated courses instantly.
          Our SaaS platform builds custom course roadmaps, YouTube-based learning
          content, and complete structured lessons — all automatically.
        </p>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-4xl text-left">
          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold">🎓 Create Courses</h3>
            <p className="text-sm opacity-90 mt-2">
              Users can generate full courses using AI based on any topic.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold">📚 Enroll & Learn</h3>
            <p className="text-sm opacity-90 mt-2">
              Enroll in your AI-built course and learn with structured content.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold">🚀 Custom Roadmaps</h3>
            <p className="text-sm opacity-90 mt-2">
              Each course includes an auto-generated roadmap + YouTube content.
            </p>
          </div>
        </div>

        {/* Get Started Button */}
        <Button
          onClick={() => router.push("/workspace")}
          className="mt-10 px-10 py-4 bg-white text-purple-700 font-semibold text-lg rounded-full shadow-2xl hover:scale-105 transition-all"
        >
          Get Started →
        </Button>

        {/* Modern UI Buttons */}
        <div className="mt-10 flex flex-col md:flex-row gap-6 items-center justify-center">
          <a href="https://learnai.aftabmadni.me" target="_blank" rel="noopener noreferrer">
            <Button
              variant="default"
              size="lg"
              className="bg-white text-purple-700 rounded-full shadow-2xl hover:bg-purple-100 hover:scale-105 transition-all px-10 py-4 text-lg border border-purple-300"
            >
              LearnAI
            </Button>
          </a>
          <a href="https://edupluse.aftabmadni.me" target="_blank" rel="noopener noreferrer">
            <Button
              variant="default"
              size="lg"
              className="bg-white text-pink-700 rounded-full shadow-2xl hover:bg-pink-100 hover:scale-105 transition-all px-10 py-4 text-lg border border-pink-300"
            >
              EduPluse
            </Button>
          </a>
          <a href="https://learnaiquiz.aftabmadni.me" target="_blank" rel="noopener noreferrer">
            <Button
              variant="default"
              size="lg"
              className="bg-white text-blue-700 rounded-full shadow-2xl hover:bg-blue-100 hover:scale-105 transition-all px-10 py-4 text-lg border border-blue-300"
            >
              LearnAI Quiz
            </Button>
          </a>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center text-white py-5 opacity-80">
        © {new Date().getFullYear()} EduNova AI Learning — AI SaaS Platform
      </footer>
    </div>
  );
};

export default Page;
