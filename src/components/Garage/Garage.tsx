import { useState, useEffect } from 'react';
import './garage.css';

interface Car {
    id: number;
    name: string;
    color: string;
}

const Garage = () => {
    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        setCars([
            { id: 1, name: 'Car 1', color: 'red' },
            { id: 2, name: 'Car 2', color: 'blue' },
            { id: 3, name: 'Car 3', color: 'green' },
        ]);
    }, []);

    return (
        <div>
            <div className='buttons-container'>
                <div className='race-buttons'>
                    <button>RACE</button>
                    <button>RESET</button>
                </div>
                <div className='car-creation-buttons'>
                    <textarea></textarea>
                    color picker
                    <button>CREATE</button>
                </div>
            </div>
            
            <table className='racetrack-table'>
                <tbody>
                    {cars.map((car, index) => (
                        <tr key={car.id}>
                            <td className='start-zone'>{car.name}</td>
                            {index === 0 && (
                                <td className='start-line' rowSpan={cars.length}>START</td>
                            )}
                            <td className='track'></td>
                            {index === 0 && (
                                <td className='finish-line' rowSpan={cars.length}>FINISH</td>
                            )}
                            <td className='finish-zone'></td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default Garage