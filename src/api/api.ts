import type {
    CarsQuery,
    CarsResponse,
    CreateCar,
    CreateWinner,
    EngineDriveResponse,
    EngineStartResponse,
    UpdateWinner,
    Winner,
    WinnersQuery,
    WinnersResponse,
} from "../ts/interfaces";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCars = async (query: CarsQuery = {}): Promise<CarsResponse> => {
    const params = new URLSearchParams();

    if (query._page != null) params.set('_page', String(query._page));
    if (query._limit != null) params.set('_limit', String(query._limit));

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}/garage?${queryString}` : `${BASE_URL}/garage`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const totalCountHeader = response.headers.get('X-Total-Count');

    return {
        cars: await response.json(),
        totalCount: totalCountHeader != null ? Number(totalCountHeader) : null,
    };
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

export const createWinner = async (winner: CreateWinner): Promise<Winner> => {
    const response = await fetch(`${BASE_URL}/winners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(winner),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

export const getWinners = async (query: WinnersQuery = {}): Promise<WinnersResponse> => {
    const params = new URLSearchParams();

    if (query._page != null) params.set('_page', String(query._page));
    if (query._limit != null) params.set('_limit', String(query._limit));
    if (query._sort) params.set('_sort', query._sort);
    if (query._order) params.set('_order', query._order);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}/winners?${queryString}` : `${BASE_URL}/winners`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const totalCountHeader = response.headers.get('X-Total-Count');

    return {
        winners: await response.json(),
        totalCount: totalCountHeader != null ? Number(totalCountHeader) : null,
    };
};

export const getWinner = async (id: number): Promise<Winner> => {
    const response = await fetch(`${BASE_URL}/winners/${id}`);

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

export const updateWinner = async (id: number, winner: UpdateWinner): Promise<Winner> => {
    const response = await fetch(`${BASE_URL}/winners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(winner),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

export const deleteWinner = async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/winners/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }
};
