import React, { forwardRef } from 'react';
import { Park } from '../types';
// import '../styles/ParkCard.css';

interface ParkCardProps {
    park: Park;
    isCollected: boolean;
    onToggle: (id: string) => Promise<void>;
}

const ParkCard = forwardRef<HTMLDivElement, ParkCardProps>(
    ({ park, isCollected, onToggle }, ref) => {
        return (
            <div ref={ref} className="park-card" onClick={() => console.log(`Park clicked: ${park.id}`)}>
                <div className="image-container">
                    <img
                        src={park.image}
                        alt={""}
                        onError={(e) => {
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.src = '/path/to/placeholder-image.jpg';
                        }}
                    />
                    <div className="collected-park-check">
                        <label>
                            <input
                                type="checkbox"
                                checked={isCollected}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    onToggle(park.id);
                                }}
                            />
                        </label>
                    </div>
                </div>
                <div className="park-info">
                    <h3>{park.name}</h3>
                </div>
            </div>
        );
    }
);

export default ParkCard;
