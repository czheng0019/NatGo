import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Park } from '../types';
import '../styles/ParkGallery.css';
import ParkCard from './parkcard';
import 'font-awesome/css/font-awesome.min.css';


interface ParkGalleryProps {
    parkList: Park[];
}

const ParkGallery: React.FC<ParkGalleryProps> = ({ parkList }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const userId = localStorage.getItem('userId');
    const [currentPage, setCurrentPage] = useState(0);
    const parksPerPage = 24;

    // Filter parks based on search term and state
    const filteredParks = parkList.filter(
        (park) =>
            park.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (stateFilter === '' || park.state.includes(stateFilter))
    );

    // Paginated parks
    const paginatedParks = filteredParks.slice(0, (currentPage + 1) * parksPerPage);

    // Unique states for the dropdown filter
    const uniqueStates = Array.from(
        new Set(parkList.flatMap((park) => park.state.split(',').map((s) => s.trim())))
    ).sort();

    // Navigate to user profile
    const handleUserClick = (): void => {
        navigate(`/users/${userId}`);
    };

    // Handle Next Button Click
    const handleNext = () => {
        if ((currentPage + 1) * parksPerPage < filteredParks.length) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <div className="park-gallery">
            <div className="filters">
				<header>
                <input
                    type="text"
                    placeholder="Search parks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
				<select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
                    <option value="">All States</option>
                    {uniqueStates.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
				<button className="user_profile_button" onClick={handleUserClick}>
					<i className="fa fa-user"></i> {/* Font Awesome icon */}
                </button>
				</header>
            </div>

            <div className="parks-grid">
                {paginatedParks.map((park) => (
                    <ParkCard
                        key={park.id}
                        park={park}
                    />
                ))}
            </div>

            {paginatedParks.length < filteredParks.length && (
                <button onClick={handleNext} className="next-button">
                    Load More
                </button>
            )}
        </div>
    );
};

export default ParkGallery;
