import axios, { AxiosResponse } from "axios";

export interface PotatoItem {
    id?: number;
    name: string;
    hourlyPay: number;
    hoursPerWeek: number;
    potatoPriceAtConversion: number;
    employmentType: string;
    experienceLevel: string;
}

// Base URL is proxied in vite.config.ts:  /api http://localhost:8080
const BASE = "/api/potatoes";


// POST
export const createPotatoItem = (item: Omit<PotatoItem, "id">) =>
    axios.post(BASE, item).then((r: AxiosResponse<PotatoItem>) => r.data);

// GET
export const getAllPotatoes = () =>
    axios.get(BASE).then((r: AxiosResponse<PotatoItem[]>) => r.data);

// GET by ID
export const getPotatoById = (id: number) =>
    axios.get(`${BASE}/${id}`).then((r: AxiosResponse<PotatoItem>) => r.data);

// PUT
export const updatePotatoItem = (id: number, item: PotatoItem) =>
    axios.put(`${BASE}/${id}`, item).then((r: AxiosResponse<PotatoItem>) => r.data);

// DELETE
export const deletePotatoItem = async (id: number) => {
    await axios.delete(`${BASE}/${id}`);
    return "item deleted";
};
