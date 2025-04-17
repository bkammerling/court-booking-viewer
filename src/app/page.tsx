import Image from "next/image";
import CourtForm from "@/components/CourtForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl my-10">London Tennis Court Booker</h1>
      <CourtForm />
    </div>
  );
}
