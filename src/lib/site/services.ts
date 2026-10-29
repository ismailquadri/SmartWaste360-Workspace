import { SERVICES, SITE, type ServiceId } from "./content";
import { photos } from "./media";

type Cta = { label: string; href?: string; to?: "/contact" | "/smartwaste360" | "/report" | "/workspace" };

export type ServicePage = {
  id: ServiceId;
  title: string;
  heading: [string, string];
  subline: string;
  image: string;
  intro: string[];
  points: { title: string; items: string[] };
  more?: { title: string; body: string };
  stat: { value: string; label: string };
  cta?: Cta;
};

const PAGES: Record<ServiceId, Omit<ServicePage, "id" | "title">> = {
  collection: {
    heading: ["Household", "collection"],
    subline: "Your PSP operator, at your gate, on schedule.",
    image: photos.truckStreet,
    intro: [
      "Household waste in Lagos is collected by accredited Private Sector Participation (PSP) operators. Each operator is allocated wards according to its technical capacity and is monitored by LAWMA.",
      "PSP began as a pilot in Kosofe and Bariga in 1997. Since operators moved under LAWMA in 2007, the network has grown from 116 operators to 364, employing more than 3,500 Lagosians.",
    ],
    points: {
      title: "How it works for you",
      items: [
        "An accredited PSP operator serves every ward",
        "Keep a covered bin; every tenement should have one",
        "Put bins out the night before collection day",
        "Billing is monthly, never per pickup",
        "Call 617 to find out who your PSP is",
      ],
    },
    more: {
      title: "Know your PSP",
      body: "Only use the PSP operator assigned to your street. Cart pushers and unregistered collectors often dump waste in drains and on road medians.",
    },
    stat: { value: "364", label: "PSP operators serving Lagos households" },
    cta: { label: "Get the SmartWaste360 app", href: SITE.customerApp },
  },
  commercial: {
    heading: ["Markets &", "businesses"],
    subline: "Clean before the first customer arrives.",
    image: photos.marketMorning,
    intro: [
      "LAWMA’s Commercial Services and Market Waste Services keep markets, plazas, offices and industrial sites clean, with crews that clear before trading opens.",
      "Businesses hold a monthly commercial account. Organisations can also adopt a street and fund community sanitation as part of their social responsibility.",
    ],
    points: {
      title: "What we provide",
      items: [
        "Sanitation windows before trading starts",
        "Monthly commercial accounts",
        "Double dino bins for markets and black spots",
        "Healthcare and medical waste collection by licensed PSPs",
        "Construction, demolition and disaster waste removal (CDDW)",
      ],
    },
    stat: { value: "100", label: "Double dino bins added for markets and black spots" },
    cta: { label: "Talk to commercial services", to: "/contact" },
  },
  disposal: {
    heading: ["Disposal", "sites"],
    subline: "Every truck in, weighed and turned round.",
    image: photos.transferStation,
    intro: [
      "Waste collected across the state goes to LAWMA’s landfills and transfer loading stations. Since 2017 these sites are run by private operators under LAWMA’s regulation.",
      "LAWMA has rehabilitated and capped sections of Olusosun, Solous, Epe, Ikorodu and Badagry to shorten turnaround times, give trucks easier access and reduce leachate in the surrounding ground and water.",
    ],
    points: {
      title: "Sites and standards",
      items: [
        "Olusosun, Solous, Epe, Ikorodu and Badagry landfills",
        "Transfer loading stations to shorten truck journeys",
        "Roads rehabilitated ahead of the rainy season",
        "A weighbridge ticket for every load",
      ],
    },
    stat: { value: "5", label: "Landfills rehabilitated for faster turnaround" },
    cta: { label: "See how SmartWaste360 tracks a load", to: "/smartwaste360" },
  },
  recycling: {
    heading: ["Recycling &", "recovery"],
    subline: "What we throw away has value.",
    image: photos.recycling,
    intro: [
      "Under the Lagos Recycle Initiative, LAWMA places bins for sorted recyclables at markets, malls, schools and other public spaces, so that residents separate waste where it is made.",
      "Registered recyclers collect from households in each Local Government and LCDA. The number of recycling companies in Lagos has grown from three to 78, creating more than 6,000 jobs.",
    ],
    points: {
      title: "What goes in a recycling bin",
      items: [
        "Clean paper, newspapers, magazines and leaflets",
        "Clean cardboard",
        "Washed drink cans and food cans",
        "Washed milk and juice cartons",
        "Washed plastic bottles and rigid plastic packaging",
      ],
    },
    stat: { value: "78", label: "Recycling companies in Lagos, up from three" },
  },
  marine: {
    heading: ["Drains &", "waterways"],
    subline: "Free-flowing drains and a cleaner lagoon.",
    image: photos.lagoonDusk,
    intro: [
      "Seventeen per cent of Lagos State is water: lagoons, creeks, rivers and coastline. LAWMA’s Marine Waste Services clear floating waste, PET bottles and water hyacinth from canals and shorelines to prevent flooding.",
      "The work is done with the Food and Beverage Recycling Alliance (FBRA), and engages young people from riverine communities.",
    ],
    points: {
      title: "What the marine team does",
      items: [
        "New boats for marine waste operations",
        "Clearing canals and shorelines before and through the rains",
        "Collecting PET bottles from the waterways with FBRA",
        "Training young people from riverine communities",
        "Never dump in drains; it floods homes",
      ],
    },
    stat: { value: "590", label: "Marine waste jobs created" },
    cta: { label: "Report a blocked drain", to: "/report" },
  },
  academy: {
    heading: ["LAWMA", "Academy"],
    subline: "A city that knows, cares.",
    image: photos.academy,
    intro: [
      "LAWMA Academy is the educational arm of the Authority. With the Lagos State Universal Basic Education Board (LASUBEB) it has brought waste management into the primary school curriculum.",
      "The Academy runs training, internships and summer schools, and shares Lagos’ experience with other states and African countries.",
    ],
    points: {
      title: "Programmes",
      items: ["Summer schools and internships", "Community sensitisation drives", "Waste education in primary schools", "Professional training and development"],
    },
    stat: { value: "2024", label: "Summer School completed, alongside July internships" },
    cta: { label: "Visit LAWMA Academy", href: SITE.academy },
  },
};

export const SERVICE_PAGES: ServicePage[] = SERVICES.map((s) => ({ id: s.id, title: s.title, ...PAGES[s.id] }));

export const servicePage = (id: string) => SERVICE_PAGES.find((p) => p.id === id);
