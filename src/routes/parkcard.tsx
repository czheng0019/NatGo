import React, { forwardRef, useEffect, useState } from 'react';
import { Park } from '../types';
import { useNavigate } from 'react-router-dom';
import '../styles/parkcard.css';

interface ParkCardProps {
    park: Park;
}

const ParkCard = forwardRef<HTMLDivElement, ParkCardProps>(
    ({ park }, ref) => {
		const navigate = useNavigate();
		const userId = localStorage.getItem('userId');
		const [collectedParks, setCollectedParks] = useState<string[]>([]);

		// Navigate to park details
        const handleParkClick = (parkId: string) => {
			navigate(`/parks/${parkId}`);
        };


    	// Fetch collected parks
		useEffect(() => {
			const fetchCollectedParks = async () => {
				try {
					const response = await fetch(`${process.env.REACT_APP_backend_url}/users/${userId}/collectedParks`, {
						method: 'GET',
						credentials: "include",
					});

					const result = await response.json();

					if (!response.ok) {
						console.log(result.message);
					}

					setCollectedParks(result.collectedParks);
					console.log('Collected parks:', result.collectedParks);
				} catch (err) {
					console.log('Failed to connect to the server:', err);
				}
			};

			if (userId) {
				fetchCollectedParks();
			}
		}, [userId]);

		// Handle checkbox toggle
		const handleChange = async (parkId: string) => {
			const isChecked = collectedParks.includes(parkId);
			const updatedCollectedParks = isChecked
				? collectedParks.filter((id) => id !== parkId)
				: [...collectedParks, parkId];
	
			setCollectedParks(updatedCollectedParks);
	
			try {
				const response = await fetch(`${process.env.REACT_APP_backend_url}/parks/:id`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ userId, parkId, newChecked: !isChecked }),
					credentials: "include",
				});
	
				const result = await response.json();
	
				if (!response.ok) {
					console.log(result.message);
				}
			} catch (err) {
				console.log('Failed to connect to the server');
			}
		};

        return (
            <div ref={ref} className="park-card" onClick={() => handleParkClick(park.id)}>
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
        );
    }
);

export default ParkCard;
