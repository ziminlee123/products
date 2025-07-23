'use client';

import { useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { useProducts } from '../../context/ProductsContext';

export default function ProductsPage() {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentLocation, setCurrentLocation] = useState('합정동');

  const categories = ['전체', '동네소식', '냉방기기', '중고거래'];

  const filteredProducts = selectedCategory === '전체' 
    ? products 
    : selectedCategory === '냉방기기'
    ? products.filter(product => product.title.includes('에어컨') || product.title.includes('선풍기'))
    : selectedCategory === '중고거래'
    ? products.filter(product => !product.isNanum)
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button className="flex items-center text-gray-900 font-medium text-lg">
              <span>{currentLocation}</span>
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="relative text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h5v-5H4v5zM13 7h5V2l-5 5zM4 9h5V4H4v5z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
            </button>
          </div>
        </div>
        
        {/* 카테고리 탭 */}
        <div className="flex px-4 pb-3">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 mr-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-gray-200 text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${index === 0 ? 'bg-gray-300 text-gray-900' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 리스트 */}
      <div className="divide-y divide-gray-200">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-gray-400 text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              등록된 게시글이 없어요
            </h3>
            <p className="text-gray-600 text-sm">우리 동네에 첫 게시글을 올려보세요!</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* 플로팅 작성 버튼 */}
      <button 
        onClick={() => window.location.href = '/products/write'}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
} 