'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '../../../context/ProductsContext';

export default function WriteProductPage() {
  const router = useRouter();
  const { addProduct } = useProducts();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minPrice: '',
    maxPrice: '',
    images: [],
    saleType: 'sell' // 'sell' or 'share'
  });
  const [previewImages, setPreviewImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 10) {
      alert('이미지는 최대 10개까지 업로드할 수 있습니다.');
      return;
    }

    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setPreviewImages(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    const newImages = formData.images.filter((_, i) => i !== index);
    
    setPreviewImages(newPreviews);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.description.trim()) {
      alert('상품 설명을 입력해주세요.');
      return;
    }
    if (formData.saleType === 'sell') {
      if (!formData.minPrice.trim() && !formData.maxPrice.trim()) {
        alert('최소 가격 또는 최대 가격 중 하나는 입력해주세요.');
        return;
      }
      
      const minPrice = parseInt(formData.minPrice) || 0;
      const maxPrice = parseInt(formData.maxPrice) || 0;
      
      if (minPrice > 0 && maxPrice > 0 && minPrice > maxPrice) {
        alert('최소 가격은 최대 가격보다 클 수 없습니다.');
        return;
      }
    }
    if (formData.images.length === 0) {
      alert('상품 이미지를 한 장 이상 업로드해주세요.');
      return;
    }

    // Context의 addProduct 함수를 사용하여 새 상품 추가
    const newProductData = {
      title: formData.title,
      description: formData.description,
      minPrice: formData.saleType === 'share' ? 0 : parseInt(formData.minPrice) || 0,
      maxPrice: formData.saleType === 'share' ? 0 : parseInt(formData.maxPrice) || 0,
      // 기존 호환성을 위해 price 필드도 유지 (minPrice 또는 maxPrice 중 하나)
      price: formData.saleType === 'share' ? 0 : (parseInt(formData.maxPrice) || parseInt(formData.minPrice) || 0),
      images: formData.images,
      isNanum: formData.saleType === 'share'
    };

    addProduct(newProductData);
    
    alert('상품이 등록되었습니다!');
    router.push('/products');
  };

  const addFrequentPhrase = (phrase) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description + (prev.description ? '\n\n' : '') + phrase
    }));
  };

  const frequentPhrases = [
    "상태 좋아요! 직거래 선호합니다.",
    "급처분! 네고 가능해요.",
    "깨끗하게 사용했습니다.",
    "실사용 거의 없어요.",
    "원가 대비 저렴하게 판매해요."
  ];

  // 가격을 천단위로 포맷팅하는 함수
  const formatPrice = (price) => {
    if (!price) return '';
    return parseInt(price).toLocaleString();
  };

  // 가격 입력시 천단위 콤마 처리
  const handlePriceChange = (e, field) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 추출
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">내 물건 팔기</h1>
          
          <button className="text-gray-500 text-sm">
            임시저장
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* 사진 업로드 */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-gray-500 mt-1">{previewImages.length}/10</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* 미리보기 이미지들 */}
            <div className="flex gap-2 overflow-x-auto flex-1">
              {previewImages.map((preview, index) => (
                <div key={index} className="relative w-20 h-20 flex-shrink-0">
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            * 상품과 무관한 사진, 홍보 목적의 사진은 제재를 받을 수 있어요.
          </p>
        </div>

        {/* 제목 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제목 *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="상품명을 입력해주세요"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            maxLength={40}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {formData.title.length}/40
          </div>
        </div>

        {/* 상세 설명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            자세한 설명 *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="상품에 대해 자세히 설명해주세요.&#10;(브랜드, 모델명, 구매시기, 하자여부 등)&#10;&#10;* 카카오톡 아이디, 전화번호 등 개인정보는 입력하지 마세요.&#10;* 게시글 신고가 누적되면 제재를 받을 수 있어요."
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
            rows={8}
            maxLength={2000}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {formData.description.length}/2000
          </div>
          
          {/* 자주 쓰는 문구 */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {frequentPhrases.map((phrase, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addFrequentPhrase(phrase)}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
                >
                  + {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 거래 방식 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            거래 방식
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, saleType: 'sell', minPrice: '', maxPrice: '' }))}
              className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                formData.saleType === 'sell'
                  ? 'bg-orange-50 border-orange-500 text-orange-600'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
            >
              판매하기
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, saleType: 'share', minPrice: '0', maxPrice: '0' }))}
              className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                formData.saleType === 'share'
                  ? 'bg-orange-50 border-orange-500 text-orange-600'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
            >
              나눔하기
            </button>
          </div>
        </div>

        {/* 가격 범위 입력 (판매하기 선택시에만) */}
        {formData.saleType === 'sell' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              희망 가격 범위 *
            </label>
            
            {/* 가격 범위 설명 */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-blue-700">가격 협상이 가능해요!</span>
              </div>
              <p className="text-xs text-blue-600">
                최소~최대 가격을 설정하면 구매자가 가격 범위를 확인할 수 있어요. 
                하나의 가격만 입력해도 됩니다.
              </p>
            </div>

            <div className="space-y-3">
              {/* 최소 가격 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  최소 가격 (선택)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatPrice(formData.minPrice)}
                    onChange={(e) => handlePriceChange(e, 'minPrice')}
                    placeholder="예: 50,000"
                    className="w-full px-3 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    원
                  </span>
                </div>
              </div>

              {/* 가격 범위 연결선 */}
              <div className="flex items-center justify-center">
                <div className="w-8 h-px bg-gray-300"></div>
                <span className="mx-2 text-gray-500 text-sm">~</span>
                <div className="w-8 h-px bg-gray-300"></div>
              </div>

              {/* 최대 가격 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  최대 가격 (선택)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatPrice(formData.maxPrice)}
                    onChange={(e) => handlePriceChange(e, 'maxPrice')}
                    placeholder="예: 70,000"
                    className="w-full px-3 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    원
                  </span>
                </div>
              </div>
            </div>

            {/* 가격 범위 미리보기 */}
            {(formData.minPrice || formData.maxPrice) && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-600">상품 목록에 표시될 가격: </span>
                <span className="font-medium text-gray-900">
                  {formData.minPrice && formData.maxPrice 
                    ? `${formatPrice(formData.minPrice)}원 ~ ${formatPrice(formData.maxPrice)}원`
                    : formData.minPrice 
                      ? `${formatPrice(formData.minPrice)}원부터`
                      : `${formatPrice(formData.maxPrice)}원`
                  }
                </span>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              * 두 가격 모두 입력하면 가격 범위가 표시되고, 하나만 입력해도 됩니다.
            </p>
          </div>
        )}

        {/* 작성 완료 버튼 */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors"
          >
            작성 완료
          </button>
        </div>
      </form>
    </div>
  );
} 