import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAnalysisStore } from "../utils/store";

const ANALYSIS_STEPS = [
  "Analyzing sample characteristics...",
  "Evaluating color patterns and consistency...",
  "Measuring physical dimensions...",
  "Calculating Bristol scale rating...",
  "Assessing hydration indicators...",
  "Detecting potential irregularities...",
  "Computing comprehensive health score...",
  "Generating personalized recommendations..."
];

const STEP_DURATION = 2000; // 2 seconds per step

export function LoadingModal() {
  const { isAnalyzing, setCurrentStatus } = useAnalysisStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStepIndex(0);
      setCurrentStatus(null);
      return;
    }

    // Set initial status
    setCurrentStatus(ANALYSIS_STEPS[0]);

    // Rotate through status messages
    const interval = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % ANALYSIS_STEPS.length;
        setCurrentStatus(ANALYSIS_STEPS[nextIndex]);
        return nextIndex;
      });
    }, STEP_DURATION);

    return () => clearInterval(interval);
  }, [isAnalyzing, setCurrentStatus]);

  return (
    <Dialog open={isAnalyzing} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showClose={false}>
        <div className="flex flex-col items-center justify-center py-8 px-2 space-y-6">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium animate-fade-in">
              {ANALYSIS_STEPS[currentStepIndex]}
            </p>
            <p className="text-sm text-muted-foreground">
              Please wait while we analyze your sample...
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
