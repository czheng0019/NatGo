import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";

import SignIn from './routes/signin';
import SignUp from './routes/signup';
import ParkGallery from './routes/ParkGallery';
import ParkDetail from './routes/ParkDetail';
import UserGallery from './routes/UserGallery';
import { Park } from './types';
  
function App() {
	const [parkList, setParkList] = useState<Park[]>([]);
	const [totalParksCount, setTotalParksCount] = useState(0);

	useEffect(() => {
		fetchAllParks(setParkList, setTotalParksCount);
	}, []);
	
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<SignIn />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/parks" element={<ParkGallery parkList={parkList} />} />
					<Route path="/parks/:id" element={<ParkDetail parkList={parkList}/>} />
					<Route path="/users/:id" element={<UserGallery parkList={parkList} totalParkCount={totalParksCount}/>} />
				</Routes>
			</div>
		</Router>
	);
}

const fetchAllParks = async (setParkList: React.Dispatch<React.SetStateAction<Park[]>>, setTotalParksCount: React.Dispatch<React.SetStateAction<number>>) => {
	const parks: Park[] = [];
	let url = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${process.env.REACT_APP_nps_api_key}`;
	
	while (url) {
		const response = await axios.get(url);
		const {data} = response;
		const totalParks = data.total;
		const fetchedParks = data.data.map((park: any) => ({
			id: park.id,
			fullName: park.fullName,
			name: park.name,
			designation: park.designation,
			description: park.description,
			state: park.states,
			image: park.images?.[0]?.url || null
		}));

		setTotalParksCount(totalParks);
		parks.push(...fetchedParks);
		url = data.meta?.nextPageUrl || null;
	}

	setParkList(parks);
}


export default App;