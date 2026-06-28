export interface CreateCar {
    name: string;
    color: string;
}

export interface Car extends CreateCar {
    id: number;
}

export interface CarsQuery {
    _page?: number;
    _limit?: number;
}

export interface CarsResponse {
    cars: Car[];
    totalCount: number | null;
}

export type EngineStatus = 'started' | 'stopped' | 'drive';

export interface EngineStartResponse {
    velocity: number;
    distance: number;
}

export interface EngineDriveResponse {
    success: boolean;
}

export interface CreateWinner {
    id: number;
    wins: number;
    time: number;
}

export interface Winner extends CreateWinner {}

export interface UpdateWinner {
    wins: number;
    time: number;
}

export interface WinnersQuery {
    _page?: number;
    _limit?: number;
    _sort?: 'id' | 'wins' | 'time';
    _order?: 'ASC' | 'DESC';
}

export interface WinnersResponse {
    winners: Winner[];
    totalCount: number | null;
}