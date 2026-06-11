// NÓMADE — resilient lucide icon resolver.
// The codebase references icons by kebab-case name (the same names the original
// `data-lucide` attributes used). We map those to lucide-react components via the
// static `icons` record, with fallbacks for a few icons that lucide renamed across
// versions — so the app never crashes on an unknown/renamed name.
import { icons } from 'lucide-react';

// kebab → PascalCase ("arrow-up-right" → "ArrowUpRight", "flower-2" → "Flower2")
function toPascal(name) {
  return String(name).replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
}

// For names lucide renamed, try the historical PascalCase first, then newer ones.
const ALIASES = {
  'bar-chart-3': ['BarChart3', 'ChartColumnIncreasing', 'ChartNoAxesColumnIncreasing'],
  'check-circle-2': ['CheckCircle2', 'CircleCheckBig'],
  'upload-cloud': ['UploadCloud', 'CloudUpload'],
  'check-circle': ['CheckCircle', 'CircleCheck']
};

export function lucideIcon(name) {
  const tries = [toPascal(name)].concat(ALIASES[name] || []);
  for (const t of tries) { if (icons[t]) return icons[t]; }
  return icons.Circle; // graceful fallback — never crashes
}
