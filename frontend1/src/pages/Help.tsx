import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Camera, Activity, AlertTriangle, History } from "lucide-react";

export default function Help() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/50 shadow-sm backdrop-blur-sm border border-white/20">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Help Center</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-health text-transparent bg-clip-text">
            How to Use the App
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn how to get the most out of your AI Stool Health Analyzer
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Get started with your first analysis in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li className="text-sm">Navigate to the home page</li>
              <li className="text-sm">Click "Take Photo" or "Upload Photo" button</li>
              <li className="text-sm">Wait for the AI to analyze your sample</li>
              <li className="text-sm">Review your results and recommendations</li>
            </ol>
          </CardContent>
        </Card>

        {/* Understanding Your Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Understanding Your Results
            </CardTitle>
            <CardDescription>
              Learn how to interpret your analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="health-score">
                <AccordionTrigger>Health Score</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    The health score is a number from 1-10 that indicates the overall health of your sample:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2">
                    <li className="text-sm"><span className="text-green-600 font-medium">7-10:</span> Healthy range</li>
                    <li className="text-sm"><span className="text-yellow-600 font-medium">4-6:</span> Fair range - some improvements needed</li>
                    <li className="text-sm"><span className="text-red-600 font-medium">1-3:</span> Poor range - consider consulting a healthcare provider</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="metrics">
                <AccordionTrigger>Analysis Metrics</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    We analyze several key characteristics:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li className="text-sm"><span className="font-medium">Color:</span> Indicates diet and health conditions</li>
                    <li className="text-sm"><span className="font-medium">Consistency:</span> Shows digestive efficiency</li>
                    <li className="text-sm"><span className="font-medium">Shape:</span> Reflects bowel function</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="recommendations">
                <AccordionTrigger>Health Recommendations</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Based on your analysis, you'll receive personalized recommendations that may include:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2">
                    <li className="text-sm">Dietary adjustments</li>
                    <li className="text-sm">Lifestyle changes</li>
                    <li className="text-sm">Hydration tips</li>
                    <li className="text-sm">When to seek medical advice</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* History Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              History Tracking
            </CardTitle>
            <CardDescription>
              Monitor your health over time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your analysis history helps you track changes and patterns in your health:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li className="text-sm">View past analyses in the History page</li>
              <li className="text-sm">Filter results by date range</li>
              <li className="text-sm">Track improvements over time</li>
              <li className="text-sm">Identify patterns and trends</li>
            </ul>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium mb-2">Medical Disclaimer:</p>
              <p className="text-muted-foreground">
                This AI-powered tool is designed to provide general insights and is not a
                substitute for professional medical advice, diagnosis, or treatment.
                Always consult with a qualified healthcare provider about your health
                concerns. If you're experiencing persistent changes in bowel habits or
                have any concerns, please seek medical attention.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
