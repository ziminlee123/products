'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabaseApi } from '../lib/supabase';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 초기 상품 데이터 로드
  useEffect(() => {
    loadProducts();
  }, []);

  // Supabase에서 상품 목록 가져오기
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseApi.products.getAll();
      setProducts(data || []);
    } catch (err) {
      console.error('상품 로드 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 새 상품 추가 함수
  const addProduct = async (newProductData) => {
    try {
      setLoading(true);
      const productToAdd = {
        title: newProductData.title,
        description: newProductData.description,
        price: newProductData.price || 0,
        image_url: newProductData.image_url || null
      };

      const newProduct = await supabaseApi.products.create(productToAdd);
      
      // 로컬 상태 업데이트
      setProducts(prevProducts => [newProduct, ...prevProducts]);
      return newProduct;
    } catch (err) {
      console.error('상품 추가 실패:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 상품 삭제 함수
  const removeProduct = async (productId) => {
    try {
      await supabaseApi.products.delete(productId);
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    } catch (err) {
      console.error('상품 삭제 실패:', err);
      setError(err.message);
      throw err;
    }
  };

  // 상품 업데이트 함수
  const updateProduct = async (productId, updatedData) => {
    try {
      const updatedProduct = await supabaseApi.products.update(productId, updatedData);
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err) {
      console.error('상품 업데이트 실패:', err);
      setError(err.message);
      throw err;
    }
  };

  // 상품 검색 함수
  const searchProducts = async (query) => {
    try {
      setLoading(true);
      const data = await supabaseApi.products.search(query);
      return data;
    } catch (err) {
      console.error('상품 검색 실패:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 호환성을 위한 데이터 변환 함수 (기존 컴포넌트와 호환)
  const transformProduct = (product) => ({
    ...product,
    // 기존 컴포넌트가 기대하는 필드명으로 변환
    image: product.image_url,
    timeAgo: "방금 전", // 심플 버전에서는 고정값
    location: "합정동", // 심플 버전에서는 고정값
    status: product.price === 0 ? "나눔" : "판매중",
    isNanum: product.price === 0,
    likes: 0, // 심플 버전에서는 기본값
    comments: 0 // 심플 버전에서는 기본값
  });

  // 변환된 상품 목록
  const transformedProducts = products.map(transformProduct);

  const value = {
    products: transformedProducts,
    loading,
    error,
    addProduct,
    removeProduct,
    updateProduct,
    searchProducts,
    refreshProducts: loadProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}; 