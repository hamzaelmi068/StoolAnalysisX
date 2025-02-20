import { SignInOrUpForm } from "app";
import React from 'react';
import { Layout } from "@/components/Layout"; // Assuming you have a Layout component
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; //shadcn ui components

export default function Login() {
  return (
    <Layout> {/* Wrap the login page content in your existing Layout component */}
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <Card className="relative px-4 py-10 bg-card/50 backdrop-blur-sm border-white/20 shadow-lg sm:rounded-3xl sm:p-20">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-health text-transparent bg-clip-text">
                  AI Stool Health Analyzer
                </h1>
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Unlock personalized insights into your gut health.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInOrUpForm signInOptions={{ google: true }} />
              <div className="pt-6 text-base font-semibold sm:text-lg sm:leading-7 text-center">
                <p className="text-gray-500">
                  Forgot your password? <a href="#" className="text-blue-600 hover:text-blue-800">Reset Password</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}