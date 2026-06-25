import { useState, useEffect } from 'react';
import './garage.css';
import CarIcon from '../../assets/garage/car-top-view.svg?react';

import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import TextField from '@mui/material/TextField';

interface Car {
    id: number;
    name: string;
    color: string;
}

const Garage = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [color, setColor] = useState('#000000');

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
                    <Button variant="contained" startIcon={<PlayArrowIcon />} sx={{ backgroundColor: 'var(--red)' }}>
                        START
                    </Button>

                    <Button variant="contained" startIcon={<ReplayIcon />} sx={{ backgroundColor: 'var(--blue)' }}>
                        RESET
                    </Button>
                </div>

                <div className='car-creation-buttons'>
                    <TextField label="Car name" variant="outlined" size="small"
                        sx={{
                            '& .MuiInputBase-input': { backgroundColor: 'white', borderRadius: '4px' },
                            '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                                backgroundColor: 'white',
                                padding: '0 7px',
                                marginLeft: '-4px',
                                borderRadius: '4px',
                            }
                        }}
                    />

                    <input type="color" className='color-picker' value={color} onChange={(e) => setColor(e.target.value)} />

                    <Button variant="contained" sx={{ backgroundColor: 'var(--green)' }}>
                        CREATE
                    </Button>

                </div>
            </div>

            <table className='racetrack-table'>
                <tbody>
                    {cars.map((car, index) => (
                        <tr key={car.id}>
                            <td className='start-zone'>
                                {/* {car.name} */}
                                <CarIcon
                                    className="carIcon"
                                    width={40} height={40}
                                    fill={car.color}
                                    stroke="white"
                                    strokeWidth={0.5}
                                />
                            </td>
                            {index === 0 && (
                                <td className='start-line' rowSpan={cars.length}>START</td>
                            )}
                            <td className='track'>{car.name}</td>
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