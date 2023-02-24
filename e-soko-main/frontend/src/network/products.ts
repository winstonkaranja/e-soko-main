import { fetchData } from "./fetchData";
import { Product } from "../models/product";

export async function queryProducts(query: string): Promise<Product[]> {
    const response = await fetchData(`/api/v1/products/query/${query}`);
    return response.json();
}

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetchData(`/api/v1/products`);
    return response.json();
}
