const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCars = async () => {
    const response = await fetch(`${BASE_URL}/garage`);
    return response.json();
};