'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import { Venue, GroupedOption, Option } from '@/types';
import venuesJson from '@/venues.json';
const Select = dynamic(() => import('react-select'), { ssr: false })


function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
        };

        handleResize(); // Check on initial render
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

/* 
 * Renders a court selection form from our venues.json file
*/

const CourtForm = ({ onSearch, isFetching }: { onSearch: (selectedVenues: string[], selectedDate: string) => void, isFetching: boolean }) => {
    // Create a state object to manage venues with their slug and a boolean
    const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const isMobile = useIsMobile();
    
    // Group venues by area
    const groupedVenues: GroupedOption[] = venuesJson.reduce((acc: GroupedOption[], venue: Venue) => {
        const area = venue.area || 'Unknown'; // Default to 'Unknown' if no area is provided
        let group = acc.find((group) => group.label === area);
        if (!group) {
            group = { label: area, options: [] };
            acc.push(group);
        }
        group.options.push({ value: venue.slug, label: venue.name });
        return acc;
    }, []);

    const handleAddCourt = (value: string) => {
        if(selectedVenues.includes(value)) {
            handleRemoveCourt(value);
            return;
        }
        setSelectedVenues((prev: string[]) => [...prev, value]);
    };

    const handleRemoveCourt = (value: string) => {
        setSelectedVenues((prev: string[]) => prev.filter((v) => v !== value));
    };

    const handleSearchClick = () => {
        if (selectedVenues.length === 0) {
            alert('Please select at least one venue.');
            return;
        }

        onSearch(selectedVenues, selectedDate); // Trigger the search function passed as a prop
    };


    return (
        <div className="searchbar bg-gray-100 dark:bg-gray-800 p-5 rounded shadow my-4 md:grid md:grid-cols-6 gap-5">

            <div className="mb-3 md:mb-0">
                <label htmlFor="date" className="mr-2 font-semibold">Date</label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    className="border border-gray-300 rounded-full px-4 py-3 mt-1 block bg-white dark:bg-gray-700 text-black dark:text-white w-full appearance-none"
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                    }}
                />
            </div>
            
            <div className="mb-3 md:mb-0 col-span-4">
                <label htmlFor="courtselect" className="mr-2 font-semibold">Courts</label>
                
                    <CourtSelectorModal 
                        groupedVenues={groupedVenues} 
                        selectedVenues={selectedVenues} 
                        handleAddCourt={handleAddCourt}
                        handleRemoveCourt={handleRemoveCourt}
                    />
                {/*
                    <Select
                        options={groupedVenues}
                        id="courtselect"
                        isMulti
                        closeMenuOnSelect={false}
                        blurInputOnSelect={false}
                        isSearchable={false}
                        onChange={(option) => onSelectChange(option as any)}
                        placeholder="Select courts"
                        minMenuHeight={700}
                        classNames={{
                            control: () => 'px-2 py-015 mt-2',
                        }}
                    />
                    */}
                
            </div>
            
            <div className={`self-end`}>
                <button 
                    className={`mt-5 px-4 w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black transition rounded-full flex items-center justify-between gap-2 ${isFetching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => handleSearchClick()}
                    disabled={isFetching}
                >
                    Search
                    <svg 
                        viewBox="0 0 19 19" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
                    >
                        <path d="M3.03094 2.56443C0.524809 5.07057 0.233398 7.51842 0.233398 7.51842C0.233398 7.51842 3.91895 8.38793 6.50386 5.50256C8.7426 3.00359 7.86837 0.116577 7.86837 0.116577C7.86837 0.116577 4.83769 0.757682 3.03094 2.56443Z" fill="black"/>
                        <path d="M16.0794 16.3837C18.5855 13.8776 18.877 11.4297 18.877 11.4297C18.877 11.4297 15.1914 10.5602 12.6065 13.4456C10.3678 15.9445 11.242 18.8315 11.242 18.8315C11.242 18.8315 14.2727 18.1904 16.0794 16.3837Z" fill="black"/>
                        <path d="M3.03081 16.6104C0.559645 14.6988 -0.0192912 10.8016 0.0584184 9.20859C1.55433 9.38344 5.10566 8.98712 7.3437 6.93558C9.58174 4.88405 9.7527 1.53476 9.55842 0C10.9572 0.194274 13.8363 0.594479 16.0278 2.50613C18.2192 4.41779 19.039 8.27607 18.9419 9.73313C17.6208 9.46115 14.3259 9.5 11.7149 11.8313C9.10382 14.1626 9.1893 17.5818 9.55842 19C8.37335 18.9223 5.50198 18.5221 3.03081 16.6104Z" fill="black"/>
                    </svg>
                     
                </button>
            </div>
        </div>        
    )
}


const CourtSelectorModal = ({ groupedVenues, selectedVenues, handleAddCourt, handleRemoveCourt }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="flex  justify-between border border-gray-300 rounded-full max-w-full px-4 py-3 mt-1 block bg-white dark:bg-gray-700 text-black dark:text-white cursor-pointer"
            >
                {selectedVenues.length > 0 ? (
                    <div className="flex gap-2 overflow-hidden  max-w-full">
                        <TagList 
                            selectedVenues={selectedVenues} 
                            handleRemoveCourt={handleRemoveCourt} 
                        />
                    </div>
                ) : (
                    <span className="text-gray-500">Select courts</span>
                )}
                {/* Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-360 280-560h400L480-360Z"/></svg>
            </div>

            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 flex justify-center items-center"
                    onClick={() => setIsModalOpen(false)} // Close modal when clicking on the overlay
                >
                    <div 
                        className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-11/12 max-w-2xl grid grid-cols-2 h-5/6"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                    >
                        <h3 className="text-xl font-semibold mb-1 col-span-2">Select Courts</h3>
                        {/* Available Courts List */}
                        <div className="max-h-full overflow-y-auto mt-2 pr-3">
                            {groupedVenues.map((group: any, index: number) => (
                                <>
                                    <h4 className={`text-xs mb-2 uppercase sticky top-0 bg-gray-100 dark:bg-gray-700 p-2 shadow-md rounded ${index !== 0 ? 'mt-2' : ''}`}>{group.label}</h4>
                                    {group.options.map((option: any) => {
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => handleAddCourt(option.value)}
                                                className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200"
                                            >
                                                {option.label}
                                                {selectedVenues.includes(option.value) && (
                                                    <span className="text-green-500 pl-2">✔</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-start content-start gap-1 pl-1">
                            <TagList 
                                selectedVenues={selectedVenues} 
                                handleRemoveCourt={handleRemoveCourt} 
                            />
                        </div>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded col-span-2 cursor-pointer"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const TagList = ({ selectedVenues, handleRemoveCourt }: { selectedVenues: string[], handleRemoveCourt: any }) => {
    return (
        <>
        {selectedVenues.map((value: string) => {
            // Find the venue name from the groupedVenues
            const venue = venuesJson.find((element: Venue) => element.slug === value);
            if (!venue) return null; // Skip if not found
            return (
                <div
                    key={value}
                    className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2 text-sm text-gray-700 overflow-hidden"
                >
                    <span className="truncate">{venue.name}</span>
                    <button
                        onClick={(e) => { 
                            e.stopPropagation(); // Prevent the event from bubbling to the parent
                            handleRemoveCourt(value)
                        }}
                        className="text-gray-500 hover:text-red-700 pl-2 border-l border-gray-300 cursor-pointer"
                    >
                        &times;
                    </button>
                </div>
            )
        })}
        </>
    )
}


export default CourtForm;