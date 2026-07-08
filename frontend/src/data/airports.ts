export interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
  lat: number;
  lon: number;
}

export const airports: Airport[] = [
  // ==================== Myanmar ====================
  { code: "RGN", city: "Yangon", country: "Myanmar", name: "Yangon International Airport", lat: 16.9072, lon: 96.1332 },
  { code: "MDL", city: "Mandalay", country: "Myanmar", name: "Mandalay International Airport", lat: 21.7022, lon: 95.9779 },
  { code: "NYU", city: "Naypyidaw", country: "Myanmar", name: "Naypyidaw International Airport", lat: 19.6190, lon: 96.2005 },
  { code: "HEH", city: "Heho", country: "Myanmar", name: "Heho Airport", lat: 20.7468, lon: 96.7920 },
  { code: "NYT", city: "Naypyidaw", country: "Myanmar", name: "Nay Pyi Taw International Airport", lat: 19.6235, lon: 96.2010 },
  { code: "SNW", city: "Thandwe", country: "Myanmar", name: "Thandwe Airport", lat: 18.4605, lon: 94.3001 },
  { code: "THL", city: "Tachileik", country: "Myanmar", name: "Tachileik Airport", lat: 20.4838, lon: 99.9354 },
  { code: "AKY", city: "Sittwe", country: "Myanmar", name: "Sittwe Airport", lat: 20.1327, lon: 92.8726 },
  { code: "KET", city: "Kengtung", country: "Myanmar", name: "Kengtung Airport", lat: 21.3016, lon: 99.6360 },
  { code: "KAW", city: "Kawthaung", country: "Myanmar", name: "Kawthaung Airport", lat: 10.0493, lon: 98.5380 },
  { code: "LSH", city: "Lashio", country: "Myanmar", name: "Lashio Airport", lat: 22.9779, lon: 97.7522 },
  { code: "MWQ", city: "Magway", country: "Myanmar", name: "Magway Airport", lat: 20.1652, lon: 94.9411 },
  { code: "MGZ", city: "Myeik", country: "Myanmar", name: "Myeik Airport", lat: 12.4398, lon: 98.6215 },
  { code: "MYT", city: "Myitkyina", country: "Myanmar", name: "Myitkyina Airport", lat: 25.3836, lon: 97.3519 },
  { code: "KYP", city: "Kyaukpyu", country: "Myanmar", name: "Kyaukpyu Airport", lat: 19.4264, lon: 93.5348 },
  { code: "PKK", city: "Pakokku", country: "Myanmar", name: "Pakokku Airport", lat: 21.4046, lon: 95.1117 },
  { code: "TVY", city: "Dawei", country: "Myanmar", name: "Dawei Airport", lat: 14.1039, lon: 98.2036 },
  { code: "MOG", city: "Mong Hsat", country: "Myanmar", name: "Mong Hsat Airport", lat: 20.5168, lon: 99.2566 },
  { code: "PAU", city: "Pauk", country: "Myanmar", name: "Pauk Airport", lat: 21.4492, lon: 94.4869 },
  { code: "BMO", city: "Bhamo", country: "Myanmar", name: "Bhamo Airport", lat: 24.2697, lon: 97.2470 },
  { code: "GAW", city: "Gangaw", country: "Myanmar", name: "Gangaw Airport", lat: 22.1747, lon: 94.1341 },
  { code: "KHM", city: "Khamti", country: "Myanmar", name: "Khamti Airport", lat: 25.9883, lon: 95.6744 },
  { code: "KMV", city: "Kalaymyo", country: "Myanmar", name: "Kalaymyo Airport", lat: 23.1888, lon: 94.0511 },
  { code: "LIW", city: "Loikaw", country: "Myanmar", name: "Loikaw Airport", lat: 19.6915, lon: 97.2148 },
  { code: "MOE", city: "Momeik", country: "Myanmar", name: "Momeik Airport", lat: 23.0925, lon: 96.6453 },
  { code: "MNU", city: "Mawlamyine", country: "Myanmar", name: "Mawlamyine Airport", lat: 16.4447, lon: 97.6607 },
  { code: "NMS", city: "Namsang", country: "Myanmar", name: "Namsang Airport", lat: 20.8905, lon: 97.7359 },
  { code: "PAA", city: "Hpa-An", country: "Myanmar", name: "Hpa-An Airport", lat: 16.8937, lon: 97.6746 },
  { code: "PRU", city: "Pyay", country: "Myanmar", name: "Pyay Airport", lat: 18.8245, lon: 95.2660 },
  { code: "TIO", city: "Htilin", country: "Myanmar", name: "Htilin Airport", lat: 21.7000, lon: 94.1000 },
  { code: "VBP", city: "Bokpyin", country: "Myanmar", name: "Bokpyin Airport", lat: 11.1690, lon: 98.7359 },

  // ==================== Southeast Asia ====================
  // --- Thailand ---
  { code: "BKK", city: "Bangkok", country: "Thailand", name: "Suvarnabhumi Airport", lat: 13.6900, lon: 100.7501 },
  { code: "DMK", city: "Bangkok", country: "Thailand", name: "Don Mueang International Airport", lat: 13.9125, lon: 100.6067 },
  { code: "HKT", city: "Phuket", country: "Thailand", name: "Phuket International Airport", lat: 8.1132, lon: 98.3169 },
  { code: "CNX", city: "Chiang Mai", country: "Thailand", name: "Chiang Mai International Airport", lat: 18.7668, lon: 98.9626 },
  { code: "KBV", city: "Krabi", country: "Thailand", name: "Krabi International Airport", lat: 8.0994, lon: 98.9862 },
  { code: "USM", city: "Koh Samui", country: "Thailand", name: "Samui Airport", lat: 9.5478, lon: 100.0623 },
  { code: "HDY", city: "Hat Yai", country: "Thailand", name: "Hat Yai International Airport", lat: 6.9332, lon: 100.3929 },
  { code: "CEI", city: "Chiang Rai", country: "Thailand", name: "Chiang Rai International Airport", lat: 19.9523, lon: 99.8829 },
  { code: "UTP", city: "Pattaya", country: "Thailand", name: "U-Tapao International Airport", lat: 12.6799, lon: 101.0050 },
  { code: "UTH", city: "Udon Thani", country: "Thailand", name: "Udon Thani International Airport", lat: 17.3864, lon: 102.7882 },
  { code: "KKC", city: "Khon Kaen", country: "Thailand", name: "Khon Kaen Airport", lat: 16.4666, lon: 102.7837 },
  { code: "UBP", city: "Ubon Ratchathani", country: "Thailand", name: "Ubon Ratchathani Airport", lat: 15.2513, lon: 104.8702 },
  { code: "TST", city: "Trang", country: "Thailand", name: "Trang Airport", lat: 7.5087, lon: 99.6166 },
  { code: "URT", city: "Surat Thani", country: "Thailand", name: "Surat Thani International Airport", lat: 9.1326, lon: 99.1356 },
  { code: "NST", city: "Nakhon Si Thammarat", country: "Thailand", name: "Nakhon Si Thammarat Airport", lat: 8.4712, lon: 99.9556 },
  { code: "TDX", city: "Trat", country: "Thailand", name: "Trat Airport", lat: 12.2746, lon: 102.3190 },
  { code: "PHS", city: "Phitsanulok", country: "Thailand", name: "Phitsanulok Airport", lat: 16.7829, lon: 100.2791 },
  { code: "LPT", city: "Lampang", country: "Thailand", name: "Lampang Airport", lat: 18.2709, lon: 99.5042 },
  { code: "NAW", city: "Narathiwat", country: "Thailand", name: "Narathiwat Airport", lat: 6.5199, lon: 101.7434 },
  { code: "NNT", city: "Nan", country: "Thailand", name: "Nan Nakhon Airport", lat: 18.8079, lon: 100.7834 },
  { code: "LOE", city: "Loei", country: "Thailand", name: "Loei Airport", lat: 17.4391, lon: 101.7221 },
  { code: "SNO", city: "Sakon Nakhon", country: "Thailand", name: "Sakon Nakhon Airport", lat: 17.1951, lon: 104.1186 },
  { code: "HGN", city: "Mae Hong Son", country: "Thailand", name: "Mae Hong Son Airport", lat: 19.3017, lon: 97.9750 },
  { code: "BAO", city: "Buriram", country: "Thailand", name: "Buriram Airport", lat: 15.2295, lon: 103.2533 },
  { code: "ROI", city: "Roi Et", country: "Thailand", name: "Roi Et Airport", lat: 16.1168, lon: 103.7738 },

  // --- Singapore ---
  { code: "SIN", city: "Singapore", country: "Singapore", name: "Singapore Changi Airport", lat: 1.3644, lon: 103.9915 },

  // --- Malaysia ---
  { code: "KUL", city: "Kuala Lumpur", country: "Malaysia", name: "Kuala Lumpur International Airport", lat: 2.7456, lon: 101.7099 },
  { code: "SZB", city: "Kuala Lumpur", country: "Malaysia", name: "Sultan Abdul Aziz Shah Airport", lat: 3.1306, lon: 101.5493 },
  { code: "BKI", city: "Kota Kinabalu", country: "Malaysia", name: "Kota Kinabalu International Airport", lat: 5.9372, lon: 116.0512 },
  { code: "PEN", city: "Penang", country: "Malaysia", name: "Penang International Airport", lat: 5.2971, lon: 100.2769 },
  { code: "KCH", city: "Kuching", country: "Malaysia", name: "Kuching International Airport", lat: 1.4847, lon: 110.3470 },
  { code: "LGK", city: "Langkawi", country: "Malaysia", name: "Langkawi International Airport", lat: 6.3297, lon: 99.7287 },
  { code: "JHB", city: "Johor Bahru", country: "Malaysia", name: "Senai International Airport", lat: 1.6413, lon: 103.6696 },
  { code: "MYY", city: "Miri", country: "Malaysia", name: "Miri Airport", lat: 4.3220, lon: 113.9868 },
  { code: "SBW", city: "Sibu", country: "Malaysia", name: "Sibu Airport", lat: 2.2616, lon: 111.9853 },
  { code: "TGG", city: "Kuala Terengganu", country: "Malaysia", name: "Sultan Mahmud Airport", lat: 5.3826, lon: 103.1033 },
  { code: "KBR", city: "Kota Bharu", country: "Malaysia", name: "Sultan Ismail Petra Airport", lat: 6.1668, lon: 102.2930 },
  { code: "AOR", city: "Alor Setar", country: "Malaysia", name: "Sultan Abdul Halim Airport", lat: 6.1897, lon: 100.3982 },
  { code: "IPH", city: "Ipoh", country: "Malaysia", name: "Sultan Azlan Shah Airport", lat: 4.5679, lon: 101.0920 },
  { code: "KUA", city: "Kuantan", country: "Malaysia", name: "Sultan Ahmad Shah Airport", lat: 3.7754, lon: 103.2094 },
  { code: "LDU", city: "Lahad Datu", country: "Malaysia", name: "Lahad Datu Airport", lat: 5.0322, lon: 118.3247 },
  { code: "TWU", city: "Tawau", country: "Malaysia", name: "Tawau Airport", lat: 4.3201, lon: 118.1280 },
  { code: "SDK", city: "Sandakan", country: "Malaysia", name: "Sandakan Airport", lat: 5.9009, lon: 118.0595 },
  { code: "BTU", city: "Bintulu", country: "Malaysia", name: "Bintulu Airport", lat: 3.1238, lon: 113.0205 },

  // --- Vietnam ---
  { code: "HAN", city: "Hanoi", country: "Vietnam", name: "Noi Bai International Airport", lat: 21.2212, lon: 105.8072 },
  { code: "SGN", city: "Ho Chi Minh City", country: "Vietnam", name: "Tan Son Nhat International Airport", lat: 10.8188, lon: 106.6520 },
  { code: "DAD", city: "Da Nang", country: "Vietnam", name: "Da Nang International Airport", lat: 16.0439, lon: 108.1994 },
  { code: "CXR", city: "Nha Trang", country: "Vietnam", name: "Cam Ranh International Airport", lat: 11.9982, lon: 109.2194 },
  { code: "HPH", city: "Haiphong", country: "Vietnam", name: "Cat Bi International Airport", lat: 20.8194, lon: 106.7250 },
  { code: "VII", city: "Vinh", country: "Vietnam", name: "Vinh International Airport", lat: 18.7376, lon: 105.6708 },
  { code: "HUI", city: "Hue", country: "Vietnam", name: "Phu Bai International Airport", lat: 16.4015, lon: 107.7026 },
  { code: "PQC", city: "Phu Quoc", country: "Vietnam", name: "Phu Quoc International Airport", lat: 10.1698, lon: 103.9931 },
  { code: "BMV", city: "Buon Ma Thuot", country: "Vietnam", name: "Buon Ma Thuot Airport", lat: 12.6683, lon: 108.1203 },
  { code: "DLI", city: "Da Lat", country: "Vietnam", name: "Lien Khuong Airport", lat: 11.7500, lon: 108.3670 },
  { code: "UIH", city: "Quy Nhon", country: "Vietnam", name: "Phu Cat Airport", lat: 13.9550, lon: 109.0422 },
  { code: "DIN", city: "Dien Bien Phu", country: "Vietnam", name: "Dien Bien Phu Airport", lat: 21.3975, lon: 103.0078 },
  { code: "THD", city: "Thanh Hoa", country: "Vietnam", name: "Tho Xuan Airport", lat: 19.9017, lon: 105.4679 },
  { code: "VDH", city: "Dong Hoi", country: "Vietnam", name: "Dong Hoi Airport", lat: 17.5150, lon: 106.5906 },
  { code: "VCL", city: "Tam Ky", country: "Vietnam", name: "Chu Lai International Airport", lat: 15.4033, lon: 108.7060 },
  { code: "VCA", city: "Can Tho", country: "Vietnam", name: "Can Tho International Airport", lat: 10.0851, lon: 105.7119 },
  { code: "VCS", city: "Con Dao", country: "Vietnam", name: "Con Dao Airport", lat: 8.7318, lon: 106.6330 },
  { code: "TBB", city: "Tuy Hoa", country: "Vietnam", name: "Tuy Hoa Airport", lat: 13.0496, lon: 109.3337 },

  // --- Cambodia ---
  { code: "PNH", city: "Phnom Penh", country: "Cambodia", name: "Phnom Penh International Airport", lat: 11.5466, lon: 104.8441 },
  { code: "REP", city: "Siem Reap", country: "Cambodia", name: "Siem Reap International Airport", lat: 13.4107, lon: 103.8130 },
  { code: "SAI", city: "Siem Reap", country: "Cambodia", name: "Siem Reap-Angkor International Airport", lat: 13.3700, lon: 104.2227 },
  { code: "KOS", city: "Sihanoukville", country: "Cambodia", name: "Sihanoukville International Airport", lat: 10.5797, lon: 103.6368 },

  // --- Laos ---
  { code: "VTE", city: "Vientiane", country: "Laos", name: "Wattay International Airport", lat: 17.9883, lon: 102.5633 },
  { code: "LPQ", city: "Luang Prabang", country: "Laos", name: "Luang Prabang International Airport", lat: 19.8973, lon: 102.1608 },
  { code: "PKZ", city: "Pakse", country: "Laos", name: "Pakse International Airport", lat: 15.1321, lon: 105.7810 },
  { code: "ZVK", city: "Savannakhet", country: "Laos", name: "Savannakhet Airport", lat: 16.5566, lon: 104.7595 },
  { code: "ODY", city: "Muang Xay", country: "Laos", name: "Oudomsay Airport", lat: 20.6827, lon: 101.9940 },
  { code: "LXG", city: "Luang Namtha", country: "Laos", name: "Luang Namtha Airport", lat: 20.9605, lon: 101.4025 },

  // --- Indonesia ---
  { code: "CGK", city: "Jakarta", country: "Indonesia", name: "Soekarno-Hatta International Airport", lat: -6.1256, lon: 106.6559 },
  { code: "HLP", city: "Jakarta", country: "Indonesia", name: "Halim Perdanakusuma Airport", lat: -6.2666, lon: 106.8911 },
  { code: "DPS", city: "Denpasar", country: "Indonesia", name: "Ngurah Rai International Airport", lat: -8.7482, lon: 115.1671 },
  { code: "SUB", city: "Surabaya", country: "Indonesia", name: "Juanda International Airport", lat: -7.3798, lon: 112.7868 },
  { code: "KNO", city: "Medan", country: "Indonesia", name: "Kualanamu International Airport", lat: 3.6414, lon: 98.8854 },
  { code: "UPG", city: "Makassar", country: "Indonesia", name: "Sultan Hasanuddin International Airport", lat: -5.0616, lon: 119.5540 },
  { code: "JOG", city: "Yogyakarta", country: "Indonesia", name: "Adisutjipto Airport", lat: -7.7882, lon: 110.4315 },
  { code: "YIA", city: "Yogyakarta", country: "Indonesia", name: "Yogyakarta International Airport", lat: -7.9050, lon: 110.0550 },
  { code: "BPN", city: "Balikpapan", country: "Indonesia", name: "Sultan Aji Muhammad Sulaiman Airport", lat: -1.2684, lon: 116.8946 },
  { code: "SRG", city: "Semarang", country: "Indonesia", name: "Achmad Yani International Airport", lat: -6.9727, lon: 110.3746 },
  { code: "BDO", city: "Bandung", country: "Indonesia", name: "Husein Sastranegara Airport", lat: -6.9006, lon: 107.5763 },
  { code: "LOP", city: "Praya", country: "Indonesia", name: "Lombok International Airport", lat: -8.7573, lon: 116.2766 },
  { code: "PDG", city: "Padang", country: "Indonesia", name: "Minangkabau International Airport", lat: -0.7869, lon: 100.2807 },
  { code: "PKU", city: "Pekanbaru", country: "Indonesia", name: "Sultan Syarif Kasim II Airport", lat: 0.4608, lon: 101.4445 },
  { code: "PLM", city: "Palembang", country: "Indonesia", name: "Sultan Mahmud Badaruddin II Airport", lat: -2.8983, lon: 104.6999 },
  { code: "BDJ", city: "Banjarmasin", country: "Indonesia", name: "Syamsudin Noor Airport", lat: -3.4424, lon: 114.7625 },
  { code: "PNK", city: "Pontianak", country: "Indonesia", name: "Supadio Airport", lat: -0.1507, lon: 109.4039 },
  { code: "MDC", city: "Manado", country: "Indonesia", name: "Sam Ratulangi International Airport", lat: 1.5492, lon: 124.9263 },
  { code: "SOC", city: "Surakarta", country: "Indonesia", name: "Adisumarmo International Airport", lat: -7.5161, lon: 110.7568 },
  { code: "AMQ", city: "Ambon", country: "Indonesia", name: "Pattimura Airport", lat: -3.7104, lon: 128.0891 },
  { code: "BTH", city: "Batam", country: "Indonesia", name: "Hang Nadim Airport", lat: 1.1210, lon: 104.1187 },
  { code: "TJQ", city: "Tanjung Pandan", country: "Indonesia", name: "H.A.S. Hanandjoeddin Airport", lat: -2.7457, lon: 107.7549 },
  { code: "KOE", city: "Kupang", country: "Indonesia", name: "El Tari Airport", lat: -10.1716, lon: 123.6711 },
  { code: "DJJ", city: "Jayapura", country: "Indonesia", name: "Sentani Airport", lat: -2.5770, lon: 140.5163 },
  { code: "BIK", city: "Biak", country: "Indonesia", name: "Frans Kaisiepo Airport", lat: -1.1900, lon: 136.1075 },
  { code: "SOQ", city: "Sorong", country: "Indonesia", name: "Domine Eduard Osok Airport", lat: -0.9264, lon: 131.2872 },
  { code: "TIM", city: "Tembagapura", country: "Indonesia", name: "Mozes Kilangin Airport", lat: -4.5280, lon: 136.8874 },
  { code: "LBJ", city: "Labuan Bajo", country: "Indonesia", name: "Komodo Airport", lat: -8.4867, lon: 119.8890 },
  { code: "TRK", city: "Tarakan", country: "Indonesia", name: "Juwata Airport", lat: 3.3267, lon: 117.5694 },
  { code: "PGK", city: "Pangkal Pinang", country: "Indonesia", name: "Depati Amir Airport", lat: -2.1622, lon: 106.1390 },

  // --- Philippines ---
  { code: "MNL", city: "Manila", country: "Philippines", name: "Ninoy Aquino International Airport", lat: 14.5086, lon: 121.0196 },
  { code: "CEB", city: "Cebu", country: "Philippines", name: "Mactan-Cebu International Airport", lat: 10.3075, lon: 123.9794 },
  { code: "DVO", city: "Davao", country: "Philippines", name: "Francisco Bangoy International Airport", lat: 7.1255, lon: 125.6458 },
  { code: "CRK", city: "Angeles/Clark", country: "Philippines", name: "Clark International Airport", lat: 15.1860, lon: 120.5603 },
  { code: "KLO", city: "Kalibo", country: "Philippines", name: "Kalibo International Airport", lat: 11.6794, lon: 122.3763 },
  { code: "MPH", city: "Caticlan", country: "Philippines", name: "Godofredo P. Ramos Airport", lat: 11.9245, lon: 121.9536 },
  { code: "ILO", city: "Iloilo", country: "Philippines", name: "Iloilo International Airport", lat: 10.7139, lon: 122.5453 },
  { code: "TAG", city: "Tagbilaran", country: "Philippines", name: "Bohol-Panglao Airport", lat: 9.6642, lon: 123.8527 },
  { code: "ZAM", city: "Zamboanga", country: "Philippines", name: "Zamboanga International Airport", lat: 6.9224, lon: 122.0596 },
  { code: "PPS", city: "Puerto Princesa", country: "Philippines", name: "Puerto Princesa International Airport", lat: 9.7421, lon: 118.7587 },
  { code: "BCD", city: "Bacolod", country: "Philippines", name: "Bacolod-Silay Airport", lat: 10.7764, lon: 123.0148 },
  { code: "TAC", city: "Tacloban", country: "Philippines", name: "Daniel Z. Romualdez Airport", lat: 11.2276, lon: 125.0277 },
  { code: "CBO", city: "Cotabato", country: "Philippines", name: "Cotabato Airport", lat: 7.1652, lon: 124.2096 },
  { code: "CGY", city: "Cagayan de Oro", country: "Philippines", name: "Laguindingan Airport", lat: 8.6125, lon: 124.4565 },
  { code: "GES", city: "General Santos", country: "Philippines", name: "General Santos International Airport", lat: 6.1064, lon: 125.2353 },
  { code: "DGT", city: "Dumaguete", country: "Philippines", name: "Sibulan Airport", lat: 9.3337, lon: 123.3004 },
  { code: "BXU", city: "Butuan", country: "Philippines", name: "Bancasi Airport", lat: 8.9513, lon: 125.4784 },

  // --- Brunei ---
  { code: "BWN", city: "Bandar Seri Begawan", country: "Brunei", name: "Brunei International Airport", lat: 4.9442, lon: 114.9284 },

  // ==================== East Asia ====================
  // --- China ---
  { code: "PEK", city: "Beijing", country: "China", name: "Beijing Capital International Airport", lat: 40.0799, lon: 116.6031 },
  { code: "PKX", city: "Beijing", country: "China", name: "Beijing Daxing International Airport", lat: 39.5098, lon: 116.4105 },
  { code: "PVG", city: "Shanghai", country: "China", name: "Shanghai Pudong International Airport", lat: 31.1443, lon: 121.8083 },
  { code: "SHA", city: "Shanghai", country: "China", name: "Shanghai Hongqiao International Airport", lat: 31.1979, lon: 121.3363 },
  { code: "CAN", city: "Guangzhou", country: "China", name: "Guangzhou Baiyun International Airport", lat: 23.3925, lon: 113.2988 },
  { code: "SZX", city: "Shenzhen", country: "China", name: "Shenzhen Bao'an International Airport", lat: 22.6394, lon: 113.8110 },
  { code: "CTU", city: "Chengdu", country: "China", name: "Chengdu Shuangliu International Airport", lat: 30.5784, lon: 103.9469 },
  { code: "TFU", city: "Chengdu", country: "China", name: "Chengdu Tianfu International Airport", lat: 30.3197, lon: 104.4413 },
  { code: "CKG", city: "Chongqing", country: "China", name: "Chongqing Jiangbei International Airport", lat: 29.7192, lon: 106.6417 },
  { code: "KMG", city: "Kunming", country: "China", name: "Kunming Changshui International Airport", lat: 25.1019, lon: 102.9291 },
  { code: "XIY", city: "Xi'an", country: "China", name: "Xi'an Xianyang International Airport", lat: 34.4471, lon: 108.7516 },
  { code: "HGH", city: "Hangzhou", country: "China", name: "Hangzhou Xiaoshan International Airport", lat: 30.2295, lon: 120.4344 },
  { code: "XMN", city: "Xiamen", country: "China", name: "Xiamen Gaoqi International Airport", lat: 24.5440, lon: 118.1277 },
  { code: "WUH", city: "Wuhan", country: "China", name: "Wuhan Tianhe International Airport", lat: 30.7838, lon: 114.2081 },
  { code: "NKG", city: "Nanjing", country: "China", name: "Nanjing Lukou International Airport", lat: 31.7420, lon: 118.8620 },
  { code: "CSX", city: "Changsha", country: "China", name: "Changsha Huanghua International Airport", lat: 28.1892, lon: 113.2200 },
  { code: "TAO", city: "Qingdao", country: "China", name: "Qingdao Jiaodong International Airport", lat: 36.3620, lon: 120.0890 },
  { code: "DLC", city: "Dalian", country: "China", name: "Dalian Zhoushuizi International Airport", lat: 38.9657, lon: 121.5386 },
  { code: "SYX", city: "Sanya", country: "China", name: "Sanya Phoenix International Airport", lat: 18.3029, lon: 109.4122 },
  { code: "HAK", city: "Haikou", country: "China", name: "Haikou Meilan International Airport", lat: 19.9349, lon: 110.4590 },
  { code: "URC", city: "Urumqi", country: "China", name: "Urumqi Diwopu International Airport", lat: 43.9071, lon: 87.4743 },
  { code: "HRB", city: "Harbin", country: "China", name: "Harbin Taiping International Airport", lat: 45.6234, lon: 126.2503 },
  { code: "TNA", city: "Jinan", country: "China", name: "Jinan Yaoqiang International Airport", lat: 36.8572, lon: 117.2160 },
  { code: "FOC", city: "Fuzhou", country: "China", name: "Fuzhou Changle International Airport", lat: 25.9351, lon: 119.6633 },
  { code: "ZUH", city: "Zhuhai", country: "China", name: "Zhuhai Jinwan Airport", lat: 22.0064, lon: 113.3760 },
  { code: "NNG", city: "Nanning", country: "China", name: "Nanning Wuxu International Airport", lat: 22.6082, lon: 108.1724 },
  { code: "KWE", city: "Guiyang", country: "China", name: "Guiyang Longdongbao International Airport", lat: 26.5385, lon: 106.8008 },
  { code: "LHW", city: "Lanzhou", country: "China", name: "Lanzhou Zhongchuan International Airport", lat: 36.5152, lon: 103.6205 },
  { code: "CGO", city: "Zhengzhou", country: "China", name: "Zhengzhou Xinzheng International Airport", lat: 34.5197, lon: 113.8409 },
  { code: "WUX", city: "Wuxi", country: "China", name: "Sunan Shuofang International Airport", lat: 31.4944, lon: 120.4292 },
  { code: "HET", city: "Hohhot", country: "China", name: "Hohhot Baita International Airport", lat: 40.8514, lon: 111.8241 },
  { code: "SWA", city: "Shantou", country: "China", name: "Jieyang Chaoshan International Airport", lat: 23.5520, lon: 116.5030 },
  { code: "SHE", city: "Shenyang", country: "China", name: "Shenyang Taoxian International Airport", lat: 41.6398, lon: 123.4834 },
  { code: "TSN", city: "Tianjin", country: "China", name: "Tianjin Binhai International Airport", lat: 39.1244, lon: 117.3462 },
  { code: "WEH", city: "Weihai", country: "China", name: "Weihai Dashuibo Airport", lat: 37.1871, lon: 122.2289 },
  { code: "WNZ", city: "Wenzhou", country: "China", name: "Wenzhou Longwan International Airport", lat: 27.9123, lon: 120.8517 },
  { code: "YNT", city: "Yantai", country: "China", name: "Yantai Penglai International Airport", lat: 37.6597, lon: 120.9788 },
  { code: "INC", city: "Yinchuan", country: "China", name: "Yinchuan Hedong International Airport", lat: 38.4819, lon: 106.0090 },
  { code: "KHN", city: "Nanchang", country: "China", name: "Nanchang Changbei International Airport", lat: 28.8650, lon: 115.9000 },
  { code: "NGB", city: "Ningbo", country: "China", name: "Ningbo Lishe International Airport", lat: 29.8267, lon: 121.4619 },
  { code: "TXN", city: "Huangshan", country: "China", name: "Huangshan Tunxi International Airport", lat: 29.7333, lon: 118.2559 },
  { code: "JJN", city: "Jinjiang", country: "China", name: "Quanzhou Jinjiang International Airport", lat: 24.7964, lon: 118.5897 },

  // --- Hong Kong / Macau ---
  { code: "HKG", city: "Hong Kong", country: "Hong Kong", name: "Hong Kong International Airport", lat: 22.3080, lon: 113.9185 },
  { code: "MFM", city: "Macau", country: "Macau", name: "Macau International Airport", lat: 22.1496, lon: 113.5916 },

  // --- Taiwan ---
  { code: "TPE", city: "Taipei", country: "Taiwan", name: "Taiwan Taoyuan International Airport", lat: 25.0777, lon: 121.2328 },
  { code: "TSA", city: "Taipei", country: "Taiwan", name: "Taipei Songshan Airport", lat: 25.0694, lon: 121.5518 },
  { code: "KHH", city: "Kaohsiung", country: "Taiwan", name: "Kaohsiung International Airport", lat: 22.5771, lon: 120.3500 },
  { code: "RMQ", city: "Taichung", country: "Taiwan", name: "Taichung International Airport", lat: 24.2647, lon: 120.6206 },

  // --- Japan ---
  { code: "NRT", city: "Tokyo", country: "Japan", name: "Narita International Airport", lat: 35.7719, lon: 140.3929 },
  { code: "HND", city: "Tokyo", country: "Japan", name: "Haneda Airport", lat: 35.5494, lon: 139.7798 },
  { code: "KIX", city: "Osaka", country: "Japan", name: "Kansai International Airport", lat: 34.4320, lon: 135.2304 },
  { code: "ITM", city: "Osaka", country: "Japan", name: "Osaka International Airport (Itami)", lat: 34.7855, lon: 135.4383 },
  { code: "NGO", city: "Nagoya", country: "Japan", name: "Chubu Centrair International Airport", lat: 34.8584, lon: 136.8054 },
  { code: "FUK", city: "Fukuoka", country: "Japan", name: "Fukuoka Airport", lat: 33.5859, lon: 130.4506 },
  { code: "CTS", city: "Sapporo", country: "Japan", name: "New Chitose Airport", lat: 42.7752, lon: 141.6923 },
  { code: "OKA", city: "Naha", country: "Japan", name: "Naha Airport", lat: 26.1958, lon: 127.6459 },
  { code: "SDJ", city: "Sendai", country: "Japan", name: "Sendai Airport", lat: 38.1397, lon: 140.9169 },
  { code: "HIJ", city: "Hiroshima", country: "Japan", name: "Hiroshima Airport", lat: 34.4361, lon: 132.9194 },
  { code: "KMQ", city: "Komatsu", country: "Japan", name: "Komatsu Airport", lat: 36.3946, lon: 136.4066 },
  { code: "KOJ", city: "Kagoshima", country: "Japan", name: "Kagoshima Airport", lat: 31.8034, lon: 130.7194 },
  { code: "KMJ", city: "Kumamoto", country: "Japan", name: "Kumamoto Airport", lat: 32.8373, lon: 130.8551 },
  { code: "OIT", city: "Oita", country: "Japan", name: "Oita Airport", lat: 33.4794, lon: 131.7373 },
  { code: "MYJ", city: "Matsuyama", country: "Japan", name: "Matsuyama Airport", lat: 33.8272, lon: 132.6997 },
  { code: "KMI", city: "Miyazaki", country: "Japan", name: "Miyazaki Airport", lat: 31.8772, lon: 131.4486 },
  { code: "NGS", city: "Nagasaki", country: "Japan", name: "Nagasaki Airport", lat: 32.9169, lon: 129.9136 },
  { code: "AOJ", city: "Aomori", country: "Japan", name: "Aomori Airport", lat: 40.7347, lon: 140.6908 },
  { code: "KIJ", city: "Niigata", country: "Japan", name: "Niigata Airport", lat: 37.9559, lon: 139.1206 },
  { code: "OKJ", city: "Okayama", country: "Japan", name: "Okayama Airport", lat: 34.7569, lon: 133.8553 },
  { code: "TAK", city: "Takamatsu", country: "Japan", name: "Takamatsu Airport", lat: 34.2142, lon: 134.0156 },
  { code: "KCZ", city: "Kochi", country: "Japan", name: "Kochi Ryoma Airport", lat: 33.5461, lon: 133.6694 },
  { code: "ASJ", city: "Amami", country: "Japan", name: "Amami Airport", lat: 28.4306, lon: 129.7128 },
  { code: "ISG", city: "Ishigaki", country: "Japan", name: "New Ishigaki Airport", lat: 24.3964, lon: 124.2450 },
  { code: "HKD", city: "Hakodate", country: "Japan", name: "Hakodate Airport", lat: 41.7700, lon: 140.8219 },
  { code: "AOY", city: "Toyama", country: "Japan", name: "Toyama Airport", lat: 36.6483, lon: 137.1875 },
  { code: "KKJ", city: "Kitakyushu", country: "Japan", name: "Kitakyushu Airport", lat: 33.8459, lon: 131.0347 },
  { code: "UKB", city: "Kobe", country: "Japan", name: "Kobe Airport", lat: 34.6328, lon: 135.2239 },

  // --- South Korea ---
  { code: "ICN", city: "Seoul", country: "South Korea", name: "Incheon International Airport", lat: 37.4602, lon: 126.4407 },
  { code: "GMP", city: "Seoul", country: "South Korea", name: "Gimpo International Airport", lat: 37.5583, lon: 126.7905 },
  { code: "PUS", city: "Busan", country: "South Korea", name: "Gimhae International Airport", lat: 35.1796, lon: 128.9382 },
  { code: "CJU", city: "Jeju", country: "South Korea", name: "Jeju International Airport", lat: 33.5113, lon: 126.4930 },
  { code: "TAE", city: "Daegu", country: "South Korea", name: "Daegu International Airport", lat: 35.8941, lon: 128.6589 },
  { code: "KWJ", city: "Gwangju", country: "South Korea", name: "Gwangju Airport", lat: 35.1264, lon: 126.8089 },
  { code: "CJJ", city: "Cheongju", country: "South Korea", name: "Cheongju International Airport", lat: 36.7166, lon: 127.4991 },
  { code: "MWX", city: "Muan", country: "South Korea", name: "Muan International Airport", lat: 34.9914, lon: 126.3828 },
  { code: "YNY", city: "Yangyang", country: "South Korea", name: "Yangyang International Airport", lat: 38.0613, lon: 128.6691 },
  { code: "USN", city: "Ulsan", country: "South Korea", name: "Ulsan Airport", lat: 35.5935, lon: 129.3517 },
  { code: "KUV", city: "Gunsan", country: "South Korea", name: "Gunsan Airport", lat: 35.9038, lon: 126.6156 },
  { code: "WJU", city: "Wonju", country: "South Korea", name: "Wonju Airport", lat: 37.4381, lon: 127.9604 },
  { code: "RSU", city: "Yeosu", country: "South Korea", name: "Yeosu Airport", lat: 34.8423, lon: 127.6169 },
  { code: "HIN", city: "Jinju", country: "South Korea", name: "Sacheon Airport", lat: 35.0885, lon: 128.0704 },

  // ==================== South Asia ====================
  // --- India ---
  { code: "DEL", city: "Delhi", country: "India", name: "Indira Gandhi International Airport", lat: 28.5562, lon: 77.1000 },
  { code: "BOM", city: "Mumbai", country: "India", name: "Chhatrapati Shivaji Maharaj International Airport", lat: 19.0896, lon: 72.8656 },
  { code: "MAA", city: "Chennai", country: "India", name: "Chennai International Airport", lat: 12.9900, lon: 80.1693 },
  { code: "BLR", city: "Bangalore", country: "India", name: "Kempegowda International Airport", lat: 13.1986, lon: 77.7066 },
  { code: "CCU", city: "Kolkata", country: "India", name: "Netaji Subhas Chandra Bose International Airport", lat: 22.6547, lon: 88.4467 },
  { code: "HYD", city: "Hyderabad", country: "India", name: "Rajiv Gandhi International Airport", lat: 17.2403, lon: 78.4294 },
  { code: "COK", city: "Kochi", country: "India", name: "Cochin International Airport", lat: 10.1520, lon: 76.4019 },
  { code: "AMD", city: "Ahmedabad", country: "India", name: "Sardar Vallabhbhai Patel International Airport", lat: 23.0772, lon: 72.6347 },
  { code: "PNQ", city: "Pune", country: "India", name: "Pune Airport", lat: 18.5822, lon: 73.9197 },
  { code: "GOI", city: "Goa", country: "India", name: "Dabolim Airport", lat: 15.3809, lon: 73.8314 },
  { code: "GOX", city: "Goa", country: "India", name: "Manohar International Airport", lat: 15.7308, lon: 73.8621 },
  { code: "JAI", city: "Jaipur", country: "India", name: "Jaipur International Airport", lat: 26.8242, lon: 75.8122 },
  { code: "IXC", city: "Chandigarh", country: "India", name: "Chandigarh Airport", lat: 30.6735, lon: 76.7885 },
  { code: "LKO", city: "Lucknow", country: "India", name: "Chaudhary Charan Singh International Airport", lat: 26.7606, lon: 80.8893 },
  { code: "ATQ", city: "Amritsar", country: "India", name: "Sri Guru Ram Dass Jee International Airport", lat: 31.7096, lon: 74.7973 },
  { code: "IXM", city: "Madurai", country: "India", name: "Madurai Airport", lat: 9.8345, lon: 78.0934 },
  { code: "TRV", city: "Thiruvananthapuram", country: "India", name: "Trivandrum International Airport", lat: 8.4821, lon: 76.9201 },
  { code: "CCJ", city: "Kozhikode", country: "India", name: "Calicut International Airport", lat: 11.1368, lon: 75.9553 },
  { code: "TRZ", city: "Tiruchirappalli", country: "India", name: "Tiruchirappalli International Airport", lat: 10.7654, lon: 78.7097 },
  { code: "CJB", city: "Coimbatore", country: "India", name: "Coimbatore International Airport", lat: 11.0300, lon: 77.0434 },
  { code: "IXB", city: "Siliguri", country: "India", name: "Bagdogra Airport", lat: 26.6812, lon: 88.3286 },
  { code: "IXZ", city: "Port Blair", country: "India", name: "Veer Savarkar International Airport", lat: 11.6412, lon: 92.7297 },
  { code: "GAU", city: "Guwahati", country: "India", name: "Lokpriya Gopinath Bordoloi International Airport", lat: 26.1061, lon: 91.5859 },
  { code: "BBI", city: "Bhubaneswar", country: "India", name: "Biju Patnaik International Airport", lat: 20.2444, lon: 85.8178 },
  { code: "IXR", city: "Ranchi", country: "India", name: "Birsa Munda Airport", lat: 23.3143, lon: 85.3217 },
  { code: "NAG", city: "Nagpur", country: "India", name: "Dr. Babasaheb Ambedkar International Airport", lat: 21.0922, lon: 79.0472 },
  { code: "IDR", city: "Indore", country: "India", name: "Devi Ahilya Bai Holkar Airport", lat: 22.7218, lon: 75.8011 },
  { code: "JDH", city: "Jodhpur", country: "India", name: "Jodhpur Airport", lat: 26.2511, lon: 73.0489 },
  { code: "UDR", city: "Udaipur", country: "India", name: "Maharana Pratap Airport", lat: 24.6177, lon: 73.8961 },
  { code: "VNS", city: "Varanasi", country: "India", name: "Lal Bahadur Shastri International Airport", lat: 25.4524, lon: 82.8593 },
  { code: "VTZ", city: "Visakhapatnam", country: "India", name: "Visakhapatnam Airport", lat: 17.7212, lon: 83.2245 },
  { code: "IMF", city: "Imphal", country: "India", name: "Imphal Airport", lat: 24.7600, lon: 93.8967 },
  { code: "AGR", city: "Agra", country: "India", name: "Agra Airport", lat: 27.1576, lon: 77.9609 },
  { code: "IXJ", city: "Jammu", country: "India", name: "Jammu Airport", lat: 32.6891, lon: 74.8374 },
  { code: "SXR", city: "Srinagar", country: "India", name: "Sheikh ul-Alam International Airport", lat: 33.9871, lon: 74.7742 },
  { code: "IXE", city: "Mangalore", country: "India", name: "Mangaluru International Airport", lat: 12.9613, lon: 74.8901 },

  // --- Bangladesh ---
  { code: "DAC", city: "Dhaka", country: "Bangladesh", name: "Hazrat Shahjalal International Airport", lat: 23.8433, lon: 90.3978 },
  { code: "CGP", city: "Chittagong", country: "Bangladesh", name: "Shah Amanat International Airport", lat: 22.2496, lon: 91.8133 },
  { code: "ZYL", city: "Sylhet", country: "Bangladesh", name: "Osmani International Airport", lat: 24.9630, lon: 91.8668 },
  { code: "CXB", city: "Cox's Bazar", country: "Bangladesh", name: "Cox's Bazar Airport", lat: 21.4522, lon: 91.9639 },

  // --- Sri Lanka ---
  { code: "CMB", city: "Colombo", country: "Sri Lanka", name: "Bandaranaike International Airport", lat: 7.1808, lon: 79.8841 },
  { code: "HRI", city: "Hambantota", country: "Sri Lanka", name: "Mattala Rajapaksa International Airport", lat: 6.2840, lon: 81.1241 },
  { code: "JAF", city: "Jaffna", country: "Sri Lanka", name: "Jaffna International Airport", lat: 9.7923, lon: 80.0701 },

  // --- Nepal ---
  { code: "KTM", city: "Kathmandu", country: "Nepal", name: "Tribhuvan International Airport", lat: 27.6966, lon: 85.3591 },
  { code: "PKR", city: "Pokhara", country: "Nepal", name: "Pokhara International Airport", lat: 28.1896, lon: 83.9824 },
  { code: "BWA", city: "Bhairahawa", country: "Nepal", name: "Gautam Buddha International Airport", lat: 27.5057, lon: 83.4163 },

  // --- Maldives ---
  { code: "MLE", city: "Male", country: "Maldives", name: "Velana International Airport", lat: 4.1918, lon: 73.5291 },
  { code: "GAN", city: "Gan", country: "Maldives", name: "Gan International Airport", lat: -0.6933, lon: 73.1556 },

  // --- Pakistan ---
  { code: "KHI", city: "Karachi", country: "Pakistan", name: "Jinnah International Airport", lat: 24.9066, lon: 67.1608 },
  { code: "LHE", city: "Lahore", country: "Pakistan", name: "Allama Iqbal International Airport", lat: 31.5216, lon: 74.4036 },
  { code: "ISB", city: "Islamabad", country: "Pakistan", name: "Islamabad International Airport", lat: 33.5607, lon: 72.8416 },
  { code: "PEW", city: "Peshawar", country: "Pakistan", name: "Bacha Khan International Airport", lat: 33.9939, lon: 71.5146 },
  { code: "UET", city: "Quetta", country: "Pakistan", name: "Quetta International Airport", lat: 30.2514, lon: 66.9378 },
  { code: "MUX", city: "Multan", country: "Pakistan", name: "Multan International Airport", lat: 30.2033, lon: 71.4191 },
  { code: "SKT", city: "Sialkot", country: "Pakistan", name: "Sialkot International Airport", lat: 32.5356, lon: 74.3639 },
  { code: "GIL", city: "Gilgit", country: "Pakistan", name: "Gilgit Airport", lat: 35.9188, lon: 74.3336 },

  // ==================== Middle East ====================
  // --- UAE ---
  { code: "DXB", city: "Dubai", country: "UAE", name: "Dubai International Airport", lat: 25.2532, lon: 55.3657 },
  { code: "DWC", city: "Dubai", country: "UAE", name: "Al Maktoum International Airport", lat: 24.8964, lon: 55.1614 },
  { code: "AUH", city: "Abu Dhabi", country: "UAE", name: "Abu Dhabi International Airport", lat: 24.4330, lon: 54.6511 },
  { code: "SHJ", city: "Sharjah", country: "UAE", name: "Sharjah International Airport", lat: 25.3286, lon: 55.5172 },
  { code: "RKT", city: "Ras Al Khaimah", country: "UAE", name: "Ras Al Khaimah International Airport", lat: 25.6135, lon: 55.9388 },
  { code: "FJR", city: "Fujairah", country: "UAE", name: "Fujairah International Airport", lat: 25.1122, lon: 56.3240 },

  // --- Qatar ---
  { code: "DOH", city: "Doha", country: "Qatar", name: "Hamad International Airport", lat: 25.2606, lon: 51.6138 },

  // --- Saudi Arabia ---
  { code: "JED", city: "Jeddah", country: "Saudi Arabia", name: "King Abdulaziz International Airport", lat: 21.6796, lon: 39.1565 },
  { code: "RUH", city: "Riyadh", country: "Saudi Arabia", name: "King Khalid International Airport", lat: 24.9576, lon: 46.6988 },
  { code: "DMM", city: "Dammam", country: "Saudi Arabia", name: "King Fahd International Airport", lat: 26.4712, lon: 49.7979 },
  { code: "MED", city: "Medina", country: "Saudi Arabia", name: "Prince Mohammad Bin Abdulaziz Airport", lat: 24.5534, lon: 39.7051 },
  { code: "AHB", city: "Abha", country: "Saudi Arabia", name: "Abha International Airport", lat: 18.2404, lon: 42.6566 },
  { code: "TUU", city: "Tabuk", country: "Saudi Arabia", name: "Tabuk Regional Airport", lat: 28.3654, lon: 36.6189 },
  { code: "GIZ", city: "Jazan", country: "Saudi Arabia", name: "Jazan Regional Airport", lat: 16.9011, lon: 42.5858 },
  { code: "TIF", city: "Taif", country: "Saudi Arabia", name: "Taif Regional Airport", lat: 21.4834, lon: 40.5443 },
  { code: "ELQ", city: "Qassim", country: "Saudi Arabia", name: "Prince Nayef bin Abdulaziz Airport", lat: 26.3028, lon: 43.7739 },
  { code: "HAS", city: "Hail", country: "Saudi Arabia", name: "Ha'il Regional Airport", lat: 27.4379, lon: 41.6863 },
  { code: "YNB", city: "Yanbu", country: "Saudi Arabia", name: "Yanbu Airport", lat: 24.1442, lon: 38.0634 },

  // --- Oman ---
  { code: "MCT", city: "Muscat", country: "Oman", name: "Muscat International Airport", lat: 23.5933, lon: 58.2844 },
  { code: "SLL", city: "Salalah", country: "Oman", name: "Salalah Airport", lat: 17.0387, lon: 54.0913 },

  // --- Kuwait ---
  { code: "KWI", city: "Kuwait City", country: "Kuwait", name: "Kuwait International Airport", lat: 29.2266, lon: 47.9800 },

  // --- Bahrain ---
  { code: "BAH", city: "Manama", country: "Bahrain", name: "Bahrain International Airport", lat: 26.2708, lon: 50.6336 },

  // --- Jordan ---
  { code: "AMM", city: "Amman", country: "Jordan", name: "Queen Alia International Airport", lat: 31.7226, lon: 35.9932 },
  { code: "ADJ", city: "Amman", country: "Jordan", name: "Amman Civil Airport", lat: 31.9727, lon: 35.9916 },
  { code: "AQJ", city: "Aqaba", country: "Jordan", name: "King Hussein International Airport", lat: 29.6116, lon: 35.0181 },

  // --- Israel ---
  { code: "TLV", city: "Tel Aviv", country: "Israel", name: "Ben Gurion Airport", lat: 32.0114, lon: 34.8867 },
  { code: "ETH", city: "Eilat", country: "Israel", name: "Ramon Airport", lat: 29.7256, lon: 34.9983 },
  { code: "HFA", city: "Haifa", country: "Israel", name: "Haifa Airport", lat: 32.8094, lon: 35.0431 },

  // --- Lebanon ---
  { code: "BEY", city: "Beirut", country: "Lebanon", name: "Beirut-Rafic Hariri International Airport", lat: 33.8209, lon: 35.4884 },

  // --- Iraq ---
  { code: "BGW", city: "Baghdad", country: "Iraq", name: "Baghdad International Airport", lat: 33.2625, lon: 44.2346 },
  { code: "BSR", city: "Basra", country: "Iraq", name: "Basra International Airport", lat: 30.5491, lon: 47.6621 },
  { code: "EBL", city: "Erbil", country: "Iraq", name: "Erbil International Airport", lat: 36.2376, lon: 43.9632 },

  // --- Iran ---
  { code: "IKA", city: "Tehran", country: "Iran", name: "Imam Khomeini International Airport", lat: 35.4161, lon: 51.1522 },
  { code: "THR", city: "Tehran", country: "Iran", name: "Mehrabad Airport", lat: 35.6892, lon: 51.3134 },
  { code: "MHD", city: "Mashhad", country: "Iran", name: "Mashhad International Airport", lat: 36.2352, lon: 59.6410 },
  { code: "SYZ", city: "Shiraz", country: "Iran", name: "Shiraz International Airport", lat: 29.5392, lon: 52.5898 },
  { code: "IFN", city: "Isfahan", country: "Iran", name: "Isfahan International Airport", lat: 32.7508, lon: 51.8613 },
  { code: "TBZ", city: "Tabriz", country: "Iran", name: "Tabriz International Airport", lat: 38.1339, lon: 46.2350 },

  // ==================== Turkey ====================
  { code: "IST", city: "Istanbul", country: "Turkey", name: "Istanbul Airport", lat: 41.2613, lon: 28.7419 },
  { code: "SAW", city: "Istanbul", country: "Turkey", name: "Sabiha Gokcen International Airport", lat: 40.8985, lon: 29.3092 },
  { code: "AYT", city: "Antalya", country: "Turkey", name: "Antalya Airport", lat: 36.8987, lon: 30.8005 },
  { code: "ADB", city: "Izmir", country: "Turkey", name: "Adnan Menderes Airport", lat: 38.2924, lon: 27.1570 },
  { code: "ESB", city: "Ankara", country: "Turkey", name: "Esenboga Airport", lat: 40.1281, lon: 32.9951 },
  { code: "DLM", city: "Dalaman", country: "Turkey", name: "Dalaman Airport", lat: 36.7131, lon: 28.7925 },
  { code: "BJV", city: "Bodrum", country: "Turkey", name: "Milas-Bodrum Airport", lat: 37.2506, lon: 27.6643 },
  { code: "ADA", city: "Adana", country: "Turkey", name: "Adana Sakirpasa Airport", lat: 36.9822, lon: 35.2804 },
  { code: "TZX", city: "Trabzon", country: "Turkey", name: "Trabzon Airport", lat: 40.9951, lon: 39.7897 },
  { code: "GZT", city: "Gaziantep", country: "Turkey", name: "Oguzeli Airport", lat: 36.9472, lon: 37.4787 },
  { code: "KYA", city: "Konya", country: "Turkey", name: "Konya Airport", lat: 37.9790, lon: 32.5619 },
  { code: "DNZ", city: "Denizli", country: "Turkey", name: "Cardak Airport", lat: 37.7856, lon: 29.7013 },
  { code: "ASR", city: "Kayseri", country: "Turkey", name: "Erkilet Airport", lat: 38.7704, lon: 35.4954 },
  { code: "EZS", city: "Elazig", country: "Turkey", name: "Elazig Airport", lat: 38.6069, lon: 39.2914 },
  { code: "ERZ", city: "Erzurum", country: "Turkey", name: "Erzurum Airport", lat: 39.9565, lon: 41.1702 },
  { code: "VAN", city: "Van", country: "Turkey", name: "Van Ferit Melen Airport", lat: 38.4682, lon: 43.3323 },
  { code: "DIY", city: "Diyarbakir", country: "Turkey", name: "Diyarbakir Airport", lat: 37.8939, lon: 40.2010 },
  { code: "SZF", city: "Samsun", country: "Turkey", name: "Samsun-Carsamba Airport", lat: 41.2567, lon: 36.5671 },
  { code: "MLX", city: "Malatya", country: "Turkey", name: "Malatya Erhac Airport", lat: 38.4353, lon: 38.0910 },
  { code: "BAL", city: "Batman", country: "Turkey", name: "Batman Airport", lat: 37.9290, lon: 41.1166 },

  // ==================== Europe ====================
  // --- United Kingdom ---
  { code: "LHR", city: "London", country: "United Kingdom", name: "Heathrow Airport", lat: 51.4700, lon: -0.4543 },
  { code: "LGW", city: "London", country: "United Kingdom", name: "Gatwick Airport", lat: 51.1481, lon: -0.1903 },
  { code: "STN", city: "London", country: "United Kingdom", name: "London Stansted Airport", lat: 51.8850, lon: 0.2350 },
  { code: "LTN", city: "London", country: "United Kingdom", name: "London Luton Airport", lat: 51.8747, lon: -0.3683 },
  { code: "LCY", city: "London", country: "United Kingdom", name: "London City Airport", lat: 51.5053, lon: 0.0553 },
  { code: "MAN", city: "Manchester", country: "United Kingdom", name: "Manchester Airport", lat: 53.3537, lon: -2.2750 },
  { code: "EDI", city: "Edinburgh", country: "United Kingdom", name: "Edinburgh Airport", lat: 55.9500, lon: -3.3725 },
  { code: "BHX", city: "Birmingham", country: "United Kingdom", name: "Birmingham Airport", lat: 52.4539, lon: -1.7480 },
  { code: "GLA", city: "Glasgow", country: "United Kingdom", name: "Glasgow Airport", lat: 55.8719, lon: -4.4331 },
  { code: "BRS", city: "Bristol", country: "United Kingdom", name: "Bristol Airport", lat: 51.3827, lon: -2.7191 },
  { code: "LPL", city: "Liverpool", country: "United Kingdom", name: "Liverpool John Lennon Airport", lat: 53.3336, lon: -2.8497 },
  { code: "NCL", city: "Newcastle", country: "United Kingdom", name: "Newcastle Airport", lat: 55.0375, lon: -1.6917 },
  { code: "EMA", city: "Nottingham", country: "United Kingdom", name: "East Midlands Airport", lat: 52.8311, lon: -1.3281 },
  { code: "LBA", city: "Leeds", country: "United Kingdom", name: "Leeds Bradford Airport", lat: 53.8659, lon: -1.6606 },
  { code: "BFS", city: "Belfast", country: "United Kingdom", name: "Belfast International Airport", lat: 54.6575, lon: -6.2158 },
  { code: "BHD", city: "Belfast", country: "United Kingdom", name: "George Best Belfast City Airport", lat: 54.6181, lon: -5.8725 },
  { code: "ABZ", city: "Aberdeen", country: "United Kingdom", name: "Aberdeen Airport", lat: 57.2019, lon: -2.1978 },
  { code: "CWL", city: "Cardiff", country: "United Kingdom", name: "Cardiff Airport", lat: 51.3967, lon: -3.3433 },
  { code: "SOU", city: "Southampton", country: "United Kingdom", name: "Southampton Airport", lat: 50.9503, lon: -1.3568 },

  // --- France ---
  { code: "CDG", city: "Paris", country: "France", name: "Charles de Gaulle Airport", lat: 49.0097, lon: 2.5478 },
  { code: "ORY", city: "Paris", country: "France", name: "Paris Orly Airport", lat: 48.7262, lon: 2.3652 },
  { code: "NCE", city: "Nice", country: "France", name: "Nice Cote d'Azur Airport", lat: 43.6584, lon: 7.2159 },
  { code: "LYS", city: "Lyon", country: "France", name: "Lyon-Saint Exupery Airport", lat: 45.7256, lon: 5.0811 },
  { code: "MRS", city: "Marseille", country: "France", name: "Marseille Provence Airport", lat: 43.4393, lon: 5.2214 },
  { code: "TLS", city: "Toulouse", country: "France", name: "Toulouse-Blagnac Airport", lat: 43.6291, lon: 1.3638 },
  { code: "BOD", city: "Bordeaux", country: "France", name: "Bordeaux-Merignac Airport", lat: 44.8283, lon: -0.7156 },
  { code: "NTE", city: "Nantes", country: "France", name: "Nantes Atlantique Airport", lat: 47.1532, lon: -1.6107 },
  { code: "SXB", city: "Strasbourg", country: "France", name: "Strasbourg Airport", lat: 48.5383, lon: 7.6282 },
  { code: "MPL", city: "Montpellier", country: "France", name: "Montpellier-Mediterranee Airport", lat: 43.5763, lon: 3.9631 },
  { code: "LIL", city: "Lille", country: "France", name: "Lille Airport", lat: 50.5633, lon: 3.0869 },
  { code: "BVA", city: "Beauvais", country: "France", name: "Beauvais-Tille Airport", lat: 49.4544, lon: 2.1128 },
  { code: "PGF", city: "Perpignan", country: "France", name: "Perpignan-Rivesaltes Airport", lat: 42.7404, lon: 2.8707 },
  { code: "CFE", city: "Clermont-Ferrand", country: "France", name: "Clermont-Ferrand Auvergne Airport", lat: 45.7867, lon: 3.1622 },
  { code: "BIQ", city: "Biarritz", country: "France", name: "Biarritz Pays Basque Airport", lat: 43.4684, lon: -1.5314 },

  // --- Germany ---
  { code: "FRA", city: "Frankfurt", country: "Germany", name: "Frankfurt Airport", lat: 50.0379, lon: 8.5622 },
  { code: "MUC", city: "Munich", country: "Germany", name: "Munich Airport", lat: 48.3538, lon: 11.7861 },
  { code: "TXL", city: "Berlin", country: "Germany", name: "Berlin Brandenburg Airport", lat: 52.3667, lon: 13.5033 },
  { code: "BER", city: "Berlin", country: "Germany", name: "Berlin Brandenburg Airport", lat: 52.3667, lon: 13.5033 },
  { code: "DUS", city: "Dusseldorf", country: "Germany", name: "Dusseldorf Airport", lat: 51.2895, lon: 6.7668 },
  { code: "HAM", city: "Hamburg", country: "Germany", name: "Hamburg Airport", lat: 53.6304, lon: 9.9882 },
  { code: "STR", city: "Stuttgart", country: "Germany", name: "Stuttgart Airport", lat: 48.6899, lon: 9.2220 },
  { code: "CGN", city: "Cologne", country: "Germany", name: "Cologne Bonn Airport", lat: 50.8659, lon: 7.1427 },
  { code: "HAJ", city: "Hanover", country: "Germany", name: "Hannover Airport", lat: 52.4611, lon: 9.6851 },
  { code: "NUE", city: "Nuremberg", country: "Germany", name: "Nuremberg Airport", lat: 49.4987, lon: 11.0781 },
  { code: "LEJ", city: "Leipzig", country: "Germany", name: "Leipzig/Halle Airport", lat: 51.4239, lon: 12.2364 },
  { code: "BRE", city: "Bremen", country: "Germany", name: "Bremen Airport", lat: 53.0475, lon: 8.7867 },
  { code: "DRS", city: "Dresden", country: "Germany", name: "Dresden Airport", lat: 51.1345, lon: 13.7681 },
  { code: "DTM", city: "Dortmund", country: "Germany", name: "Dortmund Airport", lat: 51.5183, lon: 7.6122 },
  { code: "FMO", city: "Munster", country: "Germany", name: "Munster Osnabruck Airport", lat: 52.1346, lon: 7.6848 },
  { code: "FKB", city: "Karlsruhe/Baden-Baden", country: "Germany", name: "Karlsruhe/Baden-Baden Airport", lat: 48.7794, lon: 8.0805 },
  { code: "NRN", city: "Dusseldorf", country: "Germany", name: "Weeze Airport", lat: 51.6024, lon: 6.1422 },

  // --- Italy ---
  { code: "FCO", city: "Rome", country: "Italy", name: "Leonardo da Vinci-Fiumicino Airport", lat: 41.8003, lon: 12.2389 },
  { code: "CIA", city: "Rome", country: "Italy", name: "Rome Ciampino Airport", lat: 41.7994, lon: 12.5949 },
  { code: "MXP", city: "Milan", country: "Italy", name: "Malpensa Airport", lat: 45.6306, lon: 8.7281 },
  { code: "LIN", city: "Milan", country: "Italy", name: "Milan Linate Airport", lat: 45.4453, lon: 9.2767 },
  { code: "BGY", city: "Milan", country: "Italy", name: "Orio al Serio International Airport", lat: 45.6739, lon: 9.7042 },
  { code: "VCE", city: "Venice", country: "Italy", name: "Venice Marco Polo Airport", lat: 45.5053, lon: 12.3519 },
  { code: "NAP", city: "Naples", country: "Italy", name: "Naples International Airport", lat: 40.8860, lon: 14.2908 },
  { code: "TRN", city: "Turin", country: "Italy", name: "Turin Airport", lat: 45.2008, lon: 7.6496 },
  { code: "BLQ", city: "Bologna", country: "Italy", name: "Bologna Guglielmo Marconi Airport", lat: 44.5354, lon: 11.2887 },
  { code: "CTA", city: "Catania", country: "Italy", name: "Catania-Fontanarossa Airport", lat: 37.4668, lon: 15.0664 },
  { code: "PMO", city: "Palermo", country: "Italy", name: "Falcone Borsellino Airport", lat: 38.1760, lon: 13.0910 },
  { code: "CAG", city: "Cagliari", country: "Italy", name: "Cagliari Elmas Airport", lat: 39.2515, lon: 9.0543 },
  { code: "FLR", city: "Florence", country: "Italy", name: "Florence Airport", lat: 43.8100, lon: 11.2051 },
  { code: "VRN", city: "Verona", country: "Italy", name: "Verona Villafranca Airport", lat: 45.3957, lon: 10.8885 },
  { code: "PSA", city: "Pisa", country: "Italy", name: "Pisa International Airport", lat: 43.6839, lon: 10.3927 },
  { code: "GOA", city: "Genoa", country: "Italy", name: "Genoa Cristoforo Colombo Airport", lat: 44.4133, lon: 8.8375 },
  { code: "BRI", city: "Bari", country: "Italy", name: "Bari Karol Wojtyla Airport", lat: 41.1389, lon: 16.7606 },
  { code: "AHO", city: "Alghero", country: "Italy", name: "Alghero-Fertilia Airport", lat: 40.6321, lon: 8.2908 },
  { code: "SUF", city: "Lamezia Terme", country: "Italy", name: "Lamezia Terme Airport", lat: 38.9054, lon: 16.2423 },
  { code: "TSF", city: "Treviso", country: "Italy", name: "Treviso Airport", lat: 45.6484, lon: 12.1944 },
  { code: "OLB", city: "Olbia", country: "Italy", name: "Olbia Costa Smeralda Airport", lat: 40.8987, lon: 9.5176 },

  // --- Spain ---
  { code: "MAD", city: "Madrid", country: "Spain", name: "Adolfo Suarez Madrid-Barajas Airport", lat: 40.4719, lon: -3.5626 },
  { code: "BCN", city: "Barcelona", country: "Spain", name: "Barcelona-El Prat Airport", lat: 41.2974, lon: 2.0833 },
  { code: "PMI", city: "Palma de Mallorca", country: "Spain", name: "Palma de Mallorca Airport", lat: 39.5517, lon: 2.7388 },
  { code: "AGP", city: "Malaga", country: "Spain", name: "Malaga-Costa del Sol Airport", lat: 36.6749, lon: -4.4991 },
  { code: "ALC", city: "Alicante", country: "Spain", name: "Alicante-Elche Airport", lat: 38.2822, lon: -0.5582 },
  { code: "VLC", city: "Valencia", country: "Spain", name: "Valencia Airport", lat: 39.4893, lon: -0.4816 },
  { code: "IBZ", city: "Ibiza", country: "Spain", name: "Ibiza Airport", lat: 38.8729, lon: 1.3731 },
  { code: "SVQ", city: "Seville", country: "Spain", name: "Seville Airport", lat: 37.4180, lon: -5.8931 },
  { code: "BIO", city: "Bilbao", country: "Spain", name: "Bilbao Airport", lat: 43.3011, lon: -2.9106 },
  { code: "GRX", city: "Granada", country: "Spain", name: "Federico Garcia Lorca Airport", lat: 37.1887, lon: -3.7774 },
  { code: "TFN", city: "Tenerife", country: "Spain", name: "Tenerife North Airport", lat: 28.4827, lon: -16.3415 },
  { code: "TFS", city: "Tenerife", country: "Spain", name: "Tenerife South Airport", lat: 28.0445, lon: -16.5725 },
  { code: "LPA", city: "Gran Canaria", country: "Spain", name: "Gran Canaria Airport", lat: 27.9319, lon: -15.3866 },
  { code: "ACE", city: "Lanzarote", country: "Spain", name: "Lanzarote Airport", lat: 28.9455, lon: -13.6052 },
  { code: "FUE", city: "Fuerteventura", country: "Spain", name: "Fuerteventura Airport", lat: 28.4527, lon: -13.8638 },
  { code: "SCQ", city: "Santiago de Compostela", country: "Spain", name: "Santiago-Rosalía de Castro Airport", lat: 42.8963, lon: -8.4151 },
  { code: "LEI", city: "Almeria", country: "Spain", name: "Almeria Airport", lat: 36.8439, lon: -2.3701 },
  { code: "XRY", city: "Jerez", country: "Spain", name: "Jerez Airport", lat: 36.7446, lon: -6.0600 },
  { code: "MAH", city: "Menorca", country: "Spain", name: "Menorca Airport", lat: 39.8626, lon: 4.2186 },
  { code: "ZAZ", city: "Zaragoza", country: "Spain", name: "Zaragoza Airport", lat: 41.6662, lon: -1.0416 },
  { code: "OVD", city: "Asturias", country: "Spain", name: "Asturias Airport", lat: 43.5636, lon: -6.0346 },
  { code: "SDR", city: "Santander", country: "Spain", name: "Santander Airport", lat: 43.4271, lon: -3.8200 },
  { code: "VGO", city: "Vigo", country: "Spain", name: "Vigo-Peinador Airport", lat: 42.2318, lon: -8.6268 },
  { code: "EAS", city: "San Sebastian", country: "Spain", name: "San Sebastian Airport", lat: 43.3565, lon: -1.7906 },

  // --- Netherlands ---
  { code: "AMS", city: "Amsterdam", country: "Netherlands", name: "Amsterdam Airport Schiphol", lat: 52.3105, lon: 4.7683 },
  { code: "EIN", city: "Eindhoven", country: "Netherlands", name: "Eindhoven Airport", lat: 51.4501, lon: 5.3745 },
  { code: "RTM", city: "Rotterdam", country: "Netherlands", name: "Rotterdam The Hague Airport", lat: 51.9569, lon: 4.4372 },
  { code: "MST", city: "Maastricht", country: "Netherlands", name: "Maastricht Aachen Airport", lat: 50.9117, lon: 5.7701 },

  // --- Belgium ---
  { code: "BRU", city: "Brussels", country: "Belgium", name: "Brussels Airport", lat: 50.9014, lon: 4.4844 },
  { code: "CRL", city: "Charleroi", country: "Belgium", name: "Brussels South Charleroi Airport", lat: 50.4592, lon: 4.4538 },
  { code: "OST", city: "Ostend", country: "Belgium", name: "Ostend-Bruges Airport", lat: 51.1989, lon: 2.8622 },
  { code: "ANR", city: "Antwerp", country: "Belgium", name: "Antwerp International Airport", lat: 51.1894, lon: 4.4603 },
  { code: "LGG", city: "Liege", country: "Belgium", name: "Liege Airport", lat: 50.6374, lon: 5.4432 },

  // --- Switzerland ---
  { code: "ZRH", city: "Zurich", country: "Switzerland", name: "Zurich Airport", lat: 47.4582, lon: 8.5555 },
  { code: "GVA", city: "Geneva", country: "Switzerland", name: "Geneva Airport", lat: 46.2381, lon: 6.1089 },
  { code: "BSL", city: "Basel", country: "Switzerland", name: "EuroAirport Basel-Mulhouse-Freiburg", lat: 47.5896, lon: 7.5299 },
  { code: "BRN", city: "Bern", country: "Switzerland", name: "Bern Airport", lat: 46.9141, lon: 7.4971 },

  // --- Austria ---
  { code: "VIE", city: "Vienna", country: "Austria", name: "Vienna International Airport", lat: 48.1103, lon: 16.5697 },
  { code: "SZG", city: "Salzburg", country: "Austria", name: "Salzburg Airport", lat: 47.7933, lon: 13.0043 },
  { code: "GRZ", city: "Graz", country: "Austria", name: "Graz Airport", lat: 46.9911, lon: 15.4396 },
  { code: "INN", city: "Innsbruck", country: "Austria", name: "Innsbruck Airport", lat: 47.2602, lon: 11.3440 },
  { code: "LNZ", city: "Linz", country: "Austria", name: "Linz Airport", lat: 48.2332, lon: 14.1875 },
  { code: "KLU", city: "Klagenfurt", country: "Austria", name: "Klagenfurt Airport", lat: 46.6425, lon: 14.3377 },

  // --- Ireland ---
  { code: "DUB", city: "Dublin", country: "Ireland", name: "Dublin Airport", lat: 53.4264, lon: -6.2499 },
  { code: "ORK", city: "Cork", country: "Ireland", name: "Cork Airport", lat: 51.8413, lon: -8.4911 },
  { code: "SNN", city: "Shannon", country: "Ireland", name: "Shannon Airport", lat: 52.7020, lon: -8.9248 },
  { code: "NOC", city: "Knock", country: "Ireland", name: "Ireland West Airport Knock", lat: 53.9103, lon: -8.8185 },
  { code: "KIR", city: "Kerry", country: "Ireland", name: "Kerry Airport", lat: 52.1809, lon: -9.5238 },

  // --- Portugal ---
  { code: "LIS", city: "Lisbon", country: "Portugal", name: "Humberto Delgado Airport", lat: 38.7742, lon: -9.1342 },
  { code: "OPO", city: "Porto", country: "Portugal", name: "Francisco Sa Carneiro Airport", lat: 41.2378, lon: -8.6708 },
  { code: "FAO", city: "Faro", country: "Portugal", name: "Faro Airport", lat: 37.0144, lon: -7.9659 },
  { code: "FNC", city: "Madeira", country: "Portugal", name: "Cristiano Ronaldo International Airport", lat: 32.6979, lon: -16.7745 },
  { code: "PDL", city: "Ponta Delgada", country: "Portugal", name: "Joao Paulo II Airport", lat: 37.7412, lon: -25.6979 },

  // --- Greece ---
  { code: "ATH", city: "Athens", country: "Greece", name: "Athens International Airport", lat: 37.9364, lon: 23.9445 },
  { code: "SKG", city: "Thessaloniki", country: "Greece", name: "Thessaloniki Airport", lat: 40.5197, lon: 22.9709 },
  { code: "HER", city: "Heraklion", country: "Greece", name: "Heraklion International Airport", lat: 35.3397, lon: 25.1803 },
  { code: "RHO", city: "Rhodes", country: "Greece", name: "Rhodes International Airport", lat: 36.4054, lon: 28.0862 },
  { code: "CFU", city: "Corfu", country: "Greece", name: "Corfu International Airport", lat: 39.6019, lon: 19.9117 },
  { code: "CHQ", city: "Chania", country: "Greece", name: "Chania International Airport", lat: 35.5317, lon: 24.1497 },
  { code: "JMK", city: "Mykonos", country: "Greece", name: "Mykonos Airport", lat: 37.4351, lon: 25.3481 },
  { code: "JTR", city: "Santorini", country: "Greece", name: "Santorini Airport", lat: 36.3992, lon: 25.4793 },
  { code: "ZTH", city: "Zakynthos", country: "Greece", name: "Zakynthos International Airport", lat: 37.7509, lon: 20.8843 },
  { code: "KGS", city: "Kos", country: "Greece", name: "Kos Airport", lat: 36.7933, lon: 27.0917 },

  // --- Sweden ---
  { code: "ARN", city: "Stockholm", country: "Sweden", name: "Stockholm Arlanda Airport", lat: 59.6498, lon: 17.9238 },
  { code: "BMA", city: "Stockholm", country: "Sweden", name: "Stockholm Bromma Airport", lat: 59.3545, lon: 17.9412 },
  { code: "GOT", city: "Gothenburg", country: "Sweden", name: "Goteborg Landvetter Airport", lat: 57.6628, lon: 12.2798 },
  { code: "MMX", city: "Malmo", country: "Sweden", name: "Malmo Airport", lat: 55.5363, lon: 13.3762 },
  { code: "NYO", city: "Stockholm", country: "Sweden", name: "Stockholm Skavsta Airport", lat: 58.7886, lon: 16.9122 },
  { code: "LLA", city: "Lulea", country: "Sweden", name: "Lulea Airport", lat: 65.5438, lon: 22.1220 },
  { code: "UME", city: "Umea", country: "Sweden", name: "Umea Airport", lat: 63.7918, lon: 20.2828 },

  // --- Norway ---
  { code: "OSL", city: "Oslo", country: "Norway", name: "Oslo Gardermoen Airport", lat: 60.1976, lon: 11.1004 },
  { code: "TRF", city: "Oslo", country: "Norway", name: "Sandefjord Airport Torp", lat: 59.1867, lon: 10.2586 },
  { code: "BGO", city: "Bergen", country: "Norway", name: "Bergen Flesland Airport", lat: 60.2934, lon: 5.2181 },
  { code: "SVG", city: "Stavanger", country: "Norway", name: "Stavanger Airport Sola", lat: 58.8767, lon: 5.6378 },
  { code: "TRD", city: "Trondheim", country: "Norway", name: "Trondheim Airport Vaernes", lat: 63.4576, lon: 10.9242 },
  { code: "TOS", city: "Tromso", country: "Norway", name: "Tromso Airport", lat: 69.6832, lon: 18.9189 },
  { code: "BOO", city: "Bodo", country: "Norway", name: "Bodo Airport", lat: 67.2692, lon: 14.3653 },
  { code: "KRS", city: "Kristiansand", country: "Norway", name: "Kristiansand Airport", lat: 58.2042, lon: 8.0854 },

  // --- Denmark ---
  { code: "CPH", city: "Copenhagen", country: "Denmark", name: "Copenhagen Airport", lat: 55.6181, lon: 12.6562 },
  { code: "BLL", city: "Billund", country: "Denmark", name: "Billund Airport", lat: 55.7403, lon: 9.1518 },
  { code: "AAL", city: "Aalborg", country: "Denmark", name: "Aalborg Airport", lat: 57.0928, lon: 9.8492 },
  { code: "AAR", city: "Aarhus", country: "Denmark", name: "Aarhus Airport", lat: 56.3000, lon: 10.6190 },

  // --- Finland ---
  { code: "HEL", city: "Helsinki", country: "Finland", name: "Helsinki-Vantaa Airport", lat: 60.3183, lon: 24.9497 },
  { code: "TMP", city: "Tampere", country: "Finland", name: "Tampere-Pirkkala Airport", lat: 61.4141, lon: 23.6044 },
  { code: "TKU", city: "Turku", country: "Finland", name: "Turku Airport", lat: 60.5141, lon: 22.2628 },
  { code: "OUL", city: "Oulu", country: "Finland", name: "Oulu Airport", lat: 64.9301, lon: 25.3546 },
  { code: "RVN", city: "Rovaniemi", country: "Finland", name: "Rovaniemi Airport", lat: 66.5648, lon: 25.8304 },

  // --- Poland ---
  { code: "WAW", city: "Warsaw", country: "Poland", name: "Warsaw Chopin Airport", lat: 52.1657, lon: 20.9671 },
  { code: "KRK", city: "Krakow", country: "Poland", name: "Krakow John Paul II International Airport", lat: 50.0777, lon: 19.7848 },
  { code: "GDN", city: "Gdansk", country: "Poland", name: "Gdansk Lech Walesa Airport", lat: 54.3776, lon: 18.4662 },
  { code: "KTW", city: "Katowice", country: "Poland", name: "Katowice Airport", lat: 50.4743, lon: 19.0800 },
  { code: "WRO", city: "Wroclaw", country: "Poland", name: "Wroclaw Airport", lat: 51.1027, lon: 16.8858 },
  { code: "POZ", city: "Poznan", country: "Poland", name: "Poznan-Lawica Airport", lat: 52.4210, lon: 16.8263 },
  { code: "RZE", city: "Rzeszow", country: "Poland", name: "Rzeszow-Jasionka Airport", lat: 50.1100, lon: 22.0190 },
  { code: "WMI", city: "Warsaw", country: "Poland", name: "Warsaw Modlin Airport", lat: 52.4511, lon: 20.6518 },

  // --- Czech Republic ---
  { code: "PRG", city: "Prague", country: "Czech Republic", name: "Vaclav Havel Airport Prague", lat: 50.1008, lon: 14.2600 },
  { code: "BRQ", city: "Brno", country: "Czech Republic", name: "Brno-Turany Airport", lat: 49.1513, lon: 16.6944 },

  // --- Hungary ---
  { code: "BUD", city: "Budapest", country: "Hungary", name: "Budapest Ferenc Liszt International Airport", lat: 47.4291, lon: 19.2616 },

  // --- Romania ---
  { code: "OTP", city: "Bucharest", country: "Romania", name: "Henri Coanda International Airport", lat: 44.5712, lon: 26.0852 },
  { code: "CLJ", city: "Cluj-Napoca", country: "Romania", name: "Cluj-Napoca International Airport", lat: 46.7852, lon: 23.6862 },
  { code: "TSR", city: "Timisoara", country: "Romania", name: "Traian Vuia International Airport", lat: 45.8099, lon: 21.3379 },

  // --- Bulgaria ---
  { code: "SOF", city: "Sofia", country: "Bulgaria", name: "Sofia Airport", lat: 42.6952, lon: 23.4084 },
  { code: "BOJ", city: "Burgas", country: "Bulgaria", name: "Burgas Airport", lat: 42.5696, lon: 27.5152 },
  { code: "VAR", city: "Varna", country: "Bulgaria", name: "Varna Airport", lat: 43.2321, lon: 27.8251 },

  // --- Croatia ---
  { code: "ZAG", city: "Zagreb", country: "Croatia", name: "Zagreb Airport", lat: 45.7438, lon: 16.0688 },
  { code: "SPU", city: "Split", country: "Croatia", name: "Split Airport", lat: 43.5389, lon: 16.2980 },
  { code: "DBV", city: "Dubrovnik", country: "Croatia", name: "Dubrovnik Airport", lat: 42.5614, lon: 18.2682 },
  { code: "ZAD", city: "Zadar", country: "Croatia", name: "Zadar Airport", lat: 44.1083, lon: 15.3467 },
  { code: "PUY", city: "Pula", country: "Croatia", name: "Pula Airport", lat: 44.8935, lon: 13.9222 },

  // --- Ukraine ---
  { code: "KBP", city: "Kyiv", country: "Ukraine", name: "Boryspil International Airport", lat: 50.3450, lon: 30.8947 },
  { code: "LWO", city: "Lviv", country: "Ukraine", name: "Lviv Danylo Halytskyi International Airport", lat: 49.8125, lon: 23.9561 },
  { code: "ODS", city: "Odesa", country: "Ukraine", name: "Odesa International Airport", lat: 46.4268, lon: 30.6765 },

  // --- Russia ---
  { code: "SVO", city: "Moscow", country: "Russia", name: "Sheremetyevo International Airport", lat: 55.9726, lon: 37.4146 },
  { code: "DME", city: "Moscow", country: "Russia", name: "Domodedovo Airport", lat: 55.4088, lon: 37.9063 },
  { code: "VKO", city: "Moscow", country: "Russia", name: "Vnukovo International Airport", lat: 55.5915, lon: 37.2615 },
  { code: "LED", city: "Saint Petersburg", country: "Russia", name: "Pulkovo Airport", lat: 59.8003, lon: 30.2625 },
  { code: "KZN", city: "Kazan", country: "Russia", name: "Kazan International Airport", lat: 55.6062, lon: 49.2787 },
  { code: "OVB", city: "Novosibirsk", country: "Russia", name: "Tolmachevo Airport", lat: 55.0126, lon: 82.6507 },
  { code: "SVX", city: "Yekaterinburg", country: "Russia", name: "Koltsovo Airport", lat: 56.7431, lon: 60.8027 },
  { code: "AER", city: "Sochi", country: "Russia", name: "Sochi International Airport", lat: 43.4499, lon: 39.9566 },

  // ==================== North America ====================
  // --- USA - Major Hubs ---
  { code: "JFK", city: "New York", country: "USA", name: "John F. Kennedy International Airport", lat: 40.6413, lon: -73.7781 },
  { code: "EWR", city: "New York", country: "USA", name: "Newark Liberty International Airport", lat: 40.6895, lon: -74.1745 },
  { code: "LGA", city: "New York", country: "USA", name: "LaGuardia Airport", lat: 40.7772, lon: -73.8726 },
  { code: "LAX", city: "Los Angeles", country: "USA", name: "Los Angeles International Airport", lat: 33.9416, lon: -118.4085 },
  { code: "SFO", city: "San Francisco", country: "USA", name: "San Francisco International Airport", lat: 37.6213, lon: -122.3790 },
  { code: "ORD", city: "Chicago", country: "USA", name: "O'Hare International Airport", lat: 41.9742, lon: -87.9073 },
  { code: "MDW", city: "Chicago", country: "USA", name: "Chicago Midway International Airport", lat: 41.7860, lon: -87.7524 },
  { code: "DFW", city: "Dallas", country: "USA", name: "Dallas/Fort Worth International Airport", lat: 32.8998, lon: -97.0403 },
  { code: "DAL", city: "Dallas", country: "USA", name: "Dallas Love Field", lat: 32.8471, lon: -96.8518 },
  { code: "IAH", city: "Houston", country: "USA", name: "George Bush Intercontinental Airport", lat: 29.9902, lon: -95.3368 },
  { code: "HOU", city: "Houston", country: "USA", name: "William P. Hobby Airport", lat: 29.6454, lon: -95.2770 },
  { code: "MIA", city: "Miami", country: "USA", name: "Miami International Airport", lat: 25.7959, lon: -80.2870 },
  { code: "FLL", city: "Fort Lauderdale", country: "USA", name: "Fort Lauderdale-Hollywood International Airport", lat: 26.0742, lon: -80.1506 },
  { code: "ATL", city: "Atlanta", country: "USA", name: "Hartsfield-Jackson Atlanta International Airport", lat: 33.6407, lon: -84.4277 },
  { code: "BOS", city: "Boston", country: "USA", name: "Logan International Airport", lat: 42.3656, lon: -71.0096 },
  { code: "SEA", city: "Seattle", country: "USA", name: "Seattle-Tacoma International Airport", lat: 47.4502, lon: -122.3088 },
  { code: "MCO", city: "Orlando", country: "USA", name: "Orlando International Airport", lat: 28.4312, lon: -81.3081 },
  { code: "LAS", city: "Las Vegas", country: "USA", name: "Harry Reid International Airport", lat: 36.0840, lon: -115.1537 },
  { code: "PHX", city: "Phoenix", country: "USA", name: "Phoenix Sky Harbor International Airport", lat: 33.4353, lon: -112.0098 },
  { code: "DEN", city: "Denver", country: "USA", name: "Denver International Airport", lat: 39.8561, lon: -104.6733 },
  { code: "MSP", city: "Minneapolis", country: "USA", name: "Minneapolis-Saint Paul International Airport", lat: 44.8820, lon: -93.2218 },
  { code: "DTW", city: "Detroit", country: "USA", name: "Detroit Metropolitan Airport", lat: 42.2124, lon: -83.3534 },
  { code: "CLT", city: "Charlotte", country: "USA", name: "Charlotte Douglas International Airport", lat: 35.2140, lon: -80.9431 },
  { code: "PHL", city: "Philadelphia", country: "USA", name: "Philadelphia International Airport", lat: 39.8744, lon: -75.2424 },
  { code: "DCA", city: "Washington DC", country: "USA", name: "Ronald Reagan Washington National Airport", lat: 38.8521, lon: -77.0377 },
  { code: "IAD", city: "Washington DC", country: "USA", name: "Washington Dulles International Airport", lat: 38.9445, lon: -77.4558 },
  { code: "BWI", city: "Baltimore", country: "USA", name: "Baltimore/Washington International Airport", lat: 39.1774, lon: -76.6684 },
  { code: "SAN", city: "San Diego", country: "USA", name: "San Diego International Airport", lat: 32.7338, lon: -117.1933 },
  { code: "TPA", city: "Tampa", country: "USA", name: "Tampa International Airport", lat: 27.9755, lon: -82.5332 },
  { code: "PDX", city: "Portland", country: "USA", name: "Portland International Airport", lat: 45.5887, lon: -122.5975 },
  { code: "STL", city: "St Louis", country: "USA", name: "St. Louis Lambert International Airport", lat: 38.7477, lon: -90.3601 },

  // --- USA - Other Major Airports ---
  { code: "SLC", city: "Salt Lake City", country: "USA", name: "Salt Lake City International Airport", lat: 40.7899, lon: -111.9792 },
  { code: "AUS", city: "Austin", country: "USA", name: "Austin-Bergstrom International Airport", lat: 30.1945, lon: -97.6699 },
  { code: "BNA", city: "Nashville", country: "USA", name: "Nashville International Airport", lat: 36.1263, lon: -86.6774 },
  { code: "CLE", city: "Cleveland", country: "USA", name: "Cleveland Hopkins International Airport", lat: 41.4094, lon: -81.8547 },
  { code: "CMH", city: "Columbus", country: "USA", name: "John Glenn Columbus International Airport", lat: 39.9980, lon: -82.8919 },
  { code: "CVG", city: "Cincinnati", country: "USA", name: "Cincinnati/Northern Kentucky International Airport", lat: 39.0461, lon: -84.6622 },
  { code: "IND", city: "Indianapolis", country: "USA", name: "Indianapolis International Airport", lat: 39.7173, lon: -86.2944 },
  { code: "MCI", city: "Kansas City", country: "USA", name: "Kansas City International Airport", lat: 39.2976, lon: -94.7139 },
  { code: "MKE", city: "Milwaukee", country: "USA", name: "Milwaukee Mitchell International Airport", lat: 42.9472, lon: -87.8966 },
  { code: "MSY", city: "New Orleans", country: "USA", name: "Louis Armstrong New Orleans International Airport", lat: 29.9934, lon: -90.2580 },
  { code: "OAK", city: "Oakland", country: "USA", name: "Oakland International Airport", lat: 37.7213, lon: -122.2208 },
  { code: "ONT", city: "Ontario", country: "USA", name: "Ontario International Airport", lat: 34.0560, lon: -117.6012 },
  { code: "PIT", city: "Pittsburgh", country: "USA", name: "Pittsburgh International Airport", lat: 40.4915, lon: -80.2329 },
  { code: "RDU", city: "Raleigh-Durham", country: "USA", name: "Raleigh-Durham International Airport", lat: 35.8776, lon: -78.7875 },
  { code: "RSW", city: "Fort Myers", country: "USA", name: "Southwest Florida International Airport", lat: 26.5362, lon: -81.7552 },
  { code: "SAT", city: "San Antonio", country: "USA", name: "San Antonio International Airport", lat: 29.5337, lon: -98.4698 },
  { code: "SJC", city: "San Jose", country: "USA", name: "Norman Y. Mineta San Jose International Airport", lat: 37.3639, lon: -121.9289 },
  { code: "SMF", city: "Sacramento", country: "USA", name: "Sacramento International Airport", lat: 38.6954, lon: -121.5908 },
  { code: "SNA", city: "Santa Ana", country: "USA", name: "John Wayne Airport", lat: 33.6757, lon: -117.8682 },
  { code: "OGG", city: "Kahului", country: "USA", name: "Kahului Airport", lat: 20.8986, lon: -156.4307 },
  { code: "HNL", city: "Honolulu", country: "USA", name: "Daniel K. Inouye International Airport", lat: 21.3187, lon: -157.9224 },
  { code: "ANC", city: "Anchorage", country: "USA", name: "Ted Stevens Anchorage International Airport", lat: 61.1743, lon: -149.9962 },
  { code: "JAX", city: "Jacksonville", country: "USA", name: "Jacksonville International Airport", lat: 30.4941, lon: -81.6879 },
  { code: "PBI", city: "West Palm Beach", country: "USA", name: "Palm Beach International Airport", lat: 26.6832, lon: -80.0956 },
  { code: "BUF", city: "Buffalo", country: "USA", name: "Buffalo Niagara International Airport", lat: 42.9405, lon: -78.7322 },
  { code: "RIC", city: "Richmond", country: "USA", name: "Richmond International Airport", lat: 37.5052, lon: -77.3197 },
  { code: "MEM", city: "Memphis", country: "USA", name: "Memphis International Airport", lat: 35.0424, lon: -89.9767 },
  { code: "SDF", city: "Louisville", country: "USA", name: "Louisville Muhammad Ali International Airport", lat: 38.1744, lon: -85.7360 },
  { code: "OKC", city: "Oklahoma City", country: "USA", name: "Will Rogers World Airport", lat: 35.3931, lon: -97.6007 },
  { code: "OMA", city: "Omaha", country: "USA", name: "Eppley Airfield", lat: 41.3026, lon: -95.8941 },
  { code: "TUS", city: "Tucson", country: "USA", name: "Tucson International Airport", lat: 32.1161, lon: -110.9410 },
  { code: "ABQ", city: "Albuquerque", country: "USA", name: "Albuquerque International Sunport", lat: 35.0402, lon: -106.6091 },
  { code: "BOI", city: "Boise", country: "USA", name: "Boise Airport", lat: 43.5644, lon: -116.2228 },
  { code: "RNO", city: "Reno", country: "USA", name: "Reno-Tahoe International Airport", lat: 39.4991, lon: -119.7681 },
  { code: "ELP", city: "El Paso", country: "USA", name: "El Paso International Airport", lat: 31.8067, lon: -106.3778 },
  { code: "PVD", city: "Providence", country: "USA", name: "Rhode Island T.F. Green International Airport", lat: 41.7240, lon: -71.4282 },
  { code: "BDL", city: "Hartford", country: "USA", name: "Bradley International Airport", lat: 41.9389, lon: -72.6832 },
  { code: "CHS", city: "Charleston", country: "USA", name: "Charleston International Airport", lat: 32.8986, lon: -80.0405 },
  { code: "GEG", city: "Spokane", country: "USA", name: "Spokane International Airport", lat: 47.6199, lon: -117.5340 },
  { code: "SAV", city: "Savannah", country: "USA", name: "Savannah/Hilton Head International Airport", lat: 32.1276, lon: -81.2021 },
  { code: "BUR", city: "Burbank", country: "USA", name: "Hollywood Burbank Airport", lat: 34.2007, lon: -118.3587 },
  { code: "LGB", city: "Long Beach", country: "USA", name: "Long Beach Airport", lat: 33.8177, lon: -118.1516 },
  { code: "SJC", city: "San Jose", country: "USA", name: "Norman Y. Mineta San Jose International Airport", lat: 37.3639, lon: -121.9289 },
  { code: "KOA", city: "Kailua-Kona", country: "USA", name: "Ellison Onizuka Kona International Airport", lat: 19.7388, lon: -156.0456 },

  // --- Canada ---
  { code: "YYZ", city: "Toronto", country: "Canada", name: "Toronto Pearson International Airport", lat: 43.6777, lon: -79.6248 },
  { code: "YUL", city: "Montreal", country: "Canada", name: "Montreal-Pierre Elliott Trudeau International Airport", lat: 45.4706, lon: -73.7408 },
  { code: "YVR", city: "Vancouver", country: "Canada", name: "Vancouver International Airport", lat: 49.1947, lon: -123.1839 },
  { code: "YYC", city: "Calgary", country: "Canada", name: "Calgary International Airport", lat: 51.1138, lon: -114.0203 },
  { code: "YEG", city: "Edmonton", country: "Canada", name: "Edmonton International Airport", lat: 53.3097, lon: -113.5797 },
  { code: "YOW", city: "Ottawa", country: "Canada", name: "Ottawa Macdonald-Cartier International Airport", lat: 45.3225, lon: -75.6691 },
  { code: "YHZ", city: "Halifax", country: "Canada", name: "Halifax Stanfield International Airport", lat: 44.8808, lon: -63.5086 },
  { code: "YWG", city: "Winnipeg", country: "Canada", name: "Winnipeg James Armstrong Richardson International Airport", lat: 49.9100, lon: -97.2399 },
  { code: "YQB", city: "Quebec City", country: "Canada", name: "Quebec City Jean Lesage International Airport", lat: 46.7911, lon: -71.3933 },
  { code: "YQR", city: "Regina", country: "Canada", name: "Regina International Airport", lat: 50.4319, lon: -104.6657 },
  { code: "YXE", city: "Saskatoon", country: "Canada", name: "Saskatoon John G. Diefenbaker International Airport", lat: 52.1708, lon: -106.6997 },
  { code: "YYT", city: "St. John's", country: "Canada", name: "St. John's International Airport", lat: 47.6186, lon: -52.7520 },
  { code: "YFC", city: "Fredericton", country: "Canada", name: "Fredericton International Airport", lat: 45.8689, lon: -66.5372 },
  { code: "YQT", city: "Thunder Bay", country: "Canada", name: "Thunder Bay International Airport", lat: 48.3719, lon: -89.3233 },
  { code: "YYJ", city: "Victoria", country: "Canada", name: "Victoria International Airport", lat: 48.6469, lon: -123.4258 },
  { code: "YHM", city: "Hamilton", country: "Canada", name: "John C. Munro Hamilton International Airport", lat: 43.1736, lon: -79.9350 },
  { code: "YLW", city: "Kelowna", country: "Canada", name: "Kelowna International Airport", lat: 49.9561, lon: -119.3770 },
  { code: "YTZ", city: "Toronto", country: "Canada", name: "Billy Bishop Toronto City Airport", lat: 43.6275, lon: -79.3962 },

  // --- Mexico ---
  { code: "MEX", city: "Mexico City", country: "Mexico", name: "Benito Juarez International Airport", lat: 19.4363, lon: -99.0721 },
  { code: "CUN", city: "Cancun", country: "Mexico", name: "Cancun International Airport", lat: 21.0365, lon: -86.8771 },
  { code: "GDL", city: "Guadalajara", country: "Mexico", name: "Guadalajara International Airport", lat: 20.5218, lon: -103.3112 },
  { code: "MTY", city: "Monterrey", country: "Mexico", name: "Monterrey International Airport", lat: 25.7785, lon: -100.1070 },
  { code: "TIJ", city: "Tijuana", country: "Mexico", name: "Tijuana International Airport", lat: 32.5411, lon: -116.9701 },
  { code: "SJD", city: "San Jose del Cabo", country: "Mexico", name: "Los Cabos International Airport", lat: 23.1518, lon: -109.7210 },
  { code: "PVR", city: "Puerto Vallarta", country: "Mexico", name: "Licenciado Gustavo Diaz Ordaz International Airport", lat: 20.6801, lon: -105.2540 },
  { code: "MID", city: "Merida", country: "Mexico", name: "Manuel Crescencio Rejon International Airport", lat: 20.9370, lon: -89.6577 },
  { code: "BJX", city: "Leon", country: "Mexico", name: "Del Bajio International Airport", lat: 20.9935, lon: -101.4810 },

  // ==================== South America ====================
  // --- Brazil ---
  { code: "GRU", city: "Sao Paulo", country: "Brazil", name: "Sao Paulo-Guarulhos International Airport", lat: -23.4344, lon: -46.4736 },
  { code: "CGH", city: "Sao Paulo", country: "Brazil", name: "Sao Paulo-Congonhas Airport", lat: -23.6261, lon: -46.6564 },
  { code: "GIG", city: "Rio de Janeiro", country: "Brazil", name: "Rio de Janeiro-Galeao International Airport", lat: -22.8100, lon: -43.2506 },
  { code: "SDU", city: "Rio de Janeiro", country: "Brazil", name: "Santos Dumont Airport", lat: -22.9105, lon: -43.1631 },
  { code: "BSB", city: "Brasilia", country: "Brazil", name: "Brasilia International Airport", lat: -15.8711, lon: -47.9186 },
  { code: "CNF", city: "Belo Horizonte", country: "Brazil", name: "Tancredo Neves International Airport", lat: -19.6338, lon: -43.9689 },
  { code: "SSA", city: "Salvador", country: "Brazil", name: "Salvador International Airport", lat: -12.9086, lon: -38.3225 },
  { code: "REC", city: "Recife", country: "Brazil", name: "Recife/Guararapes-Gilberto Freyre International Airport", lat: -8.1266, lon: -34.9236 },
  { code: "FOR", city: "Fortaleza", country: "Brazil", name: "Pinto Martins International Airport", lat: -3.7763, lon: -38.5326 },
  { code: "POA", city: "Porto Alegre", country: "Brazil", name: "Salgado Filho International Airport", lat: -29.9939, lon: -51.1711 },
  { code: "CWB", city: "Curitiba", country: "Brazil", name: "Afonso Pena International Airport", lat: -25.5285, lon: -49.1758 },
  { code: "FLN", city: "Florianopolis", country: "Brazil", name: "Hercilio Luz International Airport", lat: -27.6704, lon: -48.5472 },
  { code: "MAO", city: "Manaus", country: "Brazil", name: "Eduardo Gomes International Airport", lat: -3.0386, lon: -60.0497 },
  { code: "BEL", city: "Belem", country: "Brazil", name: "Val de Cans International Airport", lat: -1.3793, lon: -48.4763 },
  { code: "NAT", city: "Natal", country: "Brazil", name: "Greater Natal International Airport", lat: -5.7680, lon: -35.3761 },
  { code: "VIX", city: "Vitoria", country: "Brazil", name: "Eurico de Aguiar Salles Airport", lat: -20.2581, lon: -40.2864 },
  { code: "GYN", city: "Goiania", country: "Brazil", name: "Santa Genoveva Airport", lat: -16.6320, lon: -49.2207 },
  { code: "CGB", city: "Cuiaba", country: "Brazil", name: "Marechal Rondon International Airport", lat: -15.6529, lon: -56.1167 },
  { code: "IGU", city: "Foz do Iguacu", country: "Brazil", name: "Foz do Iguacu International Airport", lat: -25.5961, lon: -54.4875 },

  // --- Argentina ---
  { code: "EZE", city: "Buenos Aires", country: "Argentina", name: "Ministro Pistarini International Airport", lat: -34.8222, lon: -58.5358 },
  { code: "AEP", city: "Buenos Aires", country: "Argentina", name: "Aeroparque Jorge Newbery", lat: -34.5598, lon: -58.4156 },
  { code: "COR", city: "Cordoba", country: "Argentina", name: "Ingeniero Aeronautico Ambrosio L.V. Taravella Airport", lat: -31.3236, lon: -64.2080 },
  { code: "MDZ", city: "Mendoza", country: "Argentina", name: "Governor Francisco Gabrielli Airport", lat: -32.8317, lon: -68.7929 },
  { code: "ROS", city: "Rosario", country: "Argentina", name: "Rosario Islas Malvinas International Airport", lat: -32.9036, lon: -60.7844 },
  { code: "BRC", city: "Bariloche", country: "Argentina", name: "San Carlos de Bariloche Airport", lat: -41.1512, lon: -71.1575 },
  { code: "USH", city: "Ushuaia", country: "Argentina", name: "Malvinas Argentinas International Airport", lat: -54.8433, lon: -68.2958 },

  // --- Colombia ---
  { code: "BOG", city: "Bogota", country: "Colombia", name: "El Dorado International Airport", lat: 4.7016, lon: -74.1469 },
  { code: "MDE", city: "Medellin", country: "Colombia", name: "Jose Maria Cordova International Airport", lat: 6.1645, lon: -75.4231 },
  { code: "CLO", city: "Cali", country: "Colombia", name: "Alfonso Bonilla Aragon International Airport", lat: 3.5432, lon: -76.3816 },
  { code: "CTG", city: "Cartagena", country: "Colombia", name: "Rafael Nunez International Airport", lat: 10.4424, lon: -75.5130 },
  { code: "BAQ", city: "Barranquilla", country: "Colombia", name: "Ernesto Cortissoz International Airport", lat: 10.8896, lon: -74.7808 },

  // --- Peru ---
  { code: "LIM", city: "Lima", country: "Peru", name: "Jorge Chavez International Airport", lat: -12.0219, lon: -77.1143 },
  { code: "CUZ", city: "Cusco", country: "Peru", name: "Alejandro Velasco Astete International Airport", lat: -13.5357, lon: -71.9388 },

  // --- Chile ---
  { code: "SCL", city: "Santiago", country: "Chile", name: "Arturo Merino Benitez Airport", lat: -33.3930, lon: -70.7858 },

  // --- Venezuela ---
  { code: "CCS", city: "Caracas", country: "Venezuela", name: "Simon Bolivar International Airport", lat: 10.6031, lon: -66.9905 },

  // --- Ecuador ---
  { code: "UIO", city: "Quito", country: "Ecuador", name: "Mariscal Sucre International Airport", lat: -0.1292, lon: -78.3575 },
  { code: "GYE", city: "Guayaquil", country: "Ecuador", name: "Jose Joaquin de Olmedo International Airport", lat: -2.1575, lon: -79.8836 },

  // --- Panama ---
  { code: "PTY", city: "Panama City", country: "Panama", name: "Tocumen International Airport", lat: 9.0714, lon: -79.3835 },

  // --- Costa Rica ---
  { code: "SJO", city: "San Jose", country: "Costa Rica", name: "Juan Santamaria International Airport", lat: 9.9939, lon: -84.2088 },

  // --- Uruguay ---
  { code: "MVD", city: "Montevideo", country: "Uruguay", name: "Carrasco International Airport", lat: -34.8384, lon: -56.0308 },

  // --- Bolivia ---
  { code: "LPB", city: "La Paz", country: "Bolivia", name: "El Alto International Airport", lat: -16.5133, lon: -68.1923 },
  { code: "VVI", city: "Santa Cruz", country: "Bolivia", name: "Viru Viru International Airport", lat: -17.6448, lon: -63.1354 },

  // --- Paraguay ---
  { code: "ASU", city: "Asuncion", country: "Paraguay", name: "Silvio Pettirossi International Airport", lat: -25.2399, lon: -57.5191 },

  // ==================== Africa ====================
  // --- South Africa ---
  { code: "JNB", city: "Johannesburg", country: "South Africa", name: "O.R. Tambo International Airport", lat: -26.1367, lon: 28.2415 },
  { code: "CPT", city: "Cape Town", country: "South Africa", name: "Cape Town International Airport", lat: -33.9715, lon: 18.6021 },
  { code: "DUR", city: "Durban", country: "South Africa", name: "King Shaka International Airport", lat: -29.6144, lon: 31.1194 },
  { code: "PLZ", city: "Port Elizabeth", country: "South Africa", name: "Chief Dawid Stuurman International Airport", lat: -33.9849, lon: 25.6173 },
  { code: "ELS", city: "East London", country: "South Africa", name: "East London Airport", lat: -33.0356, lon: 27.8259 },
  { code: "GRJ", city: "George", country: "South Africa", name: "George Airport", lat: -34.0056, lon: 22.3789 },
  { code: "BFN", city: "Bloemfontein", country: "South Africa", name: "Bram Fischer International Airport", lat: -29.0927, lon: 26.3024 },
  { code: "NLP", city: "Mbombela", country: "South Africa", name: "Kruger Mpumalanga International Airport", lat: -25.3834, lon: 31.1056 },
  { code: "HLA", city: "Johannesburg", country: "South Africa", name: "Lanseria International Airport", lat: -25.9385, lon: 27.9261 },

  // --- Kenya ---
  { code: "NBO", city: "Nairobi", country: "Kenya", name: "Jomo Kenyatta International Airport", lat: -1.3192, lon: 36.9278 },
  { code: "MBA", city: "Mombasa", country: "Kenya", name: "Moi International Airport", lat: -4.0348, lon: 39.5942 },
  { code: "KIS", city: "Kisumu", country: "Kenya", name: "Kisumu International Airport", lat: -0.0861, lon: 34.7289 },
  { code: "EDL", city: "Eldoret", country: "Kenya", name: "Eldoret International Airport", lat: 0.4045, lon: 35.2389 },
  { code: "WIL", city: "Nairobi", country: "Kenya", name: "Wilson Airport", lat: -1.3217, lon: 36.8147 },

  // --- Egypt ---
  { code: "CAI", city: "Cairo", country: "Egypt", name: "Cairo International Airport", lat: 30.1219, lon: 31.4056 },
  { code: "HRG", city: "Hurghada", country: "Egypt", name: "Hurghada International Airport", lat: 27.1783, lon: 33.7994 },
  { code: "SSH", city: "Sharm El Sheikh", country: "Egypt", name: "Sharm El Sheikh International Airport", lat: 27.9773, lon: 34.3950 },
  { code: "LXR", city: "Luxor", country: "Egypt", name: "Luxor International Airport", lat: 25.6710, lon: 32.7066 },
  { code: "HBE", city: "Alexandria", country: "Egypt", name: "Borg El Arab International Airport", lat: 30.9177, lon: 29.6964 },
  { code: "ASW", city: "Aswan", country: "Egypt", name: "Aswan International Airport", lat: 23.9644, lon: 32.8200 },
  { code: "RMF", city: "Marsa Alam", country: "Egypt", name: "Marsa Alam International Airport", lat: 25.5571, lon: 34.5837 },

  // --- Morocco ---
  { code: "CMN", city: "Casablanca", country: "Morocco", name: "Mohammed V International Airport", lat: 33.3675, lon: -7.5899 },
  { code: "RAK", city: "Marrakech", country: "Morocco", name: "Marrakesh Menara Airport", lat: 31.6069, lon: -8.0363 },
  { code: "AGA", city: "Agadir", country: "Morocco", name: "Agadir-Al Massira Airport", lat: 30.3250, lon: -9.4131 },
  { code: "FEZ", city: "Fes", country: "Morocco", name: "Fes-Saiss Airport", lat: 33.9273, lon: -4.9780 },
  { code: "TNG", city: "Tangier", country: "Morocco", name: "Tangier Ibn Battouta Airport", lat: 35.7269, lon: -5.9169 },
  { code: "OUD", city: "Oujda", country: "Morocco", name: "Angads Airport", lat: 34.7872, lon: -1.9250 },
  { code: "RBA", city: "Rabat", country: "Morocco", name: "Rabat-Sale Airport", lat: 34.0515, lon: -6.7515 },

  // --- Ethiopia ---
  { code: "ADD", city: "Addis Ababa", country: "Ethiopia", name: "Addis Ababa Bole International Airport", lat: 8.9779, lon: 38.7993 },

  // --- Nigeria ---
  { code: "LOS", city: "Lagos", country: "Nigeria", name: "Murtala Muhammed International Airport", lat: 6.5774, lon: 3.3210 },
  { code: "ABV", city: "Abuja", country: "Nigeria", name: "Nnamdi Azikiwe International Airport", lat: 9.0068, lon: 7.2632 },
  { code: "PHC", city: "Port Harcourt", country: "Nigeria", name: "Port Harcourt International Airport", lat: 5.0155, lon: 6.9496 },
  { code: "KAN", city: "Kano", country: "Nigeria", name: "Mallam Aminu Kano International Airport", lat: 12.0476, lon: 8.5246 },

  // --- Ghana ---
  { code: "ACC", city: "Accra", country: "Ghana", name: "Kotoka International Airport", lat: 5.6052, lon: -0.1668 },

  // --- Tanzania ---
  { code: "DAR", city: "Dar es Salaam", country: "Tanzania", name: "Julius Nyerere International Airport", lat: -6.8781, lon: 39.2026 },
  { code: "ZNZ", city: "Zanzibar", country: "Tanzania", name: "Abeid Amani Karume International Airport", lat: -6.2220, lon: 39.2249 },
  { code: "JRO", city: "Kilimanjaro", country: "Tanzania", name: "Kilimanjaro International Airport", lat: -3.4294, lon: 37.0745 },

  // --- Mauritius ---
  { code: "MRU", city: "Port Louis", country: "Mauritius", name: "Sir Seewoosagur Ramgoolam International Airport", lat: -20.4302, lon: 57.6836 },

  // --- Seychelles ---
  { code: "SEZ", city: "Mahe", country: "Seychelles", name: "Seychelles International Airport", lat: -4.6743, lon: 55.5218 },

  // --- Tunisia ---
  { code: "TUN", city: "Tunis", country: "Tunisia", name: "Tunis-Carthage International Airport", lat: 36.8510, lon: 10.2272 },
  { code: "DJE", city: "Djerba", country: "Tunisia", name: "Djerba-Zarzis International Airport", lat: 33.8750, lon: 10.7755 },
  { code: "NBE", city: "Enfidha", country: "Tunisia", name: "Enfidha-Hammamet International Airport", lat: 36.0758, lon: 10.4386 },

  // --- Algeria ---
  { code: "ALG", city: "Algiers", country: "Algeria", name: "Houari Boumediene Airport", lat: 36.6942, lon: 3.2152 },
  { code: "ORN", city: "Oran", country: "Algeria", name: "Ahmed Ben Bella Airport", lat: 35.6239, lon: -0.6212 },

  // --- Uganda ---
  { code: "EBB", city: "Entebbe", country: "Uganda", name: "Entebbe International Airport", lat: 0.0424, lon: 32.4435 },

  // --- Rwanda ---
  { code: "KGL", city: "Kigali", country: "Rwanda", name: "Kigali International Airport", lat: -1.9686, lon: 30.1395 },

  // --- Senegal ---
  { code: "DSS", city: "Dakar", country: "Senegal", name: "Blaise Diagne International Airport", lat: 14.6705, lon: -17.0733 },

  // --- Ivory Coast ---
  { code: "ABJ", city: "Abidjan", country: "Ivory Coast", name: "Felix Houphouet Boigny International Airport", lat: 5.2614, lon: -3.9263 },

  // --- Sudan ---
  { code: "KRT", city: "Khartoum", country: "Sudan", name: "Khartoum International Airport", lat: 15.5895, lon: 32.5532 },

  // --- Libya ---
  { code: "MJI", city: "Tripoli", country: "Libya", name: "Mitiga International Airport", lat: 32.8941, lon: 13.2760 },

  // --- Zambia ---
  { code: "LUN", city: "Lusaka", country: "Zambia", name: "Kenneth Kaunda International Airport", lat: -15.3308, lon: 28.4526 },

  // --- Zimbabwe ---
  { code: "HRE", city: "Harare", country: "Zimbabwe", name: "Robert Gabriel Mugabe International Airport", lat: -17.9318, lon: 31.0928 },
  { code: "VFA", city: "Victoria Falls", country: "Zimbabwe", name: "Victoria Falls Airport", lat: -18.0959, lon: 25.8390 },

  // --- Angola ---
  { code: "LAD", city: "Luanda", country: "Angola", name: "Quatro de Fevereiro Airport", lat: -8.8584, lon: 13.2312 },

  // --- Mozambique ---
  { code: "MPM", city: "Maputo", country: "Mozambique", name: "Maputo International Airport", lat: -25.9208, lon: 32.5726 },

  // --- Namibia ---
  { code: "WDH", city: "Windhoek", country: "Namibia", name: "Hosea Kutako International Airport", lat: -22.4799, lon: 17.4709 },

  // --- Botswana ---
  { code: "GBE", city: "Gaborone", country: "Botswana", name: "Sir Seretse Khama International Airport", lat: -24.5552, lon: 25.9182 },

  // --- Madagascar ---
  { code: "TNR", city: "Antananarivo", country: "Madagascar", name: "Ivato International Airport", lat: -18.7969, lon: 47.4788 },

  // --- Cameroon ---
  { code: "DLA", city: "Douala", country: "Cameroon", name: "Douala International Airport", lat: 4.0061, lon: 9.7195 },
  { code: "NSI", city: "Yaounde", country: "Cameroon", name: "Yaounde Nsimalen International Airport", lat: 3.7226, lon: 11.5533 },

  // ==================== Oceania ====================
  // --- Australia ---
  { code: "SYD", city: "Sydney", country: "Australia", name: "Sydney Kingsford Smith Airport", lat: -33.9399, lon: 151.1753 },
  { code: "MEL", city: "Melbourne", country: "Australia", name: "Melbourne Airport", lat: -37.6690, lon: 144.8410 },
  { code: "BNE", city: "Brisbane", country: "Australia", name: "Brisbane Airport", lat: -27.3842, lon: 153.1175 },
  { code: "PER", city: "Perth", country: "Australia", name: "Perth Airport", lat: -31.9403, lon: 115.9669 },
  { code: "ADL", city: "Adelaide", country: "Australia", name: "Adelaide Airport", lat: -34.9461, lon: 138.5310 },
  { code: "OOL", city: "Gold Coast", country: "Australia", name: "Gold Coast Airport", lat: -28.1644, lon: 153.5047 },
  { code: "CNS", city: "Cairns", country: "Australia", name: "Cairns Airport", lat: -16.8858, lon: 145.7552 },
  { code: "DRW", city: "Darwin", country: "Australia", name: "Darwin International Airport", lat: -12.4147, lon: 130.8767 },
  { code: "CBR", city: "Canberra", country: "Australia", name: "Canberra Airport", lat: -35.3069, lon: 149.1950 },
  { code: "HBA", city: "Hobart", country: "Australia", name: "Hobart Airport", lat: -42.8361, lon: 147.5100 },
  { code: "TSV", city: "Townsville", country: "Australia", name: "Townsville Airport", lat: -19.2525, lon: 146.7653 },
  { code: "MCY", city: "Sunshine Coast", country: "Australia", name: "Sunshine Coast Airport", lat: -26.6033, lon: 153.0910 },
  { code: "NTL", city: "Newcastle", country: "Australia", name: "Newcastle Airport", lat: -32.7950, lon: 151.8344 },
  { code: "AYQ", city: "Uluru", country: "Australia", name: "Ayers Rock Airport", lat: -25.1861, lon: 130.9761 },
  { code: "ASP", city: "Alice Springs", country: "Australia", name: "Alice Springs Airport", lat: -23.8067, lon: 133.9022 },
  { code: "LST", city: "Launceston", country: "Australia", name: "Launceston Airport", lat: -41.5453, lon: 147.2142 },
  { code: "BME", city: "Broome", country: "Australia", name: "Broome International Airport", lat: -17.9445, lon: 122.2310 },

  // --- New Zealand ---
  { code: "AKL", city: "Auckland", country: "New Zealand", name: "Auckland Airport", lat: -37.0082, lon: 174.7850 },
  { code: "CHC", city: "Christchurch", country: "New Zealand", name: "Christchurch International Airport", lat: -43.4894, lon: 172.5322 },
  { code: "WLG", city: "Wellington", country: "New Zealand", name: "Wellington International Airport", lat: -41.3272, lon: 174.8053 },
  { code: "ZQN", city: "Queenstown", country: "New Zealand", name: "Queenstown Airport", lat: -45.0211, lon: 168.7392 },
  { code: "DUD", city: "Dunedin", country: "New Zealand", name: "Dunedin Airport", lat: -45.9281, lon: 170.1983 },
  { code: "ROT", city: "Rotorua", country: "New Zealand", name: "Rotorua Airport", lat: -38.1092, lon: 176.3172 },
  { code: "NSN", city: "Nelson", country: "New Zealand", name: "Nelson Airport", lat: -41.2983, lon: 173.2211 },
  { code: "PMR", city: "Palmerston North", country: "New Zealand", name: "Palmerston North Airport", lat: -40.3206, lon: 175.6170 },
  { code: "NPE", city: "Napier", country: "New Zealand", name: "Hawke's Bay Airport", lat: -39.4658, lon: 176.8700 },
  { code: "TRG", city: "Tauranga", country: "New Zealand", name: "Tauranga Airport", lat: -37.6719, lon: 176.1961 },
  { code: "HLZ", city: "Hamilton", country: "New Zealand", name: "Hamilton Airport", lat: -37.8667, lon: 175.3320 },

  // --- Fiji ---
  { code: "NAN", city: "Nadi", country: "Fiji", name: "Nadi International Airport", lat: -17.7554, lon: 177.4434 },
  { code: "SUV", city: "Suva", country: "Fiji", name: "Nausori International Airport", lat: -18.0433, lon: 178.5592 },

  // --- Papua New Guinea ---
  { code: "POM", city: "Port Moresby", country: "Papua New Guinea", name: "Jacksons International Airport", lat: -9.4434, lon: 147.2200 },

  // --- New Caledonia ---
  { code: "NOU", city: "Noumea", country: "New Caledonia", name: "La Tontouta International Airport", lat: -22.0146, lon: 166.2130 },

  // --- French Polynesia ---
  { code: "PPT", city: "Papeete", country: "French Polynesia", name: "Faa'a International Airport", lat: -17.5537, lon: -149.6074 },

  // ==================== Central Asia ====================
  // --- Kazakhstan ---
  { code: "ALA", city: "Almaty", country: "Kazakhstan", name: "Almaty International Airport", lat: 43.3520, lon: 77.0405 },
  { code: "NQZ", city: "Astana", country: "Kazakhstan", name: "Nursultan Nazarbayev International Airport", lat: 51.0222, lon: 71.4669 },

  // --- Uzbekistan ---
  { code: "TAS", city: "Tashkent", country: "Uzbekistan", name: "Islam Karimov Tashkent International Airport", lat: 41.2579, lon: 69.2812 },

  // --- Azerbaijan ---
  { code: "GYD", city: "Baku", country: "Azerbaijan", name: "Heydar Aliyev International Airport", lat: 40.4675, lon: 50.0467 },

  // --- Georgia ---
  { code: "TBS", city: "Tbilisi", country: "Georgia", name: "Tbilisi International Airport", lat: 41.6692, lon: 44.9547 },

  // --- Armenia ---
  { code: "EVN", city: "Yerevan", country: "Armenia", name: "Zvartnots International Airport", lat: 40.1473, lon: 44.3959 },

  // --- Mongolia ---
  { code: "UBN", city: "Ulaanbaatar", country: "Mongolia", name: "Chinggis Khaan International Airport", lat: 47.6516, lon: 106.8196 },
];
