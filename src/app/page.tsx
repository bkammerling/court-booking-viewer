'use client';

import CourtForm from "@/components/CourtForm";
//import CourtBooking from "@/components/CourtBooking";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  return (
      <Map />
  );
}
