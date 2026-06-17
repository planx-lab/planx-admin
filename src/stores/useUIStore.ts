import { create } from 'zustand';
import { getTenant, setTenant } from '@/hooks/queries';

interface UIState {
  tenantId: string;
  activeTab: 'dashboard' | 'executions' | 'pipelines' | 'plugins';
  setTenantId: (t: string) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  tenantId: getTenant(),
  activeTab: 'dashboard',
  setTenantId: (t) => {
    setTenant(t);
    set({ tenantId: t });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
