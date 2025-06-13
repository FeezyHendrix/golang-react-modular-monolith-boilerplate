
export type DataItem = {
  id: number;
  name: string;
  type: string;
  selected: boolean;
};

export type Insight = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type Document = {
  id: number;
  name: string;
  type: string;
  location: string;
  selected: boolean;
};
