export interface CategoryColor {
  name: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

const CATEGORY_PALETTE: CategoryColor[] = [
  { name: 'slate', bg: '#F1F3F5', text: '#343A40', border: '#DCE0E6', dot: '#495057' },
  { name: 'teal', bg: '#E6F7F5', text: '#0C6B5E', border: '#B2EBE2', dot: '#12B886' },
  { name: 'indigo', bg: '#EDEEFC', text: '#3135B4', border: '#C6C8F6', dot: '#4B4FE0' },
  { name: 'amber', bg: '#FEF6E7', text: '#945B0A', border: '#FCE7C5', dot: '#F59E0B' },
  { name: 'rose', bg: '#FDEBF0', text: '#9E1C40', border: '#FA84A9', dot: '#E11D48' },
  { name: 'emerald', bg: '#EBFBEE', text: '#1E6B34', border: '#B7F4C5', dot: '#10B981' },
  { name: 'sky', bg: '#E7F5FF', text: '#1864AB', border: '#A5D8FF', dot: '#0CA678' },
  { name: 'purple', bg: '#F3F0FF', text: '#6741D9', border: '#D0BFFF', dot: '#7950F2' },
];

/**
 * Hash string to index palette deterministically.
 */
export function getCategoryColor(categoryName?: string): CategoryColor {
  if (!categoryName || !categoryName.trim()) {
    return { name: 'default', bg: '#F5F6F0', text: '#6B716B', border: '#DCDFD5', dot: '#6B716B' };
  }

  const str = categoryName.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CATEGORY_PALETTE.length;
  return CATEGORY_PALETTE[index];
}
