import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Park } from '../types';
import '../styles/ParkGallery.css';

interface UserGalleryProps {
    parkList: Park[];
	totalParkCount: number;
}

const UserGallery: React.FC<UserGalleryProps> = ({ parkList, totalParkCount }) => {
    const navigate = useNavigate();
	const userId = localStorage.getItem("userId");
	const [collectedParks, setCollectedParks] = useState<string[]>([]);
	const [username, setUsername] = useState<string>();
	const [parkCount, setParkCount] = useState<number>();

	useEffect(() => {
		const fetchUsername = async () => {
			try {
				const response = await fetch(`http://localhost:1000/users/${userId}`, {
					method: "GET",
				});

				const result = await response.json();
		
				if (!response.ok) {
					console.log(result.message);
				}

				setUsername(result.username);
				console.log(result.username);
		
			} catch (err) {
				console.log("failed to connect to the server: " + err);
			}
		};
		
		if (userId) {
			fetchUsername();
		}
	}, [userId]);

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
				setParkCount(result.collectedParks.length)
				console.log("Collected parks:", result.collectedParks);
		
			} catch (err) {
				console.log("failed to connect to the server: " + err);
			}
		};
		
		if (userId) {
			fetchCollectedParks();
		}
	}, [userId]);

	const handleGalleryClick = (): void => {
        navigate(`/parks`);
    };

	const handleSignoutClick = (): void => {
        navigate(`/`);
		localStorage.removeItem("userId");
    };

    return (
		<div className="user-profile">
			<div className="user-info">
				<div className="user-name">
					Hi {username}
				</div>
				<button type="submit" onClick={handleGalleryClick}>Go To Gallery</button>
				<button type="submit" onClick={handleSignoutClick}>Signout</button>
				<div className="park-count">Collected Parks: {parkCount} / {totalParkCount} </div>
			</div>
			<div className="park-gallery">
	
				<div className="parks-grid">
					{parkList.map((park, index) => (
						<div 
							key={park.id} 
							className="user-park-card" 
						>
							<div className="image-container">
								{collectedParks.includes(park.id) ? (
									<img 
										src={park.image} 
										alt=""
										onError={(e) => {
											const imgElement = e.target as HTMLImageElement;
											imgElement.src = 'path/to/placeholder-image.jpg'; // add later (or add carousel?)
										}}
									/>
                                ) : (
									<div className="park-number">
										<div>{index + 1}</div>
									</div>
								)}
								{collectedParks.includes(park.id) && (
									<div className="park-info">
										<h3>{park.name}</h3>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
        	</div>
		</div>
    );
};

export default UserGallery;