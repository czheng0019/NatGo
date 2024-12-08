import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	useNavigate,
	useParams
} from "react-router-dom";

var secrets = require('./secrets.js');

interface Park {
	id: string;
	fullName: string;
	name: string;
	designation: string;
	description: string;
	state: string;
	image: string;
}
  
function App() {

	const [parkList, setParkList] = useState<Park[]>([]);

	useEffect(() => {
		fetchAllParks(setParkList);
	}, []);
	
	return (
		<Router>
			<div className="App">
				<ul>
					{parkList.map((park) => (
						<li key={park.id}>
							<p>{park.name}</p>
							<img src={park.image} alt={park.name} />
						</li>
					))}
				</ul>
			</div>
		</Router>
	);
}

const fetchAllParks = async (setParkList: React.Dispatch<React.SetStateAction<Park[]>>) => {
	const parks: Park[] = [];
	let url = "https://developer.nps.gov/api/v1/parks?limit=500&api_key=" + secrets.nps_api_key;
	
	while (url) {
		const response = await axios.get(url);
		const {data} = response;
		const fetchedParks = data.data.map((park: any) => ({
			id: park.id,
			fullName: park.fullName,
			name: park.name,
			designation: park.designation,
			description: park.description,
			state: park.state,
			image_url: park.images[0].url
		}));

		parks.push(...fetchedParks);
		url = data.meta?.nextPageUrl || null;
	}

	setParkList(parks);
}


export default App;
