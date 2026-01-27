import { create } from 'zustand';

type TabType = 'merchants' | 'customers';

interface LandingState {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

export const useLandingStore = create<LandingState>((set) => ({
    activeTab: 'merchants',
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
