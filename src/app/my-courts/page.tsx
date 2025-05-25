'use client';
import CourtList from '@/components/CourtList';

const MyCourts = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl mt-10">My courts</h1>
      <p className="text-lg my-3">
        Select your favourite courts and book them easily.
      </p>
      <div className="container">
        <CourtList />
      </div>
      

    </div>
  );
}

export default MyCourts;