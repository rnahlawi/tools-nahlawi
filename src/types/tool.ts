// Tool Type Definitions

export type ToolCategory = 'text' | 'calculator' | 'generator' | 'developer';
export type ToolType = 'v1-port' | 'it-tools' | 'native';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  keywords: string[];
  type: ToolType;
  featured?: boolean;
  
  // For Vue/it-tools components
  component?: string;
  
  // For V1 ports (legacy)
  legacyPath?: string;
  
  // Metadata
  author?: string;
  version?: string;
  lastUpdated?: string;
}

export interface ToolCategory {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
}

export const TOOL_CATEGORIES: Record<ToolCategory, ToolCategory> = {
  text: {
    id: 'text',
    name: 'Text Tools',
    description: 'Process and manipulate text with ease',
    icon: '📝'
  },
  calculator: {
    id: 'calculator',
    name: 'Calculators',
    description: 'Quick and accurate calculations',
    icon: '🔢'
  },
  generator: {
    id: 'generator',
    name: 'Generators',
    description: 'Generate random content and codes',
    icon: '🎲'
  },
  developer: {
    id: 'developer',
    name: 'Developer Tools',
    description: 'Essential tools for developers',
    icon: '💻'
  }
};
