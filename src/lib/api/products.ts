import { requestJson } from "./http";

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  isArchived?: boolean;
  archivedAtUtc?: string | null;
};

export type UpdateProductInput = {
  name: string;
  price: number;
  stock: number;
};

export function listProducts() {
  return requestJson<Product[]>("/api/products");
}

export function listArchivedProducts(token?: string) {
  return requestJson<Product[]>("/api/products/archived", { token });
}

export function createProduct(input: Product, token?: string) {
  return requestJson<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(input),
    token,
  });
}

export function updateStock(productId: string, stock: number, token?: string) {
  return requestJson<Product>(
    `/api/products/${encodeURIComponent(productId)}/stock`,
    {
      method: "PUT",
      body: JSON.stringify({ stock }),
      token,
    },
  );
}

export function updateProduct(
  productId: string,
  input: UpdateProductInput,
  token?: string,
) {
  return requestJson<Product>(
    `/api/products/${encodeURIComponent(productId)}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
      token,
    },
  );
}

export function archiveProduct(productId: string, token?: string) {
  return requestJson<Product>(
    `/api/products/${encodeURIComponent(productId)}/archive`,
    {
      method: "PUT",
      token,
    },
  );
}

export function restoreProduct(productId: string, token?: string) {
  return requestJson<Product>(
    `/api/products/${encodeURIComponent(productId)}/restore`,
    {
      method: "PUT",
      token,
    },
  );
}

export function deleteProductPermanently(productId: string, token?: string) {
  return requestJson<void>(`/api/products/${encodeURIComponent(productId)}`, {
    method: "DELETE",
    token,
  });
}
