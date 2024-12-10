import React, { useEffect, useState } from 'react';
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
	const userId = localStorage.getItem("userId");
	const [collectedParks, setCollectedParks] = useState<string[]>([]);

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

	useEffect(() => {
		const fetchCollectedParks = async () => {
			try {
				const response = await fetch(`http://localhost:1000/users/${userId}/collectedParks`, {
					method: "GET",
				});

				const result = await response.json();
		
				if (!response.ok) {
					console.log(result.message);
				}

				setCollectedParks(result.collectedParks);
				console.log("Collected parks:", result.collectedParks);
		
			} catch (err) {
				console.log("failed to connect to the server: " + err);
			}
		};
		
		if (userId) {
			fetchCollectedParks();
		}
	}, [userId]);

	const handleChange = async (parkId: string) => {
		const isChecked = collectedParks.includes(parkId);
        const updatedCollectedParks = isChecked
            ? collectedParks.filter(id => id !== parkId)
            : [...collectedParks, parkId];

        setCollectedParks(updatedCollectedParks);

		try {
			const response = await fetch("http://localhost:1000/parks/:id", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({userId, parkId, newChecked: !isChecked})
			});
	
			const result = await response.json();
	
			if (!response.ok) {
				console.log(result.message);
			}

		} catch (err) {
			console.log("failed to connect to the server");
		}
	};

    const handleParkClick = (parkId: string) => {
        navigate(`/parks/${parkId}`);
    };

	const handleUserClick = (): void => {
        navigate(`/users/${userId}`);
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
				<button type="submit" onClick={handleUserClick}>Go To User Profile</button>
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
							<div className="collected-park-check">
								<label>
									<input
										type="checkbox"
										checked={collectedParks.includes(park.id)}
										onClick={(e) => e.stopPropagation()}
										onChange={(e) => {
											e.stopPropagation();
											handleChange(park.id);
										}}
									/>
								</label>
							</div>
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