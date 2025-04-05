export const side_bar = [
  { label: 'All Bills', path: '/bill', icon: 'AddBox' },
]

export const arr2 = ["Patient ID","Date","Type", "Price","Action"];

export function generateNumberFromId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash); // Ensure positive number
}