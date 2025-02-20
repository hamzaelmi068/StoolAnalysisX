import { create } from 'zustand';

interface StoolAnalysis {
  color: string;
  consistency: string;
  shape: string;
  health_score: number;
  concerns: string[];
  recommendations: string[];
}

interface HistoryEntry {
  id: string;
  date: string;
  analysis: StoolAnalysis;
}

interface AnalysisState {
  // Analysis state
  isAnalyzing: boolean;
  selectedImage: string | null;
  analysis: StoolAnalysis | null;
  currentStatus: string | null;

  // History state
  metricsHistory: HistoryEntry[];
  isLoadingHistory: boolean;
  historyError: string | null;
  historyFilters: {
    startDate: Date | null;
    endDate: Date | null;
  };
  currentPage: number;
  itemsPerPage: number;

  // Analysis actions
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setSelectedImage: (image: string | null) => void;
  setAnalysisResults: (analysis: StoolAnalysis) => void;
  setCurrentStatus: (status: string | null) => void;
  resetState: () => void;

  // History actions
  loadHistory: () => Promise<void>;
  setHistoryFilters: (filters: Partial<AnalysisState['historyFilters']>) => void;
  setCurrentPage: (page: number) => void;
  viewHistoryDetails: (id: string) => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  // Analysis initial state
  isAnalyzing: false,
  selectedImage: null,
  analysis: null,
  currentStatus: null,

  // History initial state
  metricsHistory: [],
  isLoadingHistory: false,
  historyError: null,
  historyFilters: { startDate: null, endDate: null },
  currentPage: 0,
  itemsPerPage: 10,

  // Analysis actions
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setSelectedImage: (image) => set({ selectedImage: image }),
  setAnalysisResults: (analysis) => set({ analysis }),
  setCurrentStatus: (status) => set({ currentStatus: status }),
  resetState: () => set({
    isAnalyzing: false,
    selectedImage: null,
    analysis: null,
    currentStatus: null
  }),

  // History actions
  loadHistory: async () => {
    try {
      set({ isLoadingHistory: true, historyError: null });
      
      // Build query params
      const params = new URLSearchParams();
      const { startDate, endDate } = get().historyFilters;
      
      if (startDate) {
        params.append('start_date', startDate.toISOString());
      }
      if (endDate) {
        params.append('end_date', endDate.toISOString());
      }
      
      // Fetch history from API
      const response = await fetch(`/api/history?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      
      const data = await response.json();
      set({ metricsHistory: data.entries });
    } catch (error) {
      set({ historyError: 'Failed to load history' });
      console.error('Error loading history:', error);
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  setHistoryFilters: (filters) => set((state) => ({
    historyFilters: { ...state.historyFilters, ...filters },
    currentPage: 0 // Reset to first page when filters change
  })),

  setCurrentPage: (page) => set({ currentPage: page }),

  viewHistoryDetails: (id) => {
    // TODO: Implement view details logic
    console.log('Viewing details for', id);
  }
}));