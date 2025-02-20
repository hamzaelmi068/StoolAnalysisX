import React from "react";
import { Card } from "@/components/ui/card";
import {
  Check,
  AlertCircle,
  Activity,
  Droplets,
  Shapes,
  Eye,
  Scale,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";

interface StoolAnalysis {
  color: string;
  consistency: string;
  shape: string;
  health_score: number;
  concerns: string[];
  recommendations: string[];
}

interface Props {
  analysis: StoolAnalysis;
}

const metricIcons = {
  color: Eye,
  consistency: Scale,
  shape: Shapes,
  health_score: Activity,
};

const severityConfig = {
  normal: {
    icon: Check,
    color: "green",
    bg: "green-50",
    label: "Normal",
  },
  mild: {
    icon: AlertCircle,
    color: "yellow",
    bg: "yellow-50",
    label: "Mild",
  },
  moderate: {
    icon: AlertTriangle,
    color: "orange",
    bg: "orange-50",
    label: "Moderate",
  },
  severe: {
    icon: AlertOctagon,
    color: "red",
    bg: "red-50",
    label: "Severe",
  },
};

function MetricCard({ name, value, icon: Icon }: { name: string; value: string | number; icon: React.ElementType }) {
  // Format health score as "X of 10"
  const displayValue = name === "health score" ? `${value} of 10` : value;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-2 bg-primary/10 text-primary transition-colors">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold capitalize">{name}</h3>
              <p className="text-sm text-muted-foreground">{displayValue}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AnalysisResults({ analysis }: Props) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Analysis Results</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard name="color" value={analysis.color} icon={metricIcons.color} />
          <MetricCard name="consistency" value={analysis.consistency} icon={metricIcons.consistency} />
          <MetricCard name="shape" value={analysis.shape} icon={metricIcons.shape} />
          <MetricCard name="health score" value={analysis.health_score} icon={metricIcons.health_score} />
        </div>
      </div>

      {analysis.concerns.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Health Concerns</h2>
          </div>
          <ul className="space-y-3">
            {analysis.concerns.map((concern, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-700/80 transition-colors"              >
                <span className="mt-1 flex-shrink-0">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </span>
                <span className="text-sm leading-relaxed">{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Card className="overflow-hidden bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-emerald-900/20">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold bg-gradient-health text-transparent bg-clip-text">
              Health Recommendations
            </h2>
          </div>
          <ul className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-700/80 transition-colors"              >
                <span className="mt-1 flex-shrink-0">
                  <Check className="h-4 w-4 text-green-500" />
                </span>
                <span className="text-sm leading-relaxed">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}