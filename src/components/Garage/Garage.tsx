import { useState, useEffect } from 'react';
import './garage.css';
import CarIcon from '../../assets/garage/car-top-view.svg?react';

import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import TextField from '@mui/material/TextField';

import { getCars } from '../../api/api';

interface Car {
    id: number;
    name: string;
    color: string;
}

const Garage = () => {
    // The cars state
    const [cars, setCars] = useState<Car[]>([]);
    
    // The new car's states
    const [newCarColor, setNewCarColor] = useState('#000000');
    const [newCarName, setNewCarName] = useState<string>('');

    // The states for the car that's being edited
    const [editId, setEditId] = useState<number | null>(null);
    const [editCarName, setEditCarName] = useState<string>('');
    const [editCarColor, setEditCarColor] = useState<string>('#000000');

    useEffect(() => {
        getCars().then(setCars);
    }, []);

    const onCarClick = (id: number) => {
        setEditId(id);
        setEditCarName(cars.find(car => car.id === id)?.name || '');
        setEditCarColor(cars.find(car => car.id === id)?.color || '#000000');
    }

    const onSaveCar = (id: number) => {
        console.log(id)
    }

    const onCreateCar = () => {
        console.log(newCarName, newCarColor)
    }

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

                    <span className='hover-text'>Click a car's name to edit it!</span>
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
                        value={newCarName}
                        onChange={(e) => setNewCarName(e.target.value)}
                    />

                    <input type="color" className='color-picker' value={newCarColor} onChange={(e) => setNewCarColor(e.target.value)} />

                    <Button variant="contained" sx={{ backgroundColor: 'var(--green)' }} onClick={onCreateCar}>
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

                            <td className='track'>
                                {editId === car.id ? (
                                    <div className='edit-car-container'>
                                        <TextField variant="outlined" size="small" 
                                            value={editCarName} 
                                            onChange={(e) => setEditCarName(e.target.value)}
                                            sx={{
                                                '& .MuiInputBase-input': { backgroundColor: 'white', borderRadius: '4px' },
                                            }}
                                        />

                                        <input type="color" className='color-picker' value={editCarColor} onChange={(e) => setEditCarColor(e.target.value)} />

                                        <Button variant="contained" sx={{ backgroundColor: 'var(--green)' }} onClick={() => onSaveCar(car.id)}>SAVE</Button>
                                        <Button variant="contained" sx={{ backgroundColor: 'var(--red)' }} onClick={() => setEditId(null)}>CANCEL</Button>


                                    </div>
                                ) : (
                                    <span className='car-name' onClick={() => onCarClick(car.id)}>{car.name}</span>
                                )}
                            </td>

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