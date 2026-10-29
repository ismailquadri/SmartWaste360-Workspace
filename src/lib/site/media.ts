// Every photo and film the public website shows, in one place.
import heroBridge from "@/assets/site/hero-bridge.jpg";
import crewDawn from "@/assets/site/crew-dawn.jpg";
import truckStreet from "@/assets/site/truck-street.jpg";
import transferStation from "@/assets/site/transfer-station.jpg";
import recycling from "@/assets/site/recycling.jpg";
import lagoonDusk from "@/assets/site/lagoon-dusk.jpg";
import controlRoom from "@/assets/site/control-room.jpg";
import marketMorning from "@/assets/site/market-morning.jpg";
import household from "@/assets/site/household.jpg";
import academy from "@/assets/site/academy.jpg";
import skylineNight from "@/assets/site/skyline-night.jpg";

import heroBridgeFilm from "@/assets/site/video/hero-bridge.mp4.asset.json";
import crewDawnFilm from "@/assets/site/video/crew-dawn.mp4.asset.json";
import controlRoomFilm from "@/assets/site/video/control-room.mp4.asset.json";

import field02 from "@/assets/site/field/field-02.jpg.asset.json";
import field05 from "@/assets/site/field/field-05.jpg.asset.json";
import field24 from "@/assets/site/field/field-24.jpg.asset.json";
import field27 from "@/assets/site/field/field-27.jpg.asset.json";
import field28 from "@/assets/site/field/field-28.jpg.asset.json";
import field29 from "@/assets/site/field/field-29.jpg.asset.json";
import field35 from "@/assets/site/field/field-35.jpg.asset.json";

import productOverview from "@/assets/site/product/light-overview.jpg.asset.json";
import productFleet from "@/assets/site/product/light-fleet.jpg.asset.json";
import productReports from "@/assets/site/product/light-publicReports.jpg.asset.json";
import productFacility from "@/assets/site/product/light-facility.jpg.asset.json";
import productFleetDark from "@/assets/site/product/dark-fleet.jpg.asset.json";
import productOverviewDark from "@/assets/site/product/dark-overview.jpg.asset.json";

import logoLight from "@/assets/brand/lawma-logo-light.png.asset.json";
import logoDark from "@/assets/brand/lawma-logo-dark.png.asset.json";

export const photos = {
  heroBridge,
  crewDawn,
  truckStreet,
  transferStation,
  recycling,
  lagoonDusk,
  controlRoom,
  marketMorning,
  household,
  academy,
  skylineNight,
};

export const films = {
  heroBridge: heroBridgeFilm.url,
  crewDawn: crewDawnFilm.url,
  controlRoom: controlRoomFilm.url,
};

/** Photographs from LAWMA's own field and press archive. */
export const field = {
  recyclingTour: field02.url,
  bridgeSweep: field05.url,
  olusosun: field24.url,
  binDrive1: field27.url,
  binDrive2: field28.url,
  binDrive3: field29.url,
  marineCleanup: field35.url,
};

export const product = {
  overview: productOverview.url,
  fleet: productFleet.url,
  reports: productReports.url,
  facility: productFacility.url,
  fleetDark: productFleetDark.url,
  overviewDark: productOverviewDark.url,
};

export const logos = {
  /** Black wordmark, for paper backgrounds. */
  onLight: logoLight.url,
  /** Paper wordmark, for ink backgrounds. */
  onDark: logoDark.url,
};
