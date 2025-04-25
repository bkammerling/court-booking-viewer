'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic'
import { Venue, GroupedOption, Option } from '@/types';
import venuesJson from '@/venues.json';
const Select = dynamic(() => import('react-select'), { ssr: false })


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
    }, []);

    const onSelectChange = (option: readonly Option[]) => {
        const selectedOptions = option.map((opt) => opt.value);
        setSelectedVenues(selectedOptions);
    }

    const handleSearchClick = () => {
        if (selectedVenues.length === 0) {
            alert('Please select at least one venue.');
            return;
        }

        onSearch(selectedVenues, selectedDate); // Trigger the search function passed as a prop
    };

   
    return (
        <div className="searchbar bg-gray-100 dark:bg-gray-800 p-6 rounded shadow mb-4 md:flex gap-5">

            <div className="mb-3 md:mb-0">
                <label htmlFor="date" className="mr-2 font-semibold">Date</label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    className="border border-gray-300 rounded px-4 py-2 mt-2 block bg-white dark:bg-gray-700 text-black dark:text-white"
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                    }}
                />
            </div>
            
            <div className="mb-3 md:mb-0 grow">
                <label htmlFor="courtselect" className="mr-2 font-semibold">Courts</label>
                <Select                    
                    options={groupedVenues}
                    id="courtselect"
                    isMulti
                    closeMenuOnSelect={false}
                    onChange={(option) => onSelectChange(option as any)}
                    className="mt-2 block rounded"
                />
            </div>

            <button 
                className={`mt-4 px-10 py-2 bg-yellow-500 hover:bg-yellow-400 text-black transition rounded flex items-center justify-start gap-4 ${isFetching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => handleSearchClick()}
                disabled={isFetching}
            >
                <svg 
                    width="19" 
                    height="19" 
                    viewBox="0 0 19 19" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={isFetching ? 'animate-spin' : ''}
                >
                    <path d="M3.03094 2.56443C0.524809 5.07057 0.233398 7.51842 0.233398 7.51842C0.233398 7.51842 3.91895 8.38793 6.50386 5.50256C8.7426 3.00359 7.86837 0.116577 7.86837 0.116577C7.86837 0.116577 4.83769 0.757682 3.03094 2.56443Z" fill="black"/>
                    <path d="M16.0794 16.3837C18.5855 13.8776 18.877 11.4297 18.877 11.4297C18.877 11.4297 15.1914 10.5602 12.6065 13.4456C10.3678 15.9445 11.242 18.8315 11.242 18.8315C11.242 18.8315 14.2727 18.1904 16.0794 16.3837Z" fill="black"/>
                    <path d="M3.03081 16.6104C0.559645 14.6988 -0.0192912 10.8016 0.0584184 9.20859C1.55433 9.38344 5.10566 8.98712 7.3437 6.93558C9.58174 4.88405 9.7527 1.53476 9.55842 0C10.9572 0.194274 13.8363 0.594479 16.0278 2.50613C18.2192 4.41779 19.039 8.27607 18.9419 9.73313C17.6208 9.46115 14.3259 9.5 11.7149 11.8313C9.10382 14.1626 9.1893 17.5818 9.55842 19C8.37335 18.9223 5.50198 18.5221 3.03081 16.6104Z" fill="black"/>
                </svg>



                Search 
            </button>
        </div>        
    )
}

export default CourtForm;