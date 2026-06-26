export interface CreateCar {
    name: string;
    color: string;
}

export type EngineStatus = 'started' | 'stopped' | 'drive';

export interface EngineStartResponse {
    velocity: number;
    distance: number;
}

export interface EngineDriveResponse {
    success: boolean;
}