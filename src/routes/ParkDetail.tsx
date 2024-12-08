import React from 'react';
import { useParams } from 'react-router-dom';
import { Park } from '../types';

interface ParkDetailProps {
    parkList: Park[];
}

const ParkDetail: React.FC<ParkDetailProps> = ({ parkList }) => {
    const { parkId } = useParams<{ parkId: string }>();
    const park = parkList.find(p => p.id === parkId);

    if (!park) return <div>Park not found</div>;

    return (
        <div className="park-detail">
            <h1>{park.fullName}</h1>
            <div className="park-detail-content">
                <img 
                    src={park.image} 
                    alt={park.name}
                    onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.src = 'path/to/placeholder-image.jpg'; // add later (carousel)?
                    }}
                />
                <div className="park-info">
                    <h2>{park.designation}</h2>
                    <p><strong>State(s):</strong> {park.state}</p>
                    <p>{park.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ParkDetail;