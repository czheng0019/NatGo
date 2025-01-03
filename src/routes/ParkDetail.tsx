import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Park } from '../types';
import '../styles/ParkDetail.css';

interface ParkDetailProps {
    parkList: Park[];
}

const ParkDetail: React.FC<ParkDetailProps> = ({ parkList }) => {
	const params = useParams();
    const navigate = useNavigate();
    const parkId = params.id;
    const park = parkList.find(p => p.id === parkId);
	const [checked, setChecked] = React.useState(false);
	const userId = localStorage.getItem("userId");

	useEffect(() => {
		const fetchCollectedParks = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_backend_url}/users/${userId}/collectedParks`, {
					method: "GET",
					credentials: "include",
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
			const response = await fetch(`${process.env.REACT_APP_backend_url}/parks/:id`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({userId, parkId, newChecked}),
				credentials: "include",
			});
	
			const result = await response.json();
	
			if (!response.ok) {
				console.log(result.message);
			}

		} catch (err) {
			console.log("failed to connect to the server");
		}
	};

	const handleGalleryClick = (): void => {
        navigate(`/parks`);
    };

    return (
        <div className="park-detail">
            <h1>{park.fullName}</h1>
			<button type="submit" onClick={handleGalleryClick}>Go To Gallery</button>
            <div className="park-detail-content">
				<div>
					<img 
						src={park.image} 
						alt={park.name}
						onError={(e) => {
							const imgElement = e.target as HTMLImageElement;
							imgElement.src = 'path/to/placeholder-image.jpg';
						}}
					/>
					<div className="checkbox-container">
						<label>
							<input
								type="checkbox"
								checked={checked}
								onChange={handleChange}
							/>
							I have been here!
						</label>
					</div>
					<div className="park-detail">
						<h3>{park.designation}</h3>
						<p><strong>State(s):</strong> {park.state}</p>
						<p>{park.description}</p>
					</div>
				</div>
			</div>
        </div>
    );
};

export default ParkDetail;