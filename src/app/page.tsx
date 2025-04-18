import CourtBooking from "@/components/CourtBooking";

export default function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl my-10">Search any court</h1>
      <CourtBooking  />
    </div>
  );
}
