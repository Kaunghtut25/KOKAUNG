// Myanmar bus cities — full township-level coverage
// All 14 States/Regions + 1 Union Territory, organized with English + Burmese names

export interface BusCity {
  city: string;
  cityMY: string;
  region: string;
  regionMY: string;
  popular: boolean;
}

export const REGION_CITIES: BusCity[] = [
  /* ================================================================
     🏛️ UNION TERRITORY — ပြည်ထောင်စုနယ်မြေ
     Naypyidaw (8 Townships)
     ================================================================ */
  { city: "Naypyitaw", cityMY: "နေပြည်တော်", region: "Naypyidaw", regionMY: "နေပြည်တော် ပြည်ထောင်စုနယ်မြေ", popular: true },
  { city: "Ottarathiri", cityMY: "ဥတ္တရသီရိ", region: "Naypyidaw", regionMY: "နေပြည်တော်", popular: false },
  { city: "Dekkhinathiri", cityMY: "ဒက္ခိဏသီရိ", region: "Naypyidaw", regionMY: "နေပြည်တော်", popular: false },
  { city: "Pobbathiri", cityMY: "ပုဗ္ဗသီရိ", region: "Naypyidaw", regionMY: "နေပြည်တော်", popular: false },
  { city: "Zabuthiri", cityMY: "ဇမ္ဗူသီရိ", region: "Naypyidaw", regionMY: "နေပြည်တော်", popular: false },
  { city: "Zeyarthiri", cityMY: "ဇေယျာသီရိ", region: "Naypyidaw", regionMY: "နေပြည်တော်", popular: false },
  { city: "Pyinmana", cityMY: "ပျဉ်းမနား", region: "Naypyidaw", regionMY: "နေပြည်တော်", popular: true },
  { city: "Lewe", cityMY: "လယ်ဝေး", region: "Naypyidaw", regionMY: "နေပြည်တော်", popular: false },
  { city: "Tatkon", cityMY: "တပ်ကုန်း", region: "Naypyidaw", regionMY: "နေပြည်တော်", popular: false },

  /* ================================================================
     🏙️ REGIONS — တိုင်းဒေသကြီးများ
     ================================================================ */

  /* --- Yangon Region (ရန်ကုန်) — 45 Townships --- */
  { city: "Hlegu", cityMY: "လှည်းကူး", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Hmawbi", cityMY: "မှော်ဘီ", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Htantabin", cityMY: "ထန်းတပင်", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Taikkyi", cityMY: "တိုက်ကြီး", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Dala", cityMY: "ဒလ", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Seikkyi Kanaungto", cityMY: "ဆိပ်ကြီးခနောင်တို", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Thanlyin", cityMY: "သံလျင်", region: "Yangon", regionMY: "ရန်ကုန်", popular: true },
  { city: "Kyauktan", cityMY: "ကျောက်တန်း", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Twante", cityMY: "တွံတေး", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Kawhmu", cityMY: "ကော့မှူး", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Kungyangon", cityMY: "ကွန်ခြံကုန်း", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Cocokyun", cityMY: "ကိုကိုးကျွန်း", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Hlaingthaya East", cityMY: "လှိုင်သာယာ အရှေ့ပိုင်း", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Hlaingthaya West", cityMY: "လှိုင်သာယာ အနောက်ပိုင်း", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },
  { city: "Khengaut", cityMY: "ခေင်ဂုတ်", region: "Yangon", regionMY: "ရန်ကုန်", popular: false },

  /* --- Mandalay Region (မန္တလေး) — 31 Townships --- */
  { city: "Aungmyethazan", cityMY: "အောင်မြေသာဇံ", region: "Mandalay", regionMY: "မန္တလေးတိုင်းဒေသကြီး", popular: false },
  { city: "Chanayethazan", cityMY: "ချမ်းအေးသာဇံ", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Maha Aungmye", cityMY: "မဟာအောင်မြေ", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Chanmyathazi", cityMY: "ချမ်းမြသာစည်", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Pyigyidagun", cityMY: "ပြည်ကြီးတံခွန်", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Amarapura", cityMY: "အမရပူရ", region: "Mandalay", regionMY: "မန္တလေး", popular: true },
  { city: "Patheingyi", cityMY: "ပုသိမ်ကြီး", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Pyin Oo Lwin", cityMY: "ပြင်ဦးလွင်", region: "Mandalay", regionMY: "မန္တလေး", popular: true },
  { city: "Madaya", cityMY: "မတ္တရာ", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Mogok", cityMY: "မိုးကုတ်", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Singu", cityMY: "စင်းကူး", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Thabeikkyin", cityMY: "သပိတ်ကျင်း", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Kyaukse", cityMY: "ကျောက်ဆည်", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Sintgaing", cityMY: "စင်ကိုင်", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Myittha", cityMY: "မြစ်သား", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Tada-U", cityMY: "တံတားဦး", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Myingyan", cityMY: "မြင်းခြံ", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Taungtha", cityMY: "တောင်သာ", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Natogyi", cityMY: "နွားထိုးကြီး", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Kyaukpadaung", cityMY: "ကျောက်ပါတောင်း", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Nganzun", cityMY: "ငန်းဇွန်", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Nyaung-U", cityMY: "ညောင်ဦး", region: "Mandalay", regionMY: "မန္တလေး", popular: true },
  { city: "Meiktila", cityMY: "မိတ္ထီလာ", region: "Mandalay", regionMY: "မန္တလေး", popular: true },
  { city: "Mahlaing", cityMY: "မလှိုင်", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Thazi", cityMY: "သာစည်", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Wundwin", cityMY: "ဝမ်းတွင်း", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Yamethin", cityMY: "ရမည်းသင်း", region: "Mandalay", regionMY: "မန္တလေး", popular: false },
  { city: "Pyawbwe", cityMY: "ပျော်ဘွယ်", region: "Mandalay", regionMY: "မန္တလေး", popular: false },

  /* --- Bago Region (ပဲခူး) — 28 Townships --- */
  { city: "Bago", cityMY: "ပဲခူး", region: "Bago", regionMY: "ပဲခူးတိုင်းဒေသကြီး", popular: true },
  { city: "Thanatpin", cityMY: "သနပ်ပင်", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Kawa", cityMY: "ကဝ", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Waw", cityMY: "ဝေါ", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Nyaunglebin", cityMY: "ညောင်လေးပင်", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Kyauktaga", cityMY: "ကျောက်တံခါး", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Daik-U", cityMY: "ဒိုက်ဦး", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Shwegyin", cityMY: "ရွှေကျင်", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Kyaukkyi", cityMY: "ကျောက်ကြီး", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Taungoo", cityMY: "တောင်ငူ", region: "Bago", regionMY: "ပဲခူး", popular: true },
  { city: "Yedashe", cityMY: "ရေတာရှည်", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Pyu", cityMY: "ဖြူး", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Oktwin", cityMY: "အုတ်တွင်း", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Pyay", cityMY: "ပြည်", region: "Bago", regionMY: "ပဲခူး", popular: true },
  { city: "Paukkhaung", cityMY: "ပေါက်ခေါင်း", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Padaung", cityMY: "ပန်းတောင်း", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Shwedaung", cityMY: "ရွှေတောင်း", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Paungde", cityMY: "ပေါင်းတည်", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Thegon", cityMY: "သဲကုန်း", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Tharrawaddy", cityMY: "သာယာဝတီ", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Letpadan", cityMY: "လက်ပံတန်း", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Minhla", cityMY: "မင်းလှ", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Monyo", cityMY: "မိုးညို", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Okpho", cityMY: "အုတ်ဖို", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Gyobingauk", cityMY: "ကြို့ပင်ကောက်", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Nattalin", cityMY: "နတ်တလင်း", region: "Bago", regionMY: "ပဲခူး", popular: false },
  { city: "Zigon", cityMY: "ဇီးကုန်း", region: "Bago", regionMY: "ပဲခူး", popular: false },

  /* --- Sagaing Region (စစ်ကိုင်း) — 37 Townships --- */
  { city: "Sagaing", cityMY: "စစ်ကိုင်း", region: "Sagaing", regionMY: "စစ်ကိုင်းတိုင်းဒေသကြီး", popular: true },
  { city: "Myinmu", cityMY: "မြင်းမူ", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Myaung", cityMY: "မြောင်", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Monywa", cityMY: "မုံရွာ", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: true },
  { city: "Budalin", cityMY: "ဘုတလင်", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Ayadaw", cityMY: "အရာတော်", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Chaung-U", cityMY: "ချောင်းဦး", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Shwebo", cityMY: "ရွှေဘို", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Wetlet", cityMY: "ဝက်လက်", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Khin-U", cityMY: "ခင်ဦး", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Tabayin", cityMY: "ဒီပဲယင်း", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Taze", cityMY: "တန့်ဆည်", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Ye-U", cityMY: "ရေဦး", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Katha", cityMY: "ကသာ", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Indaw", cityMY: "အင်းတော်", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Tigyaing", cityMY: "ထီးချိုင့်", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Banmauk", cityMY: "ဗန်းမောက်", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Kawlin", cityMY: "ကောလင်း", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Wuntho", cityMY: "ဝန်းသို", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Pinlebu", cityMY: "ပင်လည်ဘူး", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Kalay", cityMY: "ကလေး", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: true },
  { city: "Mingin", cityMY: "မင်းကင်း", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Kalewa", cityMY: "ကလေးဝ", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Mawlaik", cityMY: "မော်လိုက်", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Paungbyin", cityMY: "ဖောင်းပြင်", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Hkamti", cityMY: "ခန္တီး", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Homalin", cityMY: "ဟိုမလင်း", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Yinmabin", cityMY: "ယင်းမာပင်", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Kani", cityMY: "ကနီ", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Salingyi", cityMY: "ဆားလင်းကြီး", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Pale", cityMY: "ပုလဲ", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Tamu", cityMY: "တမူး", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },
  { city: "Kyunhla", cityMY: "ကျွန်းလှ", region: "Sagaing", regionMY: "စစ်ကိုင်း", popular: false },

  /* --- Magway Region (မကွေး) — 25 Townships --- */
  { city: "Magway", cityMY: "မကွေး", region: "Magway", regionMY: "မကွေးတိုင်းဒေသကြီး", popular: true },
  { city: "Yenangyaung", cityMY: "ရေနံချောင်း", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Chauk", cityMY: "ချောက်", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Taungdwingyi", cityMY: "တောင်တွင်းကြီး", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Myothit", cityMY: "မြို့သစ်", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Natmauk", cityMY: "နတ်မောက်", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Minbu", cityMY: "မင်းဘူး", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Pwintbyu", cityMY: "ပွင့်ဖြူ", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Salin", cityMY: "စလင်း", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Sidoktaya", cityMY: "စေတုတ္တရာ", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Ngape", cityMY: "ငဖဲ", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Pakokku", cityMY: "ပခုက္ကူ", region: "Magway", regionMY: "မကွေး", popular: true },
  { city: "Yesagyo", cityMY: "ရေစကြို", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Myaing", cityMY: "မြိုင်", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Pauk", cityMY: "ပေါက်", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Seikphyu", cityMY: "ဆိပ်ဖြူ", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Gangaw", cityMY: "ဂန့်ဂေါ", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Tilin", cityMY: "ထီးလင်း", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Saw", cityMY: "ဆော", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Thayet", cityMY: "သရက်", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Mindon", cityMY: "မင်းတုန်း", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Aunglan", cityMY: "အောင်လံ", region: "Magway", regionMY: "မကွေး", popular: false },
  { city: "Sinbaungwe", cityMY: "ဆင်ပေါက်ဝဲ", region: "Magway", regionMY: "မကွေး", popular: false },

  /* --- Ayeyarwady Region (ဧရာဝတီ) — 26 Townships --- */
  { city: "Pathein", cityMY: "ပုသိမ်", region: "Ayeyarwady", regionMY: "ဧရာဝတီတိုင်းဒေသကြီး", popular: true },
  { city: "Kangyidaunt", cityMY: "ကန်ကြီးထောင့်", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Thabaung", cityMY: "သာပေါင်း", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Ngapudaw", cityMY: "ငပုတော", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Kyonpyaw", cityMY: "ကျုံပျော်", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Yegyi", cityMY: "ရေကြည်", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Kyaunggon", cityMY: "ကျောင်းကုန်း", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Hinthada", cityMY: "ဟင်္သာတ", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: true },
  { city: "Zalun", cityMY: "ဇလွန်", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Lemyethna", cityMY: "လေးမျက်နှာ", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Myanaung", cityMY: "မြန်အောင်", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Kyangin", cityMY: "ကြံခင်း", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Ingapu", cityMY: "အင်္ဂပူ", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Myaungmya", cityMY: "မြောင်းမြ", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Einme", cityMY: "အိမ်မဲ", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Wakema", cityMY: "ဝါးခယ်မ", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Maubin", cityMY: "မအူပင်", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Pantanaw", cityMY: "ပန်းတနော်", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Nyaungdon", cityMY: "ညောင်တုန်း", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Danubyu", cityMY: "ဓနုဖြူ", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Pyapon", cityMY: "ဖျာပုံ", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Bogale", cityMY: "ဘိုကလေး", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Kyaiklat", cityMY: "ကျိုက်လတ်", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Dedaye", cityMY: "ဒေးဒရဲ", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Labutta", cityMY: "လပွတ္တာ", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },
  { city: "Mawlamyinegyun", cityMY: "မော်လမြိုင်ကျွန်း", region: "Ayeyarwady", regionMY: "ဧရာဝတီ", popular: false },

  /* --- Tanintharyi Region (တနင်္သာရီ) — 10 Townships --- */
  { city: "Dawei", cityMY: "ထားဝယ်", region: "Tanintharyi", regionMY: "တနင်္သာရီတိုင်းဒေသကြီး", popular: true },
  { city: "Launglon", cityMY: "လောင်းလုံး", region: "Tanintharyi", regionMY: "တနင်္သာရီ", popular: false },
  { city: "Thayetchaung", cityMY: "သရက်ချောင်း", region: "Tanintharyi", regionMY: "တနင်္သာရီ", popular: false },
  { city: "Yebyu", cityMY: "ရေဖြူ", region: "Tanintharyi", regionMY: "တနင်္သာရီ", popular: false },
  { city: "Myeik", cityMY: "မြိတ်", region: "Tanintharyi", regionMY: "တနင်္သာရီ", popular: true },
  { city: "Kyunsu", cityMY: "ကျွန်းစု", region: "Tanintharyi", regionMY: "တနင်္သာရီ", popular: false },
  { city: "Palaw", cityMY: "ပုလော", region: "Tanintharyi", regionMY: "တနင်္သာရီ", popular: false },
  { city: "Kawthaung", cityMY: "ကော့သောင်း", region: "Tanintharyi", regionMY: "တနင်္သာရီ", popular: true },
  { city: "Bokpyin", cityMY: "ဘုတ်ပြင်း", region: "Tanintharyi", regionMY: "တနင်္သာရီ", popular: false }
];

/* ================================================================
   STATES — ပြည်နယ်များ
   ================================================================ */

// Split array to avoid Babel/TS too-large-array warnings
const STATES: BusCity[] = [
  /* --- Shan State (ရှမ်း) — 55 Townships --- */
  { city: "Taunggyi", cityMY: "တောင်ကြီး", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: true },
  { city: "Kalaw", cityMY: "ကလော", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: true },
  { city: "Lawksawk", cityMY: "ရပ်စောက်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Nyaungshwe", cityMY: "ညောင်ရွှေ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: true },
  { city: "Hopong", cityMY: "ဟိုပုံး", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Hsi Hseng", cityMY: "ဆီဆိုင်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Pinlaung", cityMY: "ပင်လောင်း", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Pekon", cityMY: "ဖယ်ခုံ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Pindaya", cityMY: "ပင်းတယ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Ywangan", cityMY: "ရွာငံ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Loilen", cityMY: "လွိုင်လင်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Lai-Hka", cityMY: "လဲချား", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Nansang", cityMY: "နမ့်စန်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Kunhing", cityMY: "ကွန်ဟိန်း", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Kyethi", cityMY: "ကျေးသီး", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mong Kung", cityMY: "မိုင်းကိုင်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mong Hsu", cityMY: "မိုင်းရှူး", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Langkho", cityMY: "လင်းခေး", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mong Nai", cityMY: "မိုင်းနဲ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mawkmai", cityMY: "မောက်မယ်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mong Pan", cityMY: "မိုင်းပန်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Lashio", cityMY: "လားရှိုး", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: true },
  { city: "Hsenwi", cityMY: "သိန္နီ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Tangyan", cityMY: "တန့်ယန်း", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Kunlong", cityMY: "ကွမ်းလုံ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Kyaukme", cityMY: "ကျောက်မဲ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Nawnghkio", cityMY: "နောင်ချို", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Hsipaw", cityMY: "သီပေါ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Namtu", cityMY: "နမ္မတူ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mabein", cityMY: "မဘိမ်း", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mantong", cityMY: "မန်းတုံ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Namhsan", cityMY: "နမ့်ဆန်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Muse", cityMY: "မူဆယ်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: true },
  { city: "Namhkam", cityMY: "နမ့်ခမ်း", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Kutkai", cityMY: "ကွတ်ခိုင်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Laukkaing", cityMY: "လောက်ကိုင်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Konkyan", cityMY: "ကုန်းကြမ်း", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Kengtung", cityMY: "ကျိုင်းတုံ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: true },
  { city: "Mong Khet", cityMY: "မိုင်းခတ်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mong Yang", cityMY: "မိုင်းယန်း", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mong Ping", cityMY: "မိုင်းပျင်း", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Tachileik", cityMY: "တာချီလိတ်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: true },
  { city: "Mong Hpayak", cityMY: "မိုင်းဖြတ်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mong Yawng", cityMY: "မိုင်းယောင်း", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mong Hsat", cityMY: "မိုင်းဆတ်", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mong Ton", cityMY: "မိုင်းတုံ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Mong La", cityMY: "မိုင်းလား", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },

  /* --- Mon State (မွန်) — 10 Townships --- */
  { city: "Mawlamyine", cityMY: "မော်လမြိုင်", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: true },
  { city: "Kyaikmaraw", cityMY: "ကျိုက်မရော", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: false },
  { city: "Chaungzon", cityMY: "ချောင်းဆုံ", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: false },
  { city: "Thanbyuzayat", cityMY: "သံဖြူဇရပ်", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: false },
  { city: "Mudon", cityMY: "မုဒုံ", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: false },
  { city: "Ye", cityMY: "ရေး", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: true },
  { city: "Thaton", cityMY: "သထုံ", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: false },
  { city: "Paung", cityMY: "ပေါင်", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: false },
  { city: "Kyaikto", cityMY: "ကျိုက်ထို", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: false },
  { city: "Bilin", cityMY: "ဘီးလင်း", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: false },

  /* --- Kayin State (ကရင်) — 7 Townships --- */
  { city: "Hpa-An", cityMY: "ဘားအံ", region: "Kayin", regionMY: "ကရင်ပြည်နယ်", popular: true },
  { city: "Hlaingbwe", cityMY: "လှိုင်းဘွဲ့", region: "Kayin", regionMY: "ကရင်ပြည်နယ်", popular: false },
  { city: "Hpapun", cityMY: "ဖာပွန်", region: "Kayin", regionMY: "ကရင်ပြည်နယ်", popular: false },
  { city: "Thandaunggyi", cityMY: "သံတောင်ကြီး", region: "Kayin", regionMY: "ကရင်ပြည်နယ်", popular: false },
  { city: "Myawaddy", cityMY: "မြဝတီ", region: "Kayin", regionMY: "ကရင်ပြည်နယ်", popular: true },
  { city: "Kawkareik", cityMY: "ကော့ကရိတ်", region: "Kayin", regionMY: "ကရင်ပြည်နယ်", popular: false },
  { city: "Kyain Seikgyi", cityMY: "ကြာအင်းဆိပ်ကြီး", region: "Kayin", regionMY: "ကရင်ပြည်နယ်", popular: false },

  /* --- Rakhine State (ရခိုင်) — 17 Townships --- */
  { city: "Sittwe", cityMY: "စစ်တွေ", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: true },
  { city: "Ponnagyun", cityMY: "ပုဏ္ဏားကျွန်း", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Kyauktaw", cityMY: "ကျောက်တော်", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Mrauk-U", cityMY: "မြောက်ဦး", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Kyaukphyu", cityMY: "ကျောက်ဖြူ", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Minbya", cityMY: "မင်းပြား", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Myebon", cityMY: "မြေပုံ", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Pauktaw", cityMY: "ပေါက်တော", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Rathedaung", cityMY: "ရသေ့တောင်", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Buthidaung", cityMY: "ဘူးသီးတောင်", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Maungdaw", cityMY: "မောင်တော", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Ramree", cityMY: "ရမ်းဗြဲ", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Manaung", cityMY: "မာန်အောင်", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Ann", cityMY: "အမ်း", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Thandwe", cityMY: "သံတွဲ", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: true },
  { city: "Toungup", cityMY: "တောင်ကုတ်", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },
  { city: "Gwa", cityMY: "ဂွ", region: "Rakhine", regionMY: "ရခိုင်ပြည်နယ်", popular: false },

  /* --- Kachin State (ကချင်) — 18 Townships --- */
  { city: "Myitkyina", cityMY: "မြစ်ကြီးနား", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: true },
  { city: "Waingmaw", cityMY: "ဝိုင်းမော်", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Injangyang", cityMY: "အင်ဂျန်းယန်", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Tanai", cityMY: "တနိုင်း", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Chipwi", cityMY: "ချီပွေ", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Hsawlaw", cityMY: "ဆော့လော်", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Bhamo", cityMY: "ဗန်းမော်", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: true },
  { city: "Shwegu", cityMY: "ရွှေကူ", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Momauk", cityMY: "မိုးမောက်", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Mansi", cityMY: "မန်းစီ", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Mohnyin", cityMY: "မိုးညှင်း", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Mogaung", cityMY: "မိုးကောင်း", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Hpakant", cityMY: "ဖားကန့်", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Putao", cityMY: "ပူတာအို", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Sumprabum", cityMY: "ဆုမ်ပရာဘွမ်", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Machanbaw", cityMY: "မချမ်းဘော", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },
  { city: "Nogmung", cityMY: "နောင်မွန်", region: "Kachin", regionMY: "ကချင်ပြည်နယ်", popular: false },

  /* --- Kayah State (ကယား) — 7 Townships --- */
  { city: "Loikaw", cityMY: "လွိုင်ကော်", region: "Kayah", regionMY: "ကယားပြည်နယ်", popular: true },
  { city: "Demoso", cityMY: "ဒီးမော့ဆို", region: "Kayah", regionMY: "ကယားပြည်နယ်", popular: false },
  { city: "Hpruso", cityMY: "ဖရူးဆိုး", region: "Kayah", regionMY: "ကယားပြည်နယ်", popular: false },
  { city: "Shadaw", cityMY: "ရှားတော", region: "Kayah", regionMY: "ကယားပြည်နယ်", popular: false },
  { city: "Bawlakhe", cityMY: "ဘောလခဲ", region: "Kayah", regionMY: "ကယားပြည်နယ်", popular: false },
  { city: "Hpasawng", cityMY: "ဖာဆောင်း", region: "Kayah", regionMY: "ကယားပြည်နယ်", popular: false },
  { city: "Mese", cityMY: "မေးစဲ့", region: "Kayah", regionMY: "ကယားပြည်နယ်", popular: false },

  /* --- Chin State (ချင်း) — 6 Townships --- */
  { city: "Hakha", cityMY: "ဟားခါး", region: "Chin", regionMY: "ချင်းပြည်နယ်", popular: true },
  { city: "Thantlang", cityMY: "ထန်တလန်", region: "Chin", regionMY: "ချင်းပြည်နယ်", popular: false },
  { city: "Falam", cityMY: "ဖလမ်း", region: "Chin", regionMY: "ချင်းပြည်နယ်", popular: false },
  { city: "Tedim", cityMY: "တီးတိန်", region: "Chin", regionMY: "ချင်းပြည်နယ်", popular: false },
  { city: "Mindat", cityMY: "မင်းတပ်", region: "Chin", regionMY: "ချင်းပြည်နယ်", popular: false },
  { city: "Matupi", cityMY: "မတူပီ", region: "Chin", regionMY: "ချင်းပြည်နယ်", popular: false },
];

// Merge both arrays
const FULL_BUS_CITIES: BusCity[] = [...REGION_CITIES, ...STATES];

// Mandalay city itself (市中心) — added explicitly since Mandalay = multiple township districts
const MANDALAY_METRO: BusCity = { city: "Mandalay", cityMY: "မန္တလေး", region: "Mandalay", regionMY: "မန္တလေးတိုင်းဒေသကြီး", popular: true };

// Yangon city itself
const YANGON_METRO: BusCity = { city: "Yangon", cityMY: "ရန်ကုန်", region: "Yangon", regionMY: "ရန်ကုန်တိုင်းဒေသကြီး", popular: true };

const ALL_BUS_CITIES: BusCity[] = [MANDALAY_METRO, YANGON_METRO, ...FULL_BUS_CITIES];

// Add some well-known towns omitted from the township list but commonly searched
const EXTRA_TOWNS: BusCity[] = [
  { city: "Bagan", cityMY: "ပုဂံ", region: "Mandalay", regionMY: "မန္တလေးတိုင်းဒေသကြီး", popular: true },
  { city: "Kyaiktiyo", cityMY: "ကျိုက်ထီးရိုး", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: true },
  { city: "Ngwe Saung", cityMY: "ငွေဆောင်", region: "Ayeyarwady", regionMY: "ဧရာဝတီတိုင်းဒေသကြီး", popular: true },
  { city: "Chaung Tha", cityMY: "ချောင်းသာ", region: "Ayeyarwady", regionMY: "ဧရာဝတီတိုင်းဒေသကြီး", popular: true },
  { city: "Golden Rock", cityMY: "ကျိုက်ထီးရိုး", region: "Mon", regionMY: "မွန်ပြည်နယ်", popular: false },
  { city: "Inle Lake", cityMY: "အင်းလေး", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: true },
  { city: "Pindaya Caves", cityMY: "ပင်းတယလိုဏ်ဂူ", region: "Shan", regionMY: "ရှမ်းပြည်နယ်", popular: false },
  { city: "Popa", cityMY: "ပုပ္ပား", region: "Mandalay", regionMY: "မန္တလေးတိုင်းဒေသကြီး", popular: false },
  { city: "Monyo", cityMY: "မိုးညို", region: "Bago", regionMY: "ပဲခူးတိုင်းဒေသကြီး", popular: false },
];

const DEDUPED: BusCity[] = [];
const seen = new Set<string>();
for (const c of [...ALL_BUS_CITIES, ...EXTRA_TOWNS]) {
  const key = `${c.city}|${c.region}`;
  if (!seen.has(key)) { seen.add(key); DEDUPED.push(c); }
}

export { DEDUPED as BUS_CITIES };

export function getBusCities(): BusCity[] {
  return [...DEDUPED].sort((a, b) => {
    // Popular cities at the top, then strict A–Z
    if (a.popular !== b.popular) return a.popular ? -1 : 1;
    return a.city.localeCompare(b.city);
  });
}
