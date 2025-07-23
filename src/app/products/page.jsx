'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from '../../components/ProductCard';
import { useProducts } from '../../context/ProductsContext';

export default function ProductsPage() {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentLocation, setCurrentLocation] = useState('합정동');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const locationRef = useRef(null);

  const categories = ['전체', '동네소식', '냉방기기', '중고거래'];
  
  // 서울 지역구 및 동네 목록
  const seoulLocations = [
    { district: '마포구', neighborhoods: ['합정동', '홍대입구', '상수동', '망원동', '연남동', '성산동'] },
    { district: '강남구', neighborhoods: ['강남역', '역삼동', '논현동', '압구정동', '청담동', '삼성동'] },
    { district: '서초구', neighborhoods: ['서초동', '방배동', '반포동', '잠원동', '양재동', '내곡동'] },
    { district: '송파구', neighborhoods: ['잠실동', '신천동', '문정동', '가락동', '석촌동', '방이동'] },
    { district: '강동구', neighborhoods: ['천호동', '성내동', '길동', '둔촌동', '암사동', '고덕동'] },
    { district: '영등포구', neighborhoods: ['여의도동', '문래동', '당산동', '양평동', '신길동', '대림동'] },
    { district: '구로구', neighborhoods: ['신도림동', '구로동', '가리봉동', '개봉동', '오류동', '고척동'] },
    { district: '관악구', neighborhoods: ['신림동', '봉천동', '서원동', '남현동', '청룡동', '인헌동'] },
    { district: '동작구', neighborhoods: ['노량진동', '상도동', '흑석동', '동작동', '사당동', '대방동'] },
    { district: '용산구', neighborhoods: ['이태원동', '한남동', '용산동', '후암동', '청파동', '원효로동'] },
    { district: '중구', neighborhoods: ['명동', '을지로', '신당동', '황학동', '중림동', '필동'] },
    { district: '종로구', neighborhoods: ['종로', '명륜동', '혜화동', '창신동', '숭인동', '평창동'] },
    { district: '성북구', neighborhoods: ['성북동', '안암동', '정릉동', '길음동', '월곡동', '장위동'] },
    { district: '강북구', neighborhoods: ['수유동', '미아동', '번동', '우이동', '인수동', '삼각산동'] },
    { district: '도봉구', neighborhoods: ['쌍문동', '방학동', '창동', '도봉동', '상계동', '노원동'] },
    { district: '노원구', neighborhoods: ['상계동', '중계동', '하계동', '공릉동', '월계동', '노원동'] },
    { district: '은평구', neighborhoods: ['연신내', '불광동', '갈현동', '구산동', '대조동', '응암동'] },
    { district: '서대문구', neighborhoods: ['신촌', '연희동', '홍제동', '남가좌동', '북가좌동', '천연동'] },
    { district: '광진구', neighborhoods: ['건대입구', '자양동', '구의동', '광장동', '중곡동', '능동'] },
    { district: '성동구', neighborhoods: ['성수동', '왕십리', '금호동', '옥수동', '사근동', '행당동'] },
    { district: '동대문구', neighborhoods: ['장안동', '청량리', '회기동', '휘경동', '이문동', '전농동'] },
    { district: '중랑구', neighborhoods: ['면목동', '상봉동', '중화동', '묵동', '망우동', '신내동'] },
    { district: '금천구', neighborhoods: ['가산동', '독산동', '시흥동', '신림동'] },
    { district: '양천구', neighborhoods: ['목동', '신월동', '신정동'] }
  ];

  // 외부 클릭시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 검색 및 카테고리 필터링
  const getFilteredProducts = () => {
    let filtered = products;

    // 카테고리 필터링
    if (selectedCategory !== '전체') {
      if (selectedCategory === '냉방기기') {
        filtered = filtered.filter(product => 
          product.title.includes('에어컨') || 
          product.title.includes('선풍기') ||
          product.title.includes('쿨러')
        );
      } else if (selectedCategory === '중고거래') {
        filtered = filtered.filter(product => !product.isNanum);
      }
    }

    // 검색어 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // 검색 활성화/비활성화
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
    }
  };

  // 검색어 클리어
  const clearSearch = () => {
    setSearchQuery('');
  };

  // 지역 선택
  const selectLocation = (location) => {
    setCurrentLocation(location);
    setShowLocationMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="relative" ref={locationRef}>
            <button 
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="flex items-center text-gray-900 font-medium text-lg hover:text-orange-600 transition-colors"
            >
              <span>{currentLocation}</span>
              <svg 
                className={`w-4 h-4 ml-1 transition-transform ${showLocationMenu ? 'rotate-180' : ''}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* 지역 선택 드롭다운 */}
            {showLocationMenu && (
              <div className="absolute top-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 z-20 w-80 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">지역 선택</h3>
                  <p className="text-sm text-gray-600">현재 위치를 변경하여 해당 지역의 상품을 확인하세요</p>
                </div>
                
                <div className="p-2">
                  {seoulLocations.map((location) => (
                    <div key={location.district} className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 px-3 py-1 bg-gray-50 rounded">
                        {location.district}
                      </h4>
                      <div className="mt-1 grid grid-cols-2 gap-1">
                        {location.neighborhoods.map((neighborhood) => (
                          <button
                            key={neighborhood}
                            onClick={() => selectLocation(neighborhood)}
                            className={`text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors ${
                              currentLocation === neighborhood 
                                ? 'bg-orange-100 text-orange-600 font-medium' 
                                : 'text-gray-700'
                            }`}
                          >
                            {neighborhood}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500 text-center">
                    💡 현재 위치는 상품 거리 표시에 반영됩니다
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button 
              onClick={toggleSearch}
              className={`text-gray-700 transition-colors ${isSearchActive ? 'text-orange-500' : ''}`}
            >
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

        {/* 검색창 */}
        {isSearchActive && (
          <div className="px-4 pb-3 border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="상품명을 검색해보세요..."
                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={toggleSearch}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* 검색 결과 안내 */}
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-600">
                '<span className="font-medium">{searchQuery}</span>' 검색 결과 {filteredProducts.length}개
              </div>
            )}
          </div>
        )}
        
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
            <div className="text-gray-400 text-4xl mb-4">
              {searchQuery ? '🔍' : '📦'}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery 
                ? '검색 결과가 없어요' 
                : '등록된 게시글이 없어요'
              }
            </h3>
            <p className="text-gray-600 text-sm">
              {searchQuery 
                ? '다른 검색어로 시도해보세요!' 
                : '우리 동네에 첫 게시글을 올려보세요!'
              }
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                검색어 지우기
              </button>
            )}
          </div>
        ) : (
          <>
            {/* 검색/필터링 결과 헤더 */}
            {(searchQuery || selectedCategory !== '전체') && (
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    {searchQuery && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        검색: {searchQuery}
                      </span>
                    )}
                    {selectedCategory !== '전체' && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {selectedCategory}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-600 text-sm">
                    {filteredProducts.length}개 상품
                  </span>
                </div>
              </div>
            )}

            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </>
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