// Tool Type Definitions

export type ToolCategory = 'text' | 'calculator' | 'generator' | 'developer' | 'converter';
export type ToolType = 'v1-port' | 'it-tools' | 'native';
export type PrivacyTier = 1 | 2 | 3;

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  keywords: string[];
  type: ToolType;
  featured?: boolean;
  
  // NEW: Privacy tier
  tier?: PrivacyTier;
  privacyNote?: string;
  disclaimer?: string;
  
  // For Vue/it-tools components
  component?: string;
  
  // For V1 ports (legacy)
  legacyPath?: string;
  
  // Metadata
  author?: string;
  version?: string;
  lastUpdated?: string;
}

export interface ToolCategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
}

export const TOOL_CATEGORIES: Record<ToolCategory, ToolCategoryInfo> = {
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
  },
  converter: {
    id: 'converter',
    name: 'Converters',
    description: 'Convert between formats and types',
    icon: '🔄'
  }
};

// Privacy tier information
export const PRIVACY_TIERS = {
  1: {
    name: 'Client-Side Only',
    color: 'green',
    icon: '🟢',
    description: 'All processing in your browser. No data sent to servers.'
  },
  2: {
    name: 'Uses Trusted API',
    color: 'yellow',
    icon: '🟡',
    description: 'Uses privacy-focused third-party services.'
  },
  3: {
    name: 'Server-Assisted',
    color: 'orange',
    icon: '🟠',
    description: 'Processing may require our server. Minimal logging, auto-deleted.'
  }
} as const;