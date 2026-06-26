import type { CreateCar } from "../ts/interfaces";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCars = async () => {
    const response = await fetch(`${BASE_URL}/garage`);
    return response.json();
};

export const createCar = async (car: CreateCar) => {
    const response = await fetch(`${BASE_URL}/garage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car),
    });

    return response.json();
};

export const updateCar = async (id: number, car: CreateCar) => {
    const response = await fetch(`${BASE_URL}/garage/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car),
    });
    return response.json();
};