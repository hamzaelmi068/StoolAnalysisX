import { create } from 'zustand';

interface HealthMetric {
  name: string;
  value: string;
  description: string;
}

interface AnalysisState {
  isAnalyzing: boolean;
  selectedImage: string | null;
  metrics: HealthMetric[];
  recommendations: string[];
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setSelectedImage: (image: string | null) => void;
  setAnalysisResults: (metrics: HealthMetric[], recommendations: string[]) => void;
  resetState: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  isAnalyzing: false,
  selectedImage: null,
  metrics: [],
  recommendations: [],
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setSelectedImage: (image) => set({ selectedImage: image }),
  setAnalysisResults: (metrics, recommendations) => set({ metrics, recommendations }),
  resetState: () => set({
    isAnalyzing: false,
    selectedImage: null,
    metrics: [],
    recommendations: []
  })
}));
