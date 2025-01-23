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

interface HealthMetric {
  name: string;
  value: string;
  severity: string;
  description: string;
  category: string;
}

interface Props {
  metrics: HealthMetric[];
  recommendations: string[];
}

const categoryIcons = {
  appearance: Eye,
  composition: Droplets,
  consistency: Scale,
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

function MetricCard({ metric }: { metric: HealthMetric }) {
  const severity = severityConfig[metric.severity as keyof typeof severityConfig];
  const CategoryIcon = categoryIcons[metric.category as keyof typeof categoryIcons];

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div
        className={`absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20 bg-${severity.bg}`}
      />
      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2 bg-${severity.color}-100 text-${severity.color}-600 transition-colors`}
            >
              <CategoryIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">{metric.name}</h3>
              <p
                className={`text-sm font-medium text-${severity.color}-600 flex items-center gap-1.5`}
              >
                {React.createElement(severity.icon, {
                  className: "h-3.5 w-3.5",
                })}
                {severity.label}
              </p>
            </div>
          </div>
               </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {metric.description}
        </p>
      </div>
      <div
        className={`absolute bottom-0 left-0 h-1 bg-${severity.color}-500 transition-all duration-300 group-hover:h-1.5`}
        style={{
          width: metric.severity === "normal" ? "25%" : 
                metric.severity === "mild" ? "50%" :
                metric.severity === "moderate" ? "75%" : "100%",
        }}
      />
    </Card>
  );
}

export function AnalysisResults({ metrics, recommendations }: Props) {
  // Group metrics by category
  const groupedMetrics = React.useMemo(() => {
    return metrics.reduce((acc, metric) => {
      const category = metric.category || "other";
      return {
        ...acc,
        [category]: [...(acc[category] || []), metric],
      };
    }, {} as Record<string, HealthMetric[]>);
  }, [metrics]);

  return (
    <div className="space-y-8">
      {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">    {React.createElement(categoryIcons[category as keyof typeof categoryIcons] || Activity, {
              className: "h-5 w-5 text-primary",
            })}
            <h2 className="text-lg font-semibold capitalize">{category}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>
      ))}

      <Card className="overflow-hidden bg-gradient-to-br from-white to-green-50/30">
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
            {recommendations.map((recommendation, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
              >
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
// Compare this snippet from UI%20Components/Navigation.tsx: