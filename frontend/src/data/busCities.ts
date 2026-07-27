// Myanmar bus cities — sorted A–Z
// Used by bus search dropdowns on homepage

export interface BusCity {
  city: string;
  region: string;
  popular: boolean;
}

export const BUS_CITIES: BusCity[] = [
  { city: "Bagan", region: "Mandalay", popular: true },
  { city: "Bago", region: "Bago", popular: false },
  { city: "Dawei", region: "Tanintharyi", popular: false },
  { city: "Hpa-An", region: "Kayin", popular: true },
  { city: "Kalaw", region: "Shan", popular: true },
  { city: "Kyaiktiyo", region: "Mon", popular: false },
  { city: "Lashio", region: "Shan", popular: false },
  { city: "Loikaw", region: "Kayah", popular: false },
  { city: "Magway", region: "Magway", popular: false },
  { city: "Mandalay", region: "Mandalay", popular: true },
  { city: "Mawlamyine", region: "Mon", popular: true },
  { city: "Meiktila", region: "Mandalay", popular: false },
  { city: "Monywa", region: "Sagaing", popular: false },
  { city: "Muse", region: "Shan", popular: false },
  { city: "Myeik", region: "Tanintharyi", popular: false },
  { city: "Myitkyina", region: "Kachin", popular: false },
  { city: "Naypyitaw", region: "Naypyitaw", popular: true },
  { city: "Nyaung Shwe", region: "Shan", popular: true },
  { city: "Pathein", region: "Ayeyarwady", popular: true },
  { city: "Pyay", region: "Bago", popular: true },
  { city: "Pyin Oo Lwin", region: "Mandalay", popular: false },
  { city: "Sittwe", region: "Rakhine", popular: false },
  { city: "Taunggyi", region: "Shan", popular: true },
  { city: "Taungoo", region: "Bago", popular: false },
  { city: "Thandwe", region: "Rakhine", popular: false },
  { city: "Yangon", region: "Yangon", popular: true },
  { city: "Ye", region: "Mon", popular: false },
];

export function getBusCities(): BusCity[] {
  return [...BUS_CITIES].sort((a, b) => {
    if (a.popular !== b.popular) return a.popular ? -1 : 1;
    return a.city.localeCompare(b.city);
  });
}
