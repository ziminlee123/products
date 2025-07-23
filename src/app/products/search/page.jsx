'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    '캐리어 제습기 8L',
    '파세코',
    '2250W'
  ]);

  // 카테고리 데이터
  const categories = [
    { name: '알바', icon: '👨‍💼', color: 'bg-orange-500' },
    { name: '중고차', icon: '🚗', color: 'bg-blue-500' },
    { name: '부동산', icon: '🏠', color: 'bg-pink-500' },
    { name: '모임', icon: '👥', color: 'bg-orange-600' },
    { name: '스토리', icon: '▶️', color: 'bg-red-500' },
    { name: '전체', icon: '☰', color: 'bg-gray-600' }
  ];

  // 추천 검색어
  const recommendedSearches = [
    '건조대 빨래',
    '빨래건조대',
    '이불건조대',
    '드레스룸'
  ];

  // 검색 실행
  const handleSearch = (query) => {
    if (query.trim()) {
      // 최근 검색어에 추가
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item !== query);
        return [query, ...filtered].slice(0, 10); // 최대 10개
      });
      
      // 검색 결과 페이지로 이동 (상품 목록 페이지에 검색어 전달)
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  // 최근 검색어 삭제
  const removeRecentSearch = (searchToRemove) => {
    setRecentSearches(prev => prev.filter(item => item !== searchToRemove));
  };

  // 전체 삭제
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  // 검색 입력 처리
  const handleInputSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => router.back()}
            className="text-gray-700 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 className="text-lg font-medium text-gray-900">합정동 근처에서 검색</h1>
          
          <button 
            onClick={() => router.push('/products')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            <span className="text-sm">검색 해제</span>
          </button>
        </div>

        {/* 검색창 */}
        <form onSubmit={handleInputSubmit} className="mb-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="'건조대' 컵볼 결과 0개"
              className="w-full bg-blue-50 text-gray-900 placeholder-blue-600 pl-10 pr-4 py-3 rounded-lg border border-blue-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 카테고리 섹션 */}
      <div className="px-4 py-6 bg-white">
        <div className="grid grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleSearch(category.name)}
              className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className={`w-12 h-12 ${category.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-sm`}>
                {category.icon}
              </div>
              <span className="text-sm text-gray-700 font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 추천 검색 */}
      <div className="px-4 py-6 bg-white border-t border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">추천 검색</h2>
        <div className="space-y-1">
          {recommendedSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSearch(search)}
              className="block w-full text-left py-3 px-1 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* 최근 검색 */}
      {recentSearches.length > 0 && (
        <div className="px-4 py-6 bg-white border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">최근 검색</h2>
            <button
              onClick={clearAllRecentSearches}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              전체 삭제
            </button>
          </div>
          
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <div key={index} className="flex items-center justify-between py-3 hover:bg-gray-50 rounded px-2 -mx-2">
                <button
                  onClick={() => handleSearch(search)}
                  className="flex items-center gap-3 flex-1 text-left hover:text-orange-600 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{search}</span>
                </button>
                
                <button
                  onClick={() => removeRecentSearch(search)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 빈 상태 (최근 검색이 없을 때) */}
      {recentSearches.length === 0 && (
        <div className="px-4 py-8 bg-white border-t border-gray-100">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-3">🔍</div>
            <p className="text-gray-500 text-sm mb-1">최근 검색 기록이 없습니다</p>
            <p className="text-gray-400 text-sm">원하는 상품을 검색해보세요!</p>
          </div>
        </div>
      )}
    </div>
  );
} 