// Public facts, contacts and newsroom items, taken from lawma.gov.ng.

export const SITE = {
  name: "Lagos Waste Management Authority",
  short: "LAWMA",
  hours: "Mon–Fri · 07:30–19:00",
  tollFree: [
    { label: "Short code (Glo)", value: "617", href: "tel:617" },
    { label: "Toll-free · 080000LAWMA", value: "0800 005 2962", href: "tel:+2348000052962" },
    { label: "Customer line", value: "0708 060 1020", href: "tel:+2347080601020" },
  ],
  email: "info@lawma.gov.ng",
  social: [
    { label: "X / Twitter", href: "https://twitter.com/Lawma_gov" },
    { label: "Instagram", href: "https://instagram.com/Lawma_gov/" },
    { label: "Facebook", href: "https://www.facebook.com/lawma" },
  ],
  academy: "http://www.lawmaacademy.com/",
  customerApp: "https://smartwaste360-mobile.vercel.app/landing",
  builder: { name: "Sparkr Digitals", href: "https://sparkrdigitals.com" },
} as const;


export const FACTS = [
  { value: 1977, suffix: "", label: "Year founded, ahead of FESTAC ’77" },
  { value: 364, suffix: "", label: "Private Sector Participation operators" },
  { value: 3500, suffix: "+", label: "PSP staff serving Lagos households" },
  { value: 6, suffix: "", label: "Operational districts across the state" },
];

export const PSP_GROWTH = [
  { period: "2004–07", psp: 116, staff: 696 },
  { period: "2007–10", psp: 213, staff: 1278 },
  { period: "2011–14", psp: 346, staff: 2076 },
  { period: "2014–now", psp: 364, staff: 3500 },
];

export type ServiceId = "collection" | "commercial" | "disposal" | "recycling" | "marine" | "academy";

export const SERVICES: { id: ServiceId; index: string; title: string; line: string; body: string }[] = [
  {
    id: "collection",
    index: "01",
    title: "Household collection",
    line: "Your PSP, at your gate, on schedule.",
    body: "Accredited Private Sector Participation operators collect from homes in every ward. Know your PSP, keep a bin, and every pickup joins your service record.",
  },
  {
    id: "commercial",
    index: "02",
    title: "Markets & businesses",
    line: "Clean before the first customer.",
    body: "Sanitation windows for markets, plazas and offices, with monthly commercial accounts and crews that clear before trading opens.",
  },
  {
    id: "disposal",
    index: "03",
    title: "Disposal sites",
    line: "Every truck in, weighed and cleared.",
    body: "Waste from across the state is received at our disposal sites. Rehabilitated roads and managed queues keep trucks turning round, even in the rains.",
  },
  {
    id: "recycling",
    index: "04",
    title: "Recycling & recovery",
    line: "What we throw away has value.",
    body: "Registered recyclers collect from households in each Local Government and LCDA, turning PET, cans and paper into material for local industry.",
  },
  {
    id: "marine",
    index: "05",
    title: "Drains & waterways",
    line: "Free-flowing drains. A cleaner lagoon.",
    body: "Drain clearing and marine litter clean-ups protect homes from flooding and keep the lagoon and coastline alive.",
  },
  {
    id: "academy",
    index: "06",
    title: "LAWMA Academy",
    line: "A city that knows, cares.",
    body: "Training, internships and summer schools that take waste education into schools and communities, and share Lagos’ experience across Africa.",
  },
];

export type Recycler = { area: string; name: string; phone: string; address: string };

export const RECYCLERS: Recycler[] = [
  { area: "Amuwo-Odofin", name: "RecyclePoints Limited", phone: "0809 800 2400", address: "Alakija, Festac" },
  { area: "Surulere", name: "Watco Global Services", phone: "0802 319 9565", address: "Michael Ogun Street, off Itire Road, Ojuelegba" },
  { area: "Itire-Ikate", name: "Wecyclers Nigeria Ltd.", phone: "0818 776 4011", address: "Adeyole Street, Liko bus stop, Surulere" },
  { area: "Lagos Island", name: "Wecyclers Nigeria Limited", phone: "0812 766 6203", address: "149 Bamgbose Street, Lagos Island" },
  { area: "Ikoyi-Obalende", name: "Street Waste Company Ltd.", phone: "0903 110 8000", address: "159, opposite Court of Appeal, Lagos" },
  { area: "Eti-Osa", name: "Negand Integrated Services", phone: "0818 170 4544", address: "Sangotedo" },
  { area: "Eti-Osa East", name: "Ecoviridis Environmental Technology", phone: "0805 278 5053", address: "Popo Williams, Lekki Scheme 2" },
  { area: "Ikeja", name: "FAN Renewable System Ltd.", phone: "0803 485 4262", address: "2 Akilo Street, Ogba, Ikeja" },
  { area: "Onigbongbo", name: "Monttainai Recycling", phone: "0812 314 3435", address: "Isaac John Street, GRA Ikeja" },
  { area: "Lagos Mainland", name: "WRM Integrated Nig. Ltd.", phone: "0805 528 3155", address: "Oyingbo" },
  { area: "Isolo", name: "Greenhill Dispose Recyclers", phone: "0803 937 7972", address: "8 Joe Crescent, Ajao Estate" },
  { area: "Oshodi", name: "Greenhill", phone: "0803 937 7972", address: "Aswani Market, Oshodi" },
  { area: "Agbado Oke-Odo", name: "Scrappays Technologies", phone: "0816 367 8475", address: "1 Bayo Aderiye Street, Abule Egba" },
  { area: "Ojokoro", name: "Zebaj Recycling", phone: "0818 730 8126", address: "Ijaiye Ojokoro" },
  { area: "Alimosho", name: "Ecoprune", phone: "0706 467 2606", address: "7/9 Kuburatu Agbedeyi Street, Kola Alagbado" },
  { area: "Igando-Ikotun", name: "WestafricanENRG", phone: "0803 332 5945", address: "Km 3 LASU–Isheri Road, Igando" },
  { area: "Egbe-Idimu", name: "Parallel Consult", phone: "0818 846 6444", address: "39 Jamiu Raji Street, off Cele Egbe bus stop" },
  { area: "Agege", name: "Procycle", phone: "0808 761 3145", address: "4 Efunga Close, Oko-Oba, Agege" },
  { area: "Lekki", name: "Thermal Initiative", phone: "0803 072 0557", address: "Chevron, Lekki" },
  { area: "Ibeju-Lekki", name: "3R Recycling", phone: "0809 423 6533", address: "Abule Pan, Awoyaya" },
  { area: "Ikorodu Central", name: "Top Polymers", phone: "0810 531 3406", address: "473 Ikorodu Industrial Scheme, Odogunyan" },
  { area: "Ikorodu West", name: "Planet Savers", phone: "0818 215 6246", address: "Sabo, Ikorodu" },
  { area: "Badagry", name: "Green Janitors", phone: "0706 203 1703", address: "1 Joseph Dosu Way, Badagry" },
  { area: "Ojo", name: "Ecoplastic & Aluminium Recycling", phone: "0803 694 0416", address: "10/11 Sunny Smile Street, Iyano Isashi, Ojo" },
];

export type NewsItem = { date: string; category: "News" | "Events"; title: string; href: string; image?: keyof typeof import("./media").field };

export const NEWS: NewsItem[] = [
  {
    date: "2024-10-01",
    category: "Events",
    title: "Happy 64th Independence Day from all of us at LAWMA",
    href: "https://lawma.gov.ng/happy-64th-independence-day-celebration-from-all-of-us-at-lawma/",
  },
  {
    date: "2024-09-27",
    category: "Events",
    title: "World Cleanup Day: LAWMA tackles marine waste, calls for residents’ involvement",
    href: "https://lawma.gov.ng/world-cleanup-day-lawma-tackles-marine-waste-calls-for-residents-involvement-in-cleanup-activities/",
    image: "marineCleanup",
  },
  {
    date: "2024-09-11",
    category: "Events",
    title: "Sanwo-Olu canvasses eco-friendly product packaging, tasks food industry on best practice",
    href: "https://lawma.gov.ng/sanwo-olu-canvasses-eco-friendly-products-packaging-tasks-food-industry-players-on-environmental-best-practice/",
    image: "recyclingTour",
  },
  {
    date: "2024-09-05",
    category: "Events",
    title: "LAWMA Academy concludes 2024 Summer School",
    href: "https://lawma.gov.ng/lawma-academy-concludes-2024-summer-school/",
  },
  {
    date: "2024-08-13",
    category: "News",
    title: "LAWMA boss advocates ‘Adopt a Street’, urges organisations to embrace community sanitation",
    href: "https://lawma.gov.ng/press-release-lawma-boss-advocates-for-adopt-a-street-initiative-encourages-private-organizations-to-embrace-corporate-social-responsibility-through-community-sanitation/",
    image: "bridgeSweep",
  },
  {
    date: "2024-07-31",
    category: "News",
    title: "Get a waste bin for a clean environment, LAWMA boss tells Lagosians",
    href: "https://lawma.gov.ng/press-release-get-waste-bin-for-a-clean-environment-lawma-boss-tells-lagosians/",
    image: "binDrive2",
  },
  {
    date: "2024-07-29",
    category: "News",
    title: "Lagos may introduce smart bins to combat indiscriminate waste disposal",
    href: "https://lawma.gov.ng/lagos-may-introduce-smart-bins-to-combat-indiscriminate-waste-disposal-as-traditional-chief-baba-oja-more-residents-clamor-for-return-of-monthly-sanitation-exercise/",
    image: "binDrive1",
  },
  {
    date: "2024-07-29",
    category: "News",
    title: "Our sanitation advocacy campaign will continue until all residents are converted",
    href: "https://lawma.gov.ng/our-sanitation-advocacy-campaign-will-continue-until-all-residents-are-converted-env-special-adviser/",
    image: "binDrive3",
  },
  {
    date: "2024-05-02",
    category: "News",
    title: "Rainy season: LAWMA completes rehabilitation of Olusosun dumpsite",
    href: "https://lawma.gov.ng/rainy-season-lawma-completes-rehabilitation-of-olusosun-dumpsite/",
    image: "olusosun",
  },
  {
    date: "2024-07-02",
    category: "Events",
    title: "Cholera outbreak: LAWMA boss tasks residents on personal and domestic hygiene",
    href: "https://lawma.gov.ng/cholera-outbreak-lawma-boss-tasks-residents-on-personal-domestic-hygiene/",
  },
];

export const MEDIA = [
  {
    id: "7Szcd3VuyIk",
    outlet: "TVC",
    date: "20 Jan 2026",
    title: "Managing waste in Lagos: LAWMA MD responds to public concerns",
  },
  {
    id: "cEGO4jKgz_8",
    outlet: "Channels Television",
    date: "17 Jan 2026",
    title: "How public awareness helps curb indiscriminate waste disposal",
  },
  {
    id: "WXo08J5xu-M",
    outlet: "The Morayo Show",
    date: "Season 1 · Ep. 12",
    title: "Meet the hardworking sweepers who start Lagos’ day",
  },
];

export function formatNewsDate(iso: string) {
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}
