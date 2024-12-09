import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Park } from '../types';

interface ParkDetailProps {
    parkList: Park[];
}

const ParkDetail: React.FC<ParkDetailProps> = ({ parkList }) => {
	const params = useParams();
    const parkId = params.id;
    const park = parkList.find(p => p.id === parkId);
	const [checked, setChecked] = React.useState(false);
	const userId = localStorage.getItem("userId");

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

				setChecked(result.collectedParks.includes(parkId));
		
			} catch (err) {
				console.log("failed to connect to the server: " + err);
			}
		};
		
		if (userId) {
			fetchCollectedParks();
		}
	}, [userId, parkId]);

    if (!park) return <div>Park not found</div>;

	const handleChange = async () => {
		const newChecked = !checked;
		setChecked(newChecked);

		try {
			const response = await fetch("http://localhost:1000/parks/:id", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({userId, parkId, newChecked})
			});
	
			const result = await response.json();
	
			if (!response.ok) {
				console.log(result.message);
			}

		} catch (err) {
			console.log("failed to connect to the server");
		}
	};

    return (
        <div className="park-detail">
            <h1>{park.fullName}</h1>
            <div className="park-detail-content">
				<div>
					<label>
						<input
							type="checkbox"
							checked={checked}
							onChange={handleChange}
						/>
						I have been here:
					</label>
				</div>
				<div>
					<img 
						src={park.image} 
						alt={park.name}
						onError={(e) => {
							const imgElement = e.target as HTMLImageElement;
							imgElement.src = 'path/to/placeholder-image.jpg'; // add later (carousel)?
						}}
					/>
					<div className="park-detail">
						<h2>{park.designation}</h2>
						<p><strong>State(s):</strong> {park.state}</p>
						<p>{park.description}</p>
					</div>
				</div>
            </div>
        </div>
    );
};

export default ParkDetail;