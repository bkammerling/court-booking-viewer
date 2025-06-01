'use client';
import { useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { Venue, GroupedOption } from '@/types';
import venuesJson from '@/venues.json';
import FavoriteIcon from './global/FavoriteIcon';


/* 
 * Renders a court selection form from our venues.json file
*/

const CourtForm = ({ onSearch, isFetching }: { onSearch: (selectedVenues: string[], selectedDate: string) => void, isFetching: boolean }) => {
    // Create a state object to manage venues with their slug and a boolean
    const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
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
    }, []).map((group) => {
        // Sort the options alphabetically by label
        group.options.sort((a, b) => a.label.localeCompare(b.label));
        return group;
    });;

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
        <div className="searchbar bg-gray-100 dark:bg-gray-800 p-5 rounded shadow my-4 sm:grid sm:grid-cols-3 md:grid-cols-6 gap-5">
            
            <div className="mb-3 sm:mb-0 md:col-span-2 lg:col-span-3">
                <label htmlFor="courtselect" className="mr-2 font-semibold">Courts</label>
                
                    <CourtSelectorModal 
                        groupedVenues={groupedVenues} 
                        selectedVenues={selectedVenues} 
                        handleAddCourt={handleAddCourt}
                        handleRemoveCourt={handleRemoveCourt}
                        setSelectedVenues={setSelectedVenues}
                    />
            </div>

            <div className="mb-3 sm:mb-0 md:col-span-3 lg:col-span-2">
                <label htmlFor="date" className="mr-2 font-semibold">Date</label>
                <div className="flex mt-1 border border-gray-300 rounded-full bg-white px-2 justify-around overflow-x-scroll">
                    {Array.from({ length: 8 }).map((_, index) => {
                        const date = new Date();
                        date.setDate(date.getDate() + index);
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0); // First letter of the day
                        const dayNumber = date.getDate();
                        const isSelected = selectedDate === date.toISOString().split('T')[0];

                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                                disabled={index === 7 && new Date().getHours() < 22} // Disable the last button if it's before 10 PM
                                className={`flex flex-col items-center justify-center px-2 py-1 w-[35px] ${
                                    isSelected ? 'bg-yellow-500 text-black' : 'dark:bg-gray-700 text-gray-700 dark:text-white'
                                } ${
                                    index === 7 && new Date().getHours() < 22 ? 'cursor-default opacity-50' : 'cursor-pointer'
                                }`}
                            >
                                <span className="text-xs font-semibold text-gray-500">{dayName}</span>
                                <span className={`${index == 0 ? 'font-bold' : ''}`}>{dayNumber}</span>
                            </button>
                        );
                    })}
                </div>
                <input
                    type="hidden"
                    id="date"
                    value={selectedDate}
                    className="min-w-min border border-gray-300 rounded-full px-4 py-3 mt-1 block bg-white dark:bg-gray-700 text-black dark:text-white w-full appearance-none"
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                    }}
                />
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

const CourtSelectorModal = ({ groupedVenues, selectedVenues, handleAddCourt, handleRemoveCourt, setSelectedVenues }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const favorites = useFavorites().favorites;

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="flex  justify-between border border-gray-300 rounded-full max-w-full px-4 py-3 mt-1 bg-white dark:bg-gray-700 text-black dark:text-white cursor-pointer"
            >
                {selectedVenues.length > 0 ? (
                    <span className="truncate">{selectedVenues.length} courts selected</span>
                ) : (
                    <span className="text-gray-500">Select courts</span>
                )}
                {/* Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-360 280-560h400L480-360Z"/></svg>
            </div>

            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 flex justify-center items-center z-100"
                    onClick={() => setIsModalOpen(false)} // Close modal when clicking on the overlay
                >
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-2xl grid grid-cols-2 h-5/6"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                    >
                        <h3 className="font-semibold py-2 mb-2 text-sm col-span-2 text-center border-b border-gray-200">Select Courts</h3>
                        {/* Available Courts List */}
                        <div className="max-h-full overflow-y-auto px-3 col-span-2">
                            <div className="flex items-cente justify-between gap-3 mb-2 border-b border-gray-200 ">
                                { favorites.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setSelectedVenues(favorites);
                                            setIsModalOpen(false);
                                        }}
                                        className={`flex gap-2 text-left mb-3 mr-3 text-sm px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border border-gray-300 rounded-lg`}
                                    >
                                        
                                        <svg
                                            className={`text-gray-500`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/>
                                        </svg>
                                        Select your favorite courts
                                    </button>
                                )}

                                { selectedVenues.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setSelectedVenues([]);
                                        }}
                                        className={`flex gap-2 text-left mb-3 mr-3 text-sm px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border border-gray-300 rounded-lg`}
                                    >
                                        Clear selection
                                        <span className='text-xl leading-none font-bold'>&times;</span>
                                    </button>
                                )}
                            </div>
                            
                            {groupedVenues.map((group: any, index: number) => (
                                <div key={group.label}>
                                    
                                    <h4 className={`font-semibold top-0 pt-2 pb-3  ${index !== 0 ? 'mt-2' : ''}`}>
                                        {group.label}
                                    </h4>

                                    {group.options.map((option: any) => {
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => handleAddCourt(option.value)}
                                                className={`flex-inline text-left mb-3 mr-3 text-sm px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border rounded-full ${selectedVenues.includes(option.value) ? 'outline-1 outline-gray-500 bg-gray-50 dark:outline-gray-300 dark:bg-gray-600' : 'border-gray-200'}`}
                                            >
                                                {option.label}
                                                {selectedVenues.includes(option.value) && (
                                                    <span className="text-green-600 hidden pl-2">✔</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className="hidden mid:flex flex-wrap items-start content-start gap-1 pl-1 ">
                            <TagList 
                                selectedVenues={selectedVenues} 
                                handleRemoveCourt={handleRemoveCourt} 
                            />
                        </div>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded col-span-2 cursor-pointer"
                        >
                            Choose { selectedVenues.length || '' } court{ selectedVenues.length > 1 && 's' }
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
                    className="bg-gray-200 px-3 py-2 rounded flex items-center gap-2 text-sm text-gray-700 overflow-hidden"
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