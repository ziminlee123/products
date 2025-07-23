import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const router = useRouter();
  const {
    id,
    title,
    price,
    minPrice,
    maxPrice,
    description,
    image,
    location,
    timeAgo,
    status,
    likes,
    comments,
    isNanum = false
  } = product;

  const handleProductClick = () => {
    router.push(`/products/${id}`);
  };

  // 가격 표시 로직
  const getPriceDisplay = () => {
    if (isNanum) {
      return <span className="text-orange-500 font-semibold text-sm">나눔💛</span>;
    }

    // 가격 범위가 설정된 경우
    if (minPrice && maxPrice && minPrice !== maxPrice) {
      const priceText = `${minPrice.toLocaleString()}원 ~ ${maxPrice.toLocaleString()}원`;
      return (
        <div className="flex flex-col">
          <span className="text-gray-900 font-semibold text-sm">{priceText}</span>
          <span className="text-xs text-orange-600">가격 협상 가능</span>
        </div>
      );
    }
    
    // 하나의 가격만 설정된 경우
    const displayPrice = maxPrice || minPrice || price || 0;
    const priceText = `${displayPrice.toLocaleString()}원`;
    
    if (minPrice && !maxPrice) {
      return (
        <div className="flex flex-col">
          <span className="text-gray-900 font-semibold text-sm">{priceText}부터</span>
          <span className="text-xs text-orange-600">최소 가격</span>
        </div>
      );
    }
    
    return <span className="text-gray-900 font-semibold text-sm">{priceText}</span>;
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
      <div className="flex gap-3">
        {/* 상품 이미지 */}
        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0" onClick={handleProductClick}>
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 
              className="text-gray-900 text-sm font-medium line-clamp-2 flex-1 mr-2 cursor-pointer hover:text-orange-600 transition-colors"
              onClick={handleProductClick}
            >
              {title}
            </h3>
            <button className="text-gray-500 hover:text-gray-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          {/* 위치 및 시간 */}
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{location}</span>
            <span className="mx-1">•</span>
            <span>{timeAgo}</span>
          </div>

          {/* 가격 및 상태 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status === '예약중' && !isNanum ? (
                <div className="flex items-center gap-2">
                  <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">예약중</span>
                  {getPriceDisplay()}
                </div>
              ) : (
                getPriceDisplay()
              )}
            </div>

            {/* 좋아요 및 댓글 */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {comments > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span>{comments}</span>
                </div>
              )}
              {likes > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>{likes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}