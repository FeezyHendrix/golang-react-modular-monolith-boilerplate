import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type DataSourceType = "Database" | "File" | "API" | "Document" | string;

export interface DataSource {
  id: number;
  name: string;
  type: DataSourceType;
}

export interface QueryResult {
  id: string;
  title: string;
  type: "SQL" | "Python" | "Canvas";
  date: string;
  description?: string;
}

export interface Insight {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  date?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: UserProfile | null;
}

interface AppDataStore {
  dataSources: DataSource[];
  queries: QueryResult[];
  insights: Insight[];
  setDataSources: (dataSources: DataSource[]) => void;
  setQueries: (queries: QueryResult[]) => void;
  setInsights: (insights: Insight[]) => void;
  addDataSource: (dataSource: DataSource) => void;
  addQuery: (query: QueryResult) => void;
  addInsight: (insight: Insight) => void;
  removeDataSource: (id: number) => void;
  removeQuery: (id: string) => void;
  removeInsight: (id: number) => void;
}

export const useAppDataStore = create<AppDataStore>()(
  devtools(
    persist(
      (set) => ({
        dataSources: [
          { id: 1, name: "Customers DB", type: "Database" },
          { id: 2, name: "Orders DB", type: "Database" },
          { id: 3, name: "Sales Data", type: "File" },
          { id: 4, name: "Marketing Reports", type: "Document" },
          { id: 5, name: "Product Catalog", type: "File" }
        ],
        queries: [
          { id: "a", title: "Sales Report", type: "SQL", date: "2025-04-05T08:21:00Z", description: "Monthly sales summary" },
          { id: "b", title: "Customer Analysis", type: "Python", date: "2025-04-05T08:28:00Z", description: "Customer segmentation" },
          { id: "c", title: "Inventory", type: "SQL", date: "2025-04-05T08:43:00Z", description: "Current inventory levels" },
          { id: "d", title: "Marketing", type: "Canvas", date: "2025-04-05T08:50:00Z", description: "Campaign performance" }
        ],
        insights: [
          { id: 1, title: "Sales Growth Opportunity", description: "Product line X shows 32% growth potential in the Northwest region.", category: "Sales", priority: "High", date: "2025-04-21T10:05:00Z" },
          { id: 2, title: "Cost Reduction", description: "Optimizing supplier contracts could reduce COGS by 8%.", category: "Finance", priority: "Medium", date: "2025-04-20T08:30:00Z" },
          { id: 3, title: "Customer Retention Risk", description: "Enterprise segment showing increased churn indicators.", category: "Customer", priority: "High", date: "2025-04-20T06:20:00Z" },
          { id: 4, title: "Inventory Excess", description: "Warehouse B showing 22% excess inventory for SKUs 1001-1042.", category: "Operations", priority: "Medium", date: "2025-04-17T11:40:00Z" },
          { id: 5, title: "Marketing Campaign Effectiveness", description: "Email campaigns outperforming social media by 3.5x ROI.", category: "Marketing", priority: "Low", date: "2025-04-16T15:15:00Z" },
        ],
        setDataSources: (dataSources) => set({ dataSources }),
        setQueries: (queries) => set({ queries }),
        setInsights: (insights) => set({ insights }),
        addDataSource: (dataSource) => set((state) => ({
          dataSources: [...state.dataSources, dataSource]
        })),
        addQuery: (query) => set((state) => ({
          queries: [...state.queries, query]
        })),
        addInsight: (insight) => set((state) => ({
          insights: [...state.insights, insight]
        })),
        removeDataSource: (id) => set((state) => ({
          dataSources: state.dataSources.filter(ds => ds.id !== id)
        })),
        removeQuery: (id) => set((state) => ({
          queries: state.queries.filter(q => q.id !== id)
        })),
        removeInsight: (id) => set((state) => ({
          insights: state.insights.filter(i => i.id !== id)
        })),
      }),
      {
        name: 'app-data-storage',
      }
    ),
    {
      name: 'app-data-store',
    }
  )
);

interface AuthStore extends AuthState {
  login: (accessToken: string, refreshToken: string, user: UserProfile) => void;
  logout: () => void;
  setUser: (user: UserProfile) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        user: null,
        login: (accessToken: string, refreshToken: string, user: UserProfile) => {
          set({
            accessToken,
            refreshToken,
            user,
            isAuthenticated: true,
          });
        },
        logout: () => {
          set({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
          });
        },
        setUser: (user: UserProfile) => {
          set({ user, isAuthenticated: true });
        },
        updateTokens: (accessToken: string, refreshToken: string) => {
          set({ accessToken, refreshToken });
        },
        initializeAuth: () => {
          const state = get();
          if (state.accessToken && state.user) {
            set({ isAuthenticated: true });
          }
        },
      }),
      {
        name: 'auth-storage',
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

export const useUserStore = create<{ user: UserProfile | null; setUser: (user: UserProfile | null) => void; setState: (user: UserProfile) => void }>()(
  (set) => ({
    user: null,
    setUser: (user) => set({ user }),
    setState: (user) => set({ user }),
  })
);