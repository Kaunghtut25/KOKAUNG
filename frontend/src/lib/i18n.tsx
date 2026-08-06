"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "mm";

/* ─── EN (default) / MM (Burmese) dictionaries ─── */
const en: Record<string, string> = {
  // Global chrome
  "nav.home": "Home",
  "nav.about": "About Us",
  "nav.blog": "Blog",
  "nav.account": "Account",
  "nav.login": "Login",
  "nav.signup": "Sign Up",
  "nav.contactBook": "Contact & Book",
  "nav.bookNow": "Book Now",
  "nav.contactUs": "Contact Us",
  "nav.tours": "Tours",
  "nav.hotels": "Hotels",
  "nav.cars": "Cars",
  "nav.buses": "Buses",
  "nav.visas": "Visas",
  "nav.insurance": "Insurance",
  "nav.cruises": "Cruises",
  "nav.skyLounge": "Sky Lounge",
  "nav.destinations": "Destinations",
  "nav.search": "Search",
  "nav.faq": "FAQ",
  "nav.contact": "Contact",
  "nav.menu": "Toggle menu",
  "nav.close": "Close menu",

  // Footer
  "footer.tagline": "Where every journey is a story waiting to be told!",
  "footer.about": "Premium travel & tours — flights, hotels, cars, visas, cruises and beyond, with care from Myanmar to the world.",
  "footer.explore": "Explore",
  "footer.services": "Services",
  "footer.company": "Company",
  "footer.contact": "Contact",
  "footer.carRentals": "Car Rentals",
  "footer.visaServices": "Visa Services",
  "footer.travelInsurance": "Travel Insurance",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
  "footer.deptTicket": "Ticket Department",
  "footer.deptVisa": "Visa Department",
  "footer.deptHotel": "Hotel Department",
  "footer.deptOutbound": "Outbound Department",
  "footer.deptInbound": "Inbound Department",
  "footer.rights": "All rights reserved.",
  "footer.iata": "IATA Accredited",
  "footer.umta": "UMTA Member",

  // Admin
  "admin.panel": "ADMIN PANEL",
  "admin.administrator": "Administrator",
  "admin.logout": "Logout",
  "admin.viewSite": "View Website",
  "admin.dashboard": "Dashboard",
  "admin.siteManager": "Site Manager",
  "admin.manageAbout": "Manage About",
  "admin.manageFlights": "Manage Flights",
  "admin.manageTours": "Manage Tours",
  "admin.manageHotels": "Manage Hotels",
  "admin.manageCars": "Manage Cars",
  "admin.manageVisas": "Manage Visas",
  "admin.manageInsurance": "Manage Insurance",
  "admin.manageCruises": "Manage Cruises",
  "admin.manageBlog": "Manage Blog",
  "admin.manageUsers": "Manage Users",
  "admin.skyLounge": "Sky Lounge",
  "admin.siteSettings": "Site Settings",

  // Common buttons / labels
  "common.language": "Language",
  "common.loading": "Loading...",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.add": "Add",
  "common.search": "Search",
  "common.back": "Back",

  // Home page — booking widget
  "home.oneWay": "One Way",
  "home.roundTrip": "Round Trip",
  "home.multiCity": "Multi-City",
  "home.from": "From",
  "home.to": "To",
  "home.fromCity": "From city",
  "home.toCity": "To city",
  "home.departureCity": "Departure city",
  "home.arrivalCity": "Arrival city",
  "home.depart": "Depart",
  "home.return": "Return",
  "home.date": "Date",
  "home.class": "Class",
  "home.client": "Client",
  "home.local": "Local",
  "home.foreigner": "Foreigner",
  "home.searchFlights": "Search Flights",
  "home.searchBuses": "Search Buses",
  "home.selectTravelDate": "Select travel date",
  "home.searchCity": "Search city...",
  "home.noCities": "No cities found",
  "home.addAnotherFlight": "Add Another Flight",
  "home.swapAirports": "Swap airports",
  "home.passengers": "Passengers (max 9)",
  "home.adults": "Adults",
  "home.children": "Children",
  "home.pax": "Pax",

  // Home page — sections
  "home.exploreWorld": "Explore The World",
  "home.popularDestinations": "Popular Destinations",
  "home.travelersSay": "What Our Travelers Say",
  "home.followJourney": "Follow Our Journey",
  "home.trustedPartners": "Our Trusted Partners",
  "home.ctaTitle": "Ready to Start Your Journey?",
  "home.ctaDesc": "Let us craft your perfect getaway.",

  // Newsletter
  "newsletter.placeholder": "Your email address",
  "newsletter.subscribe": "Subscribe",
  "newsletter.thanks": "Thank you for subscribing!",
};

const mm: Record<string, string> = {
  // Global chrome
  "nav.home": "ပင်မ",
  "nav.about": "ကျွန်ုပ်တို့အကြောင်း",
  "nav.blog": "ဘလော့",
  "nav.account": "အကောင့်",
  "nav.login": "ဝင်ရောက်မည်",
  "nav.signup": "စာရင်းသွင်းမည်",
  "nav.contactBook": "ဆက်သွယ်ရန် နှင့် ကြိုတင်မှာယူမည်",
  "nav.bookNow": "ယခုကြိုတင်မှာယူမည်",
  "nav.contactUs": "ဆက်သွယ်ရန်",
  "nav.tours": "ခရီးစဉ်များ",
  "nav.hotels": "ဟိုတယ်များ",
  "nav.cars": "ကားများ",
  "nav.buses": "ဘတ်စ်ကားများ",
  "nav.visas": "ဗီဇာများ",
  "nav.insurance": "အာမခံ",
  "nav.cruises": "အပျော်စီးသင်္ဘောများ",
  "nav.skyLounge": "စကိုင်းလောင်ဂျီ",
  "nav.destinations": "ခရီးစဉ်နေရာများ",
  "nav.search": "ရှာဖွေရန်",
  "nav.faq": "အမေးအဖြေများ",
  "nav.contact": "ဆက်သွယ်ရန်",
  "nav.menu": "မီနူးဖွင့်ရန်",
  "nav.close": "မီနူးပိတ်ရန်",

  // Footer
  "footer.tagline": "ခရီးတိုင်းသည် ပြောပြစရာပုံပြင်တစ်ပုဒ် ဖြစ်ပါစေ!",
  "footer.about": "အဆင့်မြင့်ခရီးသွားလုပ်ငန်း — လေယာဉ်၊ ဟိုတယ်၊ ကား၊ ဗီဇာ၊ အပျော်စီးသင်္ဘောနှင့် အခြားဝန်ဆောင်မှုများ၊ မြန်မာပြည်မှ ကမ္ဘာသို့ ဂရုတစိုက်ဖြင့်။",
  "footer.explore": "စူးစမ်းရန်",
  "footer.services": "ဝန်ဆောင်မှုများ",
  "footer.company": "ကုမ္ပဏီ",
  "footer.contact": "ဆက်သွယ်ရန်",
  "footer.carRentals": "ကားငှားရမ်းခြင်း",
  "footer.visaServices": "ဗီဇာဝန်ဆောင်မှု",
  "footer.travelInsurance": "ခရီးသွားအာမခံ",
  "footer.privacy": "ကိုယ်ရေးအချက်အလက်မူဝါဒ",
  "footer.terms": "ဝန်ဆောင်မှုစည်းမျဉ်း",
  "footer.deptTicket": "လက်မှတ်ဌာန",
  "footer.deptVisa": "ဗီဇာဌာန",
  "footer.deptHotel": "ဟိုတယ်ဌာန",
  "footer.deptOutbound": "ပြည်ပထွက်ဌာန",
  "footer.deptInbound": "ပြည်တွင်းဌာန",
  "footer.rights": "မူပိုင်ခွင့်ရှိသည်။",
  "footer.iata": "IATA အသိအမှတ်ပြု",
  "footer.umta": "UMTA အဖွဲ့ဝင်",

  // Admin
  "admin.panel": "အက်မင် စနစ်",
  "admin.administrator": "အက်မင်နစ္စထရေတာ",
  "admin.logout": "ထွက်မည်",
  "admin.viewSite": "ဝက်ဘ်ဆိုက်ကြည့်ရန်",
  "admin.dashboard": "ဒက်ရှ်ဘုတ်",
  "admin.siteManager": "ဆိုက်စီမံခန့်ခွဲမှု",
  "admin.manageAbout": "ကျွန်ုပ်တို့အကြောင်း စီမံရန်",
  "admin.manageFlights": "လေယာဉ်စီမံရန်",
  "admin.manageTours": "ခရီးစဉ်များ စီမံရန်",
  "admin.manageHotels": "ဟိုတယ်များ စီမံရန်",
  "admin.manageCars": "ကားများ စီမံရန်",
  "admin.manageVisas": "ဗီဇာများ စီမံရန်",
  "admin.manageInsurance": "အာမခံ စီမံရန်",
  "admin.manageCruises": "အပျော်စီးသင်္ဘော စီမံရန်",
  "admin.manageBlog": "ဘလော့ စီမံရန်",
  "admin.manageUsers": "အသုံးပြုသူများ စီမံရန်",
  "admin.skyLounge": "စကိုင်းလောင်ဂျီ",
  "admin.siteSettings": "ဆိုက်ဆက်တင်များ",

  // Common buttons / labels
  "common.language": "ဘာသာစကား",
  "common.loading": "ဝန်ဆွဲနေသည်...",
  "common.save": "သိမ်းမည်",
  "common.cancel": "ပယ်ဖျက်မည်",
  "common.delete": "ဖျက်မည်",
  "common.edit": "ပြင်မည်",
  "common.add": "ထည့်မည်",
  "common.search": "ရှာဖွေရန်",
  "common.back": "နောက်သို့",

  // Home page — booking widget
  "home.oneWay": "တစ်လမ်း",
  "home.roundTrip": "သွားပြန်",
  "home.multiCity": "မြို့စုံ",
  "home.from": "မှ",
  "home.to": "သို့",
  "home.fromCity": "ထွက်မည့်မြို့",
  "home.toCity": "ရောက်မည့်မြို့",
  "home.departureCity": "ထွက်ခွာမည့်မြို့",
  "home.arrivalCity": "ဆိုက်ရောက်မည့်မြို့",
  "home.depart": "ထွက်ခွာမည့်ရက်",
  "home.return": "ပြန်လာမည့်ရက်",
  "home.date": "ရက်",
  "home.class": "အတန်း",
  "home.client": "ဖောက်သည်",
  "home.local": "ပြည်တွင်း",
  "home.foreigner": "နိုင်ငံခြားသား",
  "home.searchFlights": "လေယာဉ်ရှာရန်",
  "home.searchBuses": "ဘတ်စ်ကားရှာရန်",
  "home.selectTravelDate": "ခရီးသွားရက်ရွေးပါ",
  "home.searchCity": "မြို့ရှာရန်...",
  "home.noCities": "မြို့မတွေ့ပါ",
  "home.addAnotherFlight": "နောက်ထပ်လေယာဉ်ထည့်ရန်",
  "home.swapAirports": "လေဆိပ်ဖလှယ်ရန်",
  "home.passengers": "ခရီးသည် (အများဆုံး ၉)",
  "home.adults": "လူကြီး",
  "home.children": "ကလေး",
  "home.pax": "ဦး",

  // Home page — sections
  "home.exploreWorld": "ကမ္ဘာကို စူးစမ်းပါ",
  "home.popularDestinations": "လူကြိုက်များသော ခရီးစဉ်များ",
  "home.travelersSay": "ခရီးသွားများ၏ ပြောကြားချက်များ",
  "home.followJourney": "ကျွန်ုပ်တို့၏ ခရီးစဉ်ကို လိုက်ပါ",
  "home.trustedPartners": "ကျွန်ုပ်တို့၏ ယုံကြည်ရသော မိတ်ဖက်များ",
  "home.ctaTitle": "သင့်ခရီးစဉ်ကို စတင်ရန် အသင့်ဖြစ်ပြီလား?",
  "home.ctaDesc": "သင့်အတွက် ပြီးပြည့်စုံသော ခရီးစဉ်ကို ဖန်တီးပေးပါမည်။",

  // Newsletter
  "newsletter.placeholder": "သင့်အီးမေးလ်လိပ်စာ",
  "newsletter.subscribe": "စာရင်းသွင်းမည်",
  "newsletter.thanks": "စာရင်းသွင်းပေးသည့်အတွက် ကျေးဇူးတင်ပါသည်!",
};

const DICTS: Record<Lang, Record<string, string>> = { en, mm };

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx>({
  lang: "en",
  setLang: () => {},
  t: (k: string) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("a9_lang");
      if (saved === "en" || saved === "mm") setLangState(saved);
    } catch { /* ignore */ }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("a9_lang", l);
      document.documentElement.lang = l;
    } catch { /* ignore */ }
  };

  const t = (key: string) => DICTS[lang][key] ?? en[key] ?? key;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
