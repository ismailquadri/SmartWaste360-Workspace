// About LAWMA: taken from lawma.gov.ng (Who we are, Principal Officers, Departments and Units,
// Achievements and awards, Past MD/CEO, district pages and Contact).

const portraits = import.meta.glob<{ url: string }>("../../assets/people/*.asset.json", { eager: true, import: "default" });
/** Portrait URL by file stem, e.g. "kunle-adebiyi" or "past-09". */
export function portrait(stem: string) {
  const hit = Object.entries(portraits).find(([path]) => path.endsWith(`/${stem}.jpg.asset.json`));
  return hit?.[1].url ?? "";
}

export const ABOUT_PAGES = [
  { to: "/about", label: "Who we are" },
  { to: "/about/principal-officers", label: "Principal officers" },
  { to: "/about/departments", label: "Departments and units" },
  { to: "/about/awards", label: "Achievements and awards" },
  { to: "/about/md-ceo", label: "Office of the MD/CEO" },
  { to: "/about/past-md-ceos", label: "Past MD/CEOs" },
] as const;

export const HEAD_OFFICE = "No. 3 Iddo Yard, Ijora Olopa, Lagos";

export const VISION =
  "To improve environmental sustainability, achieve a cleaner, healthier Lagos and to be the hallmark of waste management regulatory practices in the African region.";
export const MISSION =
  "We are committed to achieving an efficient waste management system by employing adaptable solutions and best practices, as well as encouraging regional integration and customer-focused service delivery.";

export const PROFILE = [
  "The Lagos Waste Management Authority began in 1977 as the Lagos State Refuse Disposal Board, set up by Edict No. 9 as Nigeria prepared for FESTAC ’77. Lagos Island and Lagos Mainland, the only two councils at the time, could not cope with the waste of an oil-boom city drawing people from across Nigeria and West Africa.",
  "Its name and duties grew with the city. Today LAWMA regulates waste management across Lagos State: household, commercial and industrial collection, disposal sites, recycling, drains and waterways. It also advises other states in Nigeria and other African countries on waste matters.",
];

export type HistoryEntry = { year: string; items: { when?: string; text: string }[] };

export const HISTORY: HistoryEntry[] = [
  {
    year: "1977",
    items: [
      { text: "Lagos State Refuse Disposal Board established by Edict No. 9 of 1977" },
      { text: "Powell Duffryn Pollution Control of Canada contracted to run collection in Lagos Island and part of the Mainland" },
    ],
  },
  { year: "1979", items: [{ when: "13 March", text: "Board commissioned and renamed Lagos State Waste Disposal Board, with drain clearing added" }] },
  { year: "1980", items: [{ text: "Collection and disposal of industrial waste begins" }] },
  {
    year: "1981",
    items: [{ text: "Emergency flood relief operations in the rainy season" }, { text: "Collection of scrap and abandoned vehicles" }],
  },
  {
    year: "1984",
    items: [{ text: "Removal of illegal structures blocking drains and road setbacks" }, { text: "Litter control across the metropolis" }],
  },
  { year: "1991", items: [{ when: "December", text: "Renamed Lagos State Waste Management Authority by Edict No. 55" }] },
  { year: "1997", items: [{ text: "Private Sector Participation (PSP) pilot in Kosofe and Bariga" }] },
  { year: "2004", items: [{ text: "PSP operators appointed by technical capacity to serve 20 LGs and 37 LCDAs" }] },
  {
    year: "2007",
    items: [
      { when: "March", text: "Renamed Lagos Waste Management Authority under LAWMA Law No. 5 of 2007" },
      { when: "March", text: "PSP operators transferred to LAWMA for restructuring and monitoring" },
    ],
  },
  { year: "2017", items: [{ when: "1 March", text: "Environmental Management and Protection Law makes LAWMA a full regulator of the sector" }] },
  { year: "2021", items: [{ when: "4 August", text: "102 new collection trucks and 100 double dino bins commissioned by Governor Sanwo-Olu" }] },
];

export const OPERATIONS = [
  { t: "Recycling", b: "Bins for sorted recyclables at markets, malls, schools and public spaces, under the Lagos Recycle Initiative." },
  { t: "Marine waste", b: "Boats and crews clear floating waste, PET bottles and water hyacinth from canals, creeks and shorelines." },
  { t: "LAWMA Academy", b: "Waste education in primary schools with LASUBEB, plus training, internships and summer schools." },
  { t: "PSP franchise", b: "A five-year franchise agreement with PSP operators to strengthen household collection." },
  { t: "Construction waste", b: "Heavy equipment to evacuate construction, demolition and disaster waste from sites." },
  { t: "Adopt-a-Bin", b: "Every tenement keeps a waste bin, to stop indiscriminate dumping across the metropolis." },
  { t: "Enforcement", b: "Sealing of premises and prosecution of environmental offenders who dump waste." },
  { t: "Street sweeping", b: "Thousands of sweepers and supervisors keep roads and highways clean every day." },
  { t: "Landfill rehabilitation", b: "Rehabilitation and capping at Olusosun, Solous, Epe, Ikorodu and Badagry for faster turnaround." },
  { t: "Community advocacy", b: "Door-to-door campaigns on bagging waste properly and using only assigned PSP operators." },
];

export const ACHIEVEMENTS = [
  { value: "78", label: "Recycling companies in Lagos, up from three, with over 6,000 jobs created" },
  { value: "437", label: "PSP operators on a five-year franchise agreement" },
  { value: "16,489", label: "Street sweepers and supervisors engaged" },
  { value: "102", label: "New collection trucks commissioned, with 100 double dino bins" },
  { value: "1,061", label: "People engaged in enforcement and waste policing" },
  { value: "590", label: "Marine waste jobs cleaning shorelines and canals" },
];

export const ACHIEVEMENT_NOTES = [
  "Waste education in primary schools with LASUBEB, through LAWMA Academy",
  "Launch of the Adopt-a-Bin programme",
  "Insurance payments to highway sweepers injured at work",
  "Full rehabilitation of landfills for faster turnaround and easier truck access",
  "3,500 sweepers working with highway managers",
  "In-house fabrication of double dino bins for markets and black spots",
  "Community advocacy across every LGA and LCDA",
];

export const AWARDS_BY_YEAR: { year: string; items: { title: string; by: string }[] }[] = [
  { year: "2010", items: [{ title: "Most Enterprising Governmental Agency", by: "Federal Ministry of Commerce & Industry" }] },
  {
    year: "2009",
    items: [
      { title: "Contribution to the empowerment of women and youth, widows, orphans and vulnerable children", by: "Blessed Fruit Foundation" },
      { title: "Contribution to sanitising and beautifying Lagos State", by: "Bola Ahmed Tinubu Foundation (BATFOD)" },
      { title: "Recognition award", by: "435 Base Service Group, Nigerian Air Force, Ikeja" },
      { title: "Award of Excellence, Transformation Personality", by: "Constructing & Engineering Digest (CED) Forum" },
      { title: "Contribution to science and national development in solid waste management", by: "Faculty of Science, Obafemi Awolowo University, Ile-Ife" },
      { title: "Contribution to the growth and development of the Nigerian economy", by: "Corporate Services Inc." },
    ],
  },
  {
    year: "2008",
    items: [
      { title: "A unique model to manage and recycle waste in Nigeria", by: "Association of Waste Managers of Nigeria (AWAM)" },
      { title: "Excellence in health-care waste management in Lagos State", by: "JSI / MMIS / USAID" },
      { title: "Distinguished Service Award for a clean and healthy Lagos", by: "Lagos Waste Management Authority" },
      { title: "Innovation in waste management in Nigeria", by: "ICON of Waste Management in Nigeria" },
      { title: "Teen Favourite Award", by: "Teens Resources Centre" },
      { title: "Contribution to a good and healthy environment in Lagos State", by: "Ako-Eko Environmental Summit Monitoring Committee" },
      { title: "Recognition award", by: "9 Brigade, Nigerian Army" },
      { title: "Outstanding performance in ensuring a clean Lagos", by: "University of Agriculture Abeokuta Alumni Association, Lagos Chapter" },
    ],
  },
  {
    year: "2006",
    items: [
      { title: "Support on the school’s tenth anniversary", by: "Parents/Teachers Association" },
      { title: "Eminent African Leadership Merit Award", by: "For contribution to national and African development" },
    ],
  },
];

export type Officer = { name: string; role: string; photo: string };

export const OFFICERS: Officer[] = [
  { name: "Mr. Kunle Adebiyi", role: "Executive Director (Finance)", photo: "kunle-adebiyi" },
  { name: "Mr. Mukaila Sanusi", role: "Head, Public Affairs", photo: "mukaila-sanusi" },
  { name: "Mr. Oluwakemi Sulaiman", role: "Head, Special Duties", photo: "oluwakemi-sulaiman" },
  { name: "Mr. Olaniyan Oluwatosin", role: "Head, ICT", photo: "olaniyan-oluwatosin" },
  { name: "Mr. Oluwakemi Alao", role: "District Head, Central I", photo: "oluwakemi-alao" },
  { name: "Mrs. Aramide Olaniyan", role: "Head, Customer Care & Corporate Engagement", photo: "aramide-olaniyan" },
  { name: "Mr. Hammed Edu", role: "Head, Audit", photo: "hammed-edu" },
  { name: "Mr. Lawal Babatunde Abdulrahman", role: "Deputy Director, School Waste Sanitation Services", photo: "lawal-babatunde" },
  { name: "Mrs. Abimbola Opayemi", role: "Deputy Director, Commercial Services", photo: "abimbola-opayemi" },
  { name: "Mr. Babatunde Sulaiman", role: "Chief Planning Officer, PSP Services", photo: "babatunde-sulaiman" },
  { name: "Dr. Essien Nsuabia", role: "Head, Waste Management Research & Policy", photo: "essien-nsuabia" },
  { name: "Mrs. Jalilat Adeniran", role: "Financial Controller", photo: "jalilat-adeniran" },
  { name: "Mrs. Apena Aderonke", role: "Head, Market Waste Services", photo: "apena-aderonke" },
  { name: "Mr. Aderibigbe Emmanuel", role: "Head, Fleet Administration / Engineering Services", photo: "aderibigbe-emmanuel" },
  { name: "Mr. Demola Waheed", role: "Deputy Director, CDDW", photo: "demola-waheed" },
  { name: "Mrs. Jirinsola Olaleye", role: "Assistant Director, Circular Economy", photo: "jirinsola-olaleye" },
  { name: "Mrs. Bukola Adeyemo", role: "Chief Legal Officer, PPP", photo: "bukola-adeyemo" },
  { name: "Mr. Lanre Shasore", role: "CAO, Sanitation", photo: "lanre-shasore" },
  { name: "Mr. Adedeji Victor Oyeniyi", role: "Head, Advocacy", photo: "adedeji-victor" },
  { name: "Mrs. Babatunde Lydia Oladunni", role: "Head, Budget & Planning", photo: "lydia-babatunde" },
  { name: "Mrs. Bola Adewunmi", role: "Head, LAWMA Academy, Training & Development", photo: "bola-adewunmi" },
  { name: "Dr. (Mrs.) Modupe Okoh", role: "Head, Medical Services, Health & Safety", photo: "modupe-okoh" },
  { name: "Mrs. Mojisola Adeleye", role: "Head, Healthcare Waste", photo: "mojisola-adeleye" },
  { name: "Mr. Olumide Mumuney", role: "Assistant Director, Landfill/TLS", photo: "olumide-mumuney" },
  { name: "Mr. Oyetesu Owolabi Temitope", role: "Assistant Director, Procurement", photo: "oyetesu-owolabi" },
  { name: "Mr. Olatoye Lawal", role: "Assistant Director, Operations", photo: "olatoye-lawal" },
];

export const DEPARTMENT_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Leadership and finance",
    items: ["Managing Director/CEO’s Office", "Executive Director (Finance) Office", "Finance & Accounts", "Budget & Planning", "Audit", "Procurement"],
  },
  {
    title: "Operations",
    items: ["Operations", "Street Sanitation", "Fleet Management", "Landfill / TLS (Transfer Loading Station)", "PSP Services", "Special Duties", "Project"],
  },
  {
    title: "Waste services",
    items: [
      "Commercial Services",
      "Market Waste Services",
      "Healthcare Waste Services",
      "School Sanitation",
      "Construction, Demolition & Disaster Waste (CDDW)",
      "Circular Economy",
      "Waste to Energy",
    ],
  },
  {
    title: "Regulation and compliance",
    items: ["Monitoring & Compliance", "Enforcement", "Legal Services", "Performance Management & Evaluation", "Waste Management Development, Research & Policy"],
  },
  {
    title: "People and the public",
    items: [
      "Public Affairs",
      "Advocacy",
      "Customer Care / Corporate Engagement",
      "LAWMA Academy",
      "Medical, Health & Safety",
      "Information & Communication Technology (ICT)",
    ],
  },
];

export const DISTRICTS = [
  { name: "East I", head: "Mr. Wale Adesina", email: "w.adesina@lawma.gov.ng", phones: ["0802 916 3630"] },
  { name: "East II", head: "Mrs. Bola Adewunmi", email: "l.adewunmi@lawma.gov.ng", phones: ["0813 654 2134", "0916 997 2226"] },
  { name: "Central I", head: "Mr. Oluwakemi Alao", email: "k.alao@lawma.gov.ng", phones: ["0802 319 6275", "0916 997 3072"] },
  { name: "Central II", head: "Mr. Lawal Idris Olasheni", email: "i.lawal@lawma.gov.ng", phones: ["0803 758 6356"] },
  { name: "West I", head: "Mr. Akinwale Adesina", email: "a.adesina@lawma.gov.ng", phones: ["0808 577 1013", "0916 997 3115"] },
  { name: "West II", head: "Mrs. Tawa Oyekanmi", email: "t.oyekanmi@lawma.gov.ng", phones: ["0706 634 7530", "0916 997 3109"] },
];

export const PAST_MDS = [
  { name: "Engr. Adebayo Adeyemi", title: "General Manager", term: "1985 – 1988", photo: "past-01" },
  { name: "Mr. M.F. Famuyibo", title: "General Manager", term: "1988 – 1992", photo: "past-02" },
  { name: "Engr. G.O. Saka", title: "General Manager", term: "1994 – 19 May 1998", photo: "past-03" },
  { name: "Wing Commander E.F. Golit", title: "General Manager", term: "1998 – 1999", photo: "past-04" },
  { name: "Dr. O.O. Omofade", title: "Sole Administrator", term: "February – 8 June 1999", photo: "past-05" },
  { name: "Mr. W.A.O. Baruwa Etti", title: "Acting appointment", term: "2 June – 6 August 1999", photo: "past-06" },
  { name: "Engr. Adebisi Adesina", title: "General Manager / CEO", term: "19 July 1999 – 2 February 2001", photo: "past-07" },
  { name: "Elder Olushola Popoola", title: "General Manager / CEO", term: "2001 – 2006", photo: "past-08" },
  { name: "Mr. Oladimeji Oresanya", title: "Managing Director", term: "2005 – 2015", photo: "past-09" },
  { name: "Engr. Abdulwahab Ogunbiyi", title: "General Manager", term: "July 2015 – 2016", photo: "past-10" },
  { name: "Mr. Segun Adeniji", title: "General Manager", term: "June 2016 – December 2019", photo: "past-11" },
  { name: "Mr. Oladimeji Oresanya", title: "Managing Director", term: "December 2018 – July 2019", photo: "past-12" },
  { name: "Dr. Muyiwa Gbadegesin", title: "Managing Director / CEO", term: "July 2019 – May 2020", photo: "past-13" },
  { name: "Mr. Ibrahim Odumboni", title: "Managing Director / CEO", term: "August 2020 – June 2023", photo: "past-14" },
  { name: "Dr. Muyiwa Gbadegesin", title: "Managing Director / CEO", term: "June 2023 – October 2026", photo: "past-13" },
];

export const MD_OFFICE = {
  lead: "The Managing Director/CEO leads the Authority’s management team and its departments, units and six operational districts.",
  duties: [
    "Sets the direction for waste management regulation across Lagos State",
    "Oversees PSP operators, disposal sites and transfer loading stations",
    "Leads the response to emergencies, flooding and black spots",
    "Represents LAWMA to the Lagos State Government, partners and the public",
    "Champions recycling, the circular economy and waste education",
  ],
};
