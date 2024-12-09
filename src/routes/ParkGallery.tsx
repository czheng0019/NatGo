import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Park } from '../types';
import '../styles/ParkGallery.css';

interface ParkGalleryProps {
    parkList: Park[];
}

const ParkGallery: React.FC<ParkGalleryProps> = ({ parkList }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [stateFilter, setStateFilter] = useState('');

    const filteredParks = parkList.filter(park => 
        park.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (stateFilter === '' || park.state.includes(stateFilter))
    );

    const uniqueStates = Array.from(
        new Set(
            parkList.flatMap(park => 
                park.state.split(',').map(s => s.trim())
            )
        )
    ).sort();

    const handleParkClick = (parkId: string) => {
        navigate(`/parks/${parkId}`);
    };

    return (
        <div className="park-gallery">
            <div className="filters">
                <input 
                    type="text" 
                    placeholder="Search parks..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    value={stateFilter} 
                    onChange={(e) => setStateFilter(e.target.value)}
                >
                    <option value="">All States</option>
                    {uniqueStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>

            <div className="parks-grid">
                {filteredParks.map(park => (
                    <div 
                        key={park.id} 
                        className="park-card" 
                        onClick={() => handleParkClick(park.id)}
                    >
						<div className="image-container">
							<img 
								src={park.image} 
								alt=""
								onError={(e) => {
									const imgElement = e.target as HTMLImageElement;
									imgElement.src = 'path/to/placeholder-image.jpg'; // add later (or add carousel?)
								}}
							/>
							<div className="park-info">
								<h3>{park.name}</h3>
							</div>
						</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParkGallery;