import React from "react";
import { Layout } from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, Shield, LineChart, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-16 p-4 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/50 shadow-sm backdrop-blur-sm border border-white/20">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">AI-Powered Health Insights</span>
          </div>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-health text-transparent bg-clip-text mb-6">
              Transform Your Gut Health with AI Analysis
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get instant, accurate analysis of your stool health using advanced AI technology.
              Track your digestive health and receive personalized recommendations.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/login">
                Start Your Analysis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground">Comprehensive tools for monitoring your digestive health</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-white/20">
              <CardHeader>
                <Brain className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Instant AI Analysis</CardTitle>
                <CardDescription>
                  Upload a photo and receive immediate insights about your stool health
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-white/20">
              <CardHeader>
                <LineChart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Health Tracking</CardTitle>
                <CardDescription>
                  Monitor your digestive health over time with detailed metrics and trends
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-white/20">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Private & Secure</CardTitle>
                <CardDescription>
                  Your data is encrypted and securely stored with strict privacy measures
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Simple steps to better understand your gut health</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Upload Photo",
                description: "Take or upload a photo of your stool sample"
              },
              {
                step: "2",
                title: "AI Analysis",
                description: "Our AI analyzes color, consistency, and shape"
              },
              {
                step: "3",
                title: "Get Insights",
                description: "Receive detailed health insights and recommendations"
              }
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-white/20">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose GutAI?</h2>
            <p className="text-muted-foreground">Advanced technology meets user-friendly design</p>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Instant analysis with advanced AI technology",
                  "Track your digestive health over time",
                  "Receive personalized health recommendations",
                  "Secure and private data handling",
                  "Easy-to-use interface",
                  "Regular updates and improvements"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 py-8">
          <h2 className="text-3xl font-bold">Ready to Start?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Begin your journey to better gut health with AI-powered analysis and personalized insights.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/login">
              Start Your Analysis
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
