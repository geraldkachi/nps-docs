// src/types.ts
export interface DocPage {
  url: string;
  title: string;
  markdown: string;
}

export interface NavItem {
  title: string;
  url: string;
  children?: NavItem[];
}