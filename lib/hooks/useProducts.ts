// hooks/useProducts.ts
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api/products";

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProducts();
      console.log(data);
      setProducts(data);
    } catch (err) {
      setError("خطا در دریافت محصولات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (data: ProductFormData) => {
    await createProduct(data);
  };

  const editProduct = async (id: number, data: ProductFormData) => {
    await updateProduct(id, data);
  };

  const removeProduct = async (id: number) => {
    await deleteProduct(id);
    await loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    loadProducts,
    addProduct,
    editProduct,
    removeProduct,
  };
}
