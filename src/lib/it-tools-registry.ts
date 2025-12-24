/**
 * it-tools Integration Registry
 * Maps it-tools components to our tool system
 */

export interface ITTool {
  id: string;
  name: string;
  description: string;
  category: 'text' | 'calculator' | 'generator' | 'developer' | 'converter';
  icon: string;
  component: string; // Path to it-tools component
  keywords: string[];
}

export const IT_TOOLS: ITTool[] = [
  // Start with 5 most useful tools
  {
    id: 'json-to-yaml',
    name: 'JSON to YAML Converter',
    description: 'Convert JSON to YAML and vice versa with syntax highlighting',
    category: 'converter',
    icon: '🔄',
    component: 'JsonToYaml',
    keywords: ['json', 'yaml', 'converter', 'format']
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUID/GUID v1, v4, and other versions',
    category: 'generator',
    icon: '🆔',
    component: 'UuidGenerator',
    keywords: ['uuid', 'guid', 'generator', 'unique']
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL, and other color formats',
    category: 'converter',
    icon: '🎨',
    component: 'ColorConverter',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'converter']
  },
  {
    id: 'cron-expression',
    name: 'Cron Expression Generator',
    description: 'Generate and explain cron expressions',
    category: 'developer',
    icon: '⏰',
    component: 'CronExpression',
    keywords: ['cron', 'schedule', 'expression', 'generator']
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries',
    category: 'developer',
    icon: '💾',
    component: 'SqlFormatter',
    keywords: ['sql', 'formatter', 'beautify', 'database']
  }
];

export function getITToolById(id: string): ITTool | undefined {
  return IT_TOOLS.find(tool => tool.id === id);
}