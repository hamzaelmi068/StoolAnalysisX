import React from "react";
import { Navigation } from "./Navigation";

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/20">
      <Navigation />
      <div className="relative">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-32 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        
        {/* Content */}
        <main className="relative container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}