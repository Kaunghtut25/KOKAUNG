// Myanmar bus cities — comprehensive coverage of all States & Regions
// Used by bus search dropdowns on homepage

export interface BusCity {
  city: string;
  region: string;
  popular: boolean;
}

export const BUS_CITIES: BusCity[] = [
  /* ===== KACHIN STATE ===== */
  { city: "Myitkyina", region: "Kachin", popular: true },
  { city: "Bhamo", region: "Kachin", popular: false },
  { city: "Putao", region: "Kachin", popular: false },

  /* ===== KAYAH STATE ===== */
  { city: "Loikaw", region: "Kayah", popular: false },
  { city: "Demoso", region: "Kayah", popular: false },

  /* ===== KAYIN STATE ===== */
  { city: "Hpa-An", region: "Kayin", popular: true },
  { city: "Myawaddy", region: "Kayin", popular: false },

  /* ===== CHIN STATE ===== */
  { city: "Hakha", region: "Chin", popular: false },
  { city: "Mindat", region: "Chin", popular: false },
  { city: "Tedim", region: "Chin", popular: false },

  /* ===== MON STATE ===== */
  { city: "Mawlamyine", region: "Mon", popular: true },
  { city: "Thaton", region: "Mon", popular: false },
  { city: "Ye", region: "Mon", popular: false },
  { city: "Kyaikto", region: "Mon", popular: false },

  /* ===== RAKHINE STATE ===== */
  { city: "Sittwe", region: "Rakhine", popular: true },
  { city: "Thandwe", region: "Rakhine", popular: false },
  { city: "Kyaukphyu", region: "Rakhine", popular: false },
  { city: "Mrauk U", region: "Rakhine", popular: false },

  /* ===== SHAN STATE ===== */
  { city: "Taunggyi", region: "Shan", popular: true },
  { city: "Nyaung Shwe", region: "Shan", popular: true },
  { city: "Kalaw", region: "Shan", popular: true },
  { city: "Lashio", region: "Shan", popular: true },
  { city: "Muse", region: "Shan", popular: false },
  { city: "Keng Tung", region: "Shan", popular: false },
  { city: "Tachileik", region: "Shan", popular: false },
  { city: "Hsipaw", region: "Shan", popular: false },
  { city: "Kyaukme", region: "Shan", popular: false },
  { city: "Aungban", region: "Shan", popular: false },

  /* ===== AYEYARWADY REGION ===== */
  { city: "Pathein", region: "Ayeyarwady", popular: true },
  { city: "Hinthada", region: "Ayeyarwady", popular: false },
  { city: "Maubin", region: "Ayeyarwady", popular: false },

  /* ===== BAGO REGION ===== */
  { city: "Bago", region: "Bago", popular: true },
  { city: "Pyay", region: "Bago", popular: true },
  { city: "Taungoo", region: "Bago", popular: false },

  /* ===== MAGWAY REGION ===== */
  { city: "Magway", region: "Magway", popular: false },
  { city: "Pakokku", region: "Magway", popular: false },
  { city: "Yenangyaung", region: "Magway", popular: false },

  /* ===== MANDALAY REGION ===== */
  { city: "Mandalay", region: "Mandalay", popular: true },
  { city: "Bagan", region: "Mandalay", popular: true },
  { city: "Meiktila", region: "Mandalay", popular: true },
  { city: "Pyin Oo Lwin", region: "Mandalay", popular: true },
  { city: "Myingyan", region: "Mandalay", popular: false },
  { city: "Kyaukse", region: "Mandalay", popular: false },
  { city: "Yamethin", region: "Mandalay", popular: false },

  /* ===== SAGAING REGION ===== */
  { city: "Monywa", region: "Sagaing", popular: true },
  { city: "Sagaing", region: "Sagaing", popular: false },
  { city: "Shwebo", region: "Sagaing", popular: false },
  { city: "Kalay", region: "Sagaing", popular: false },

  /* ===== TANINTHARYI REGION ===== */
  { city: "Dawei", region: "Tanintharyi", popular: true },
  { city: "Myeik", region: "Tanintharyi", popular: false },
  { city: "Kawthoung", region: "Tanintharyi", popular: false },

  /* ===== YANGON REGION ===== */
  { city: "Yangon", region: "Yangon", popular: true },

  /* ===== NAYPYITAW UNION TERRITORY ===== */
  { city: "Naypyitaw", region: "Naypyitaw", popular: true },
];

export function getBusCities(): BusCity[] {
  return [...BUS_CITIES].sort((a, b) => {
    if (a.popular !== b.popular) return a.popular ? -1 : 1;
    return a.city.localeCompare(b.city);
  });
}
