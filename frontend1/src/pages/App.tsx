import React from "react";
import { ImageUpload } from "../components/ImageUpload";
import { AnalysisResults } from "../components/AnalysisResults";
import { useAnalysisStore } from "../utils/store";
import { Layout } from "../components/Layout";
import { LoadingModal } from "../components/LoadingModal";
import brain from "brain";
import { toast } from "sonner";
import { Activity, Camera, Upload, History, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Analysis() {
  const {
    isAnalyzing,
    selectedImage,
    analysis,
    setIsAnalyzing,
    setSelectedImage,
    setAnalysisResults,
    resetState,
  } = useAnalysisStore();

  const handleImageSelect = async (base64Image: string) => {
    try {
      setSelectedImage(base64Image);
      setIsAnalyzing(true);

      const response = await brain.analyze_stool({ image: base64Image });
      const data = await response.json();
      console.log('Response data:', data);

      if (!data.analysis) {
        throw new Error('No analysis data in response');
      }

      setAnalysisResults(data.analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze image. Please try again.");
      resetState();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTakePhoto = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use the back camera on mobile devices

    // Handle file selection
    input.onchange = async (e) => {
      const file = e.target?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Image = e.target?.result as string;
          handleImageSelect(base64Image);
        };
        reader.readAsDataURL(file);
      }
    };

    // Trigger file selection
    input.click();
  };

  return (
    <Layout>
      <LoadingModal />
      <div className="max-w-6xl mx-auto space-y-8 p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/50 shadow-sm backdrop-blur-sm border border-white/20">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">AI-Powered Analysis</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-health text-transparent bg-clip-text">
              AI Stool Health Analyzer
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Upload a photo for instant analysis and personalized health recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Analysis Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Quick Analysis
              </CardTitle>
              <CardDescription>
                Upload a photo of your 💩 for instant health insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="secondary"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={handleTakePhoto}
                >
                  <Camera className="h-8 w-8" />
                  Take Photo
                </Button>
                <Button
                  variant="secondary"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                >
                  <Upload className="h-8 w-8" />
                  Upload Photo
                </Button>
              </div>
              <div className="hidden">
                <ImageUpload onImageSelect={handleImageSelect} isLoading={isAnalyzing} />
              </div>
            </CardContent>
          </Card>

          {/* Score History Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Score History
              </CardTitle>
              <CardDescription>
                Track your health score over time
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[200px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-lg font-medium">No History Yet</p>
                <p className="text-sm text-muted-foreground">
                  Your score history will appear here after your first analysis.
                  Upload a photo to get started!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Insights Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Health Insights
            </CardTitle>
            <CardDescription>
              Get personalized recommendations and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Upload your first photo to receive detailed health insights and recommendations.
              Our AI will analyze various characteristics including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Color and consistency analysis</li>
              <li>Shape and texture evaluation</li>
              <li>Size and volume estimation</li>
              <li>Abnormality detection</li>
            </ul>

            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium mb-2">Medical Disclaimer:</p>
              <p>
                This AI-powered tool is designed to provide general insights and is not a
                substitute for professional medical advice, diagnosis, or treatment.
                Always consult with a qualified healthcare provider about your health
                concerns. If you're experiencing persistent changes in bowel habits or
                have any concerns, please seek medical attention.
              </p>
            </div>
          </CardContent>
        </Card>

        {selectedImage && !isAnalyzing && analysis && (
          <Card className="bg-card/50 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalysisResults analysis={analysis} />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
