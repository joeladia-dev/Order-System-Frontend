import { requestJson } from "./http";

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export function listProducts() {
  return requestJson<Product[]>("/api/products");
}

export function createProduct(input: Product, token: string) {
  return requestJson<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(input),
    token,
  });
}

export function updateStock(productId: string, stock: number, token: string) {
  return requestJson<Product>(
    `/api/products/${encodeURIComponent(productId)}/stock`,
    {
      method: "PUT",
      body: JSON.stringify({ stock }),
      token,
    },
  );
}
