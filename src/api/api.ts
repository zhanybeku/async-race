import type { CreateCar, EngineDriveResponse, EngineStartResponse } from "../ts/interfaces";

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

export const deleteCar = async (id: number) => {
    const response = await fetch(`${BASE_URL}/garage/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

const patchEngine = async (id: number, status: 'started' | 'stopped' | 'drive') => {
    const params = new URLSearchParams({ id: String(id), status });
    const response = await fetch(`${BASE_URL}/engine?${params}`, {
        method: 'PATCH',
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

export const startStopEngine = async (
    id: number,
    status: 'started' | 'stopped',
): Promise<EngineStartResponse> => {
    return patchEngine(id, status);
};

export const driveEngine = async (id: number): Promise<EngineDriveResponse> => {
    return patchEngine(id, 'drive');
};
