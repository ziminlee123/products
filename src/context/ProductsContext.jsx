'use client';

import { createContext, useContext, useState } from 'react';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  // 초기 샘플 데이터
  const initialProducts = [
    {
      id: 1,
      title: "파세코 창문형 인버터 에어컨 PWA-3250W (연장판매)",
      price: 340000,
      description: "파세코 창문형 인버터 에어컨 판매합니다!\n\n• 모델명: PWA-3250W\n• 2023년 6월 구매 (1년 사용)\n• 냉방능력: 3.2kW (10-13평형)\n• 인버터 방식으로 전기료 절약\n• 리모컨, 설명서, 박스 모두 있음\n• 정상 작동, 청소 완료 상태\n\n이사로 인한 급처분입니다.\n직거래 선호하며, 차량 필요합니다.\n설치 및 철거는 별도 비용입니다.",
      image: "https://images.unsplash.com/photo-1631545806634-4b3d25632e9c?w=800&h=600&fit=crop&crop=center",
      location: "400m · 망원제1동",
      timeAgo: "1시간 전",
      status: "판매중",
      likes: 6,
      comments: 0,
      isNanum: false
    },
    {
      id: 2,
      title: "캐리어 벽걸이 에어컨",
      price: 0,
      description: "캐리어 벽걸이 에어컨 나눔합니다 💛\n\n• 구형 모델이지만 정상 작동\n• 약 15년 정도 사용 (2009년 구매)\n• 냉방은 잘 되나 소음이 약간 있음\n• 리모컨 포함\n\n이사 가면서 새 에어컨으로 교체해서 나눔해요.\n가져가실 분만 연락주세요.\n직접 철거해가셔야 합니다.\n\n※ 철거비용은 본인 부담",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop&crop=center",
      location: "1.8km · 양평동4가",
      timeAgo: "5분 전",
      status: "나눔",
      likes: 0,
      comments: 1,
      isNanum: true
    },
    {
      id: 3,
      title: "m1 맥북 a급 급처",
      price: 700000,
      description: "맥북 에어 M1 A급 상태로 급처분합니다!\n\n• MacBook Air 13인치 (2020)\n• Apple M1 칩, 8GB RAM, 256GB SSD\n• 스페이스 그레이 색상\n• 배터리 사이클: 245회 (양호)\n• 외관 상태: A급 (미세 스크래치만 있음)\n• 액정 이상 없음, 키보드 정상\n\n포함품:\n- 맥북 본체\n- 정품 충전기\n- 박스 및 설명서\n\n해외 출장으로 인한 급처분입니다.\n직거래 or 택배 가능 (택배비 별도)",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&crop=center",
      location: "양평제2동",
      timeAgo: "4분 전",
      status: "판매중",
      likes: 1,
      comments: 1,
      isNanum: false
    },
    {
      id: 4,
      title: "나눔 샤오미 미에어 공기청정기",
      price: 0,
      description: "샤오미 미에어 공기청정기 나눔합니다 💛\n\n• 모델: Mi Air Purifier 2S\n• 사용기간: 약 2년\n• 현재 상태: 정상 작동\n• 필터 교체 필요 (약 2만원 정도)\n• 리모컨, 설명서 포함\n\n이사하면서 새 제품으로 바꿔서 나눔해요.\n미세먼지 잡는데 효과 좋았습니다.\n\n가져가실 분만 연락주세요!\n직거래만 가능합니다.\n\n※ 필터 교체하시면 바로 사용 가능해요",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center",
      location: "900m · 성산동",
      timeAgo: "6분 전",
      status: "나눔",
      likes: 0,
      comments: 0,
      isNanum: true
    },
    {
      id: 5,
      title: "아이폰 14 Pro 128GB 딥퍼플",
      price: 850000,
      description: "아이폰 14 Pro 128GB 딥퍼플 판매합니다\n\n• 구매일: 2023년 2월\n• 용량: 128GB\n• 색상: 딥 퍼플\n• 배터리 최대 용량: 89%\n• 외관 상태: S급 (거의 새것)\n• 액정 크랙, 침수 이력 없음\n\n포함품:\n- 아이폰 14 Pro 본체\n- 정품 박스\n- 미사용 정품 케이블\n- 강화유리 필름 부착 상태\n\n아이폰 15로 기기변경해서 판매합니다.\n직거래 선호, 네고 조금 가능합니다.\n\n현재 예약중이며 연락 오는 순서대로 진행합니다.",
      image: "https://images.unsplash.com/photo-1663499482523-1c0158c57200?w=800&h=600&fit=crop&crop=center",
      location: "1.2km · 합정동",
      timeAgo: "10분 전",
      status: "예약중",
      likes: 3,
      comments: 2,
      isNanum: false
    },
    {
      id: 6,
      title: "LG 그램 17인치 노트북",
      price: 1200000,
      description: "LG 그램 17인치 노트북 판매합니다\n\n• 모델: 2023 LG Gram 17Z90R\n• CPU: Intel 13세대 i7-1360P\n• RAM: 16GB LPDDR5\n• SSD: 512GB NVMe\n• 화면: 17인치 WQXGA (2560x1600)\n• 무게: 약 1.35kg (초경량)\n• 배터리: 80Wh (10시간 이상 사용)\n\n구매일: 2023년 8월 (8개월 사용)\n상태: A급 (외관 깨끗, 정상 작동)\n\n포함품:\n- 노트북 본체\n- 정품 충전기 및 케이블\n- 박스 및 설명서\n- LG 정품 파우치\n\n회사에서 노트북 지급받아서 판매합니다.\nAS 기간 남아있습니다.",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&crop=center",
      location: "2.1km · 상수동",
      timeAgo: "15분 전",
      status: "판매중",
      likes: 2,
      comments: 0,
      isNanum: false
    },
    {
      id: 7,
      title: "다이슨 V15 무선청소기",
      price: 450000,
      description: "다이슨 V15 디텍트 무선청소기 판매합니다\n\n• 모델: Dyson V15 Detect\n• 구매일: 2023년 4월 (1년 사용)\n• 상태: A급 (정상 작동)\n• 배터리 상태 양호\n• 레이저 먼지 감지 기능\n• LCD 화면으로 먼지량 표시\n\n포함품:\n- 다이슨 V15 본체\n- 충전 독\n- 각종 헤드 (5개)\n- 연장 호스\n- 벽걸이 브라켓\n- 정품 박스 및 설명서\n\n이사로 인한 판매입니다.\n가격 조금 네고 가능해요.\n직거래 선호합니다.\n\n헤드 모두 세척 완료 상태입니다.",
      image: "https://images.unsplash.com/photo-1558618666-fbcd65c3c40c?w=800&h=600&fit=crop&crop=center",
      location: "500m · 망원동",
      timeAgo: "20분 전",
      status: "판매중",
      likes: 5,
      comments: 3,
      isNanum: false
    },
    {
      id: 8,
      title: "닌텐도 스위치 OLED 화이트",
      price: 280000,
      description: "닌텐도 스위치 OLED 화이트 모델 판매합니다\n\n• 모델: Nintendo Switch OLED (화이트)\n• 구매일: 2022년 12월\n• 사용기간: 1년 4개월\n• 상태: A급 (거의 새것급)\n• 배터리, 충전, 모든 기능 정상\n• 조이콘 드리프트 현상 없음\n\n포함품:\n- 스위치 OLED 본체\n- 조이콘 (L/R)\n- 조이콘 그립\n- 독\n- AC 어댑터\n- HDMI 케이블\n- 정품 박스\n\n추가 제공:\n- 강화유리 필름 부착\n- 실리콘 케이스\n- 게임팩 케이스\n\n게임을 잘 안하게 되어서 판매합니다.\n직거래 선호, 택배도 가능합니다.",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop&crop=center",
      location: "1.5km · 연남동",
      timeAgo: "30분 전",
      status: "판매중",
      likes: 4,
      comments: 1,
      isNanum: false
    }
  ];

  const [products, setProducts] = useState(initialProducts);

  // 새 상품 추가 함수
  const addProduct = (newProductData) => {
    const newProduct = {
      id: Date.now(), // 간단한 ID 생성
      ...newProductData,
      location: "100m · 합정동", // 기본 위치
      timeAgo: "방금 전",
      status: newProductData.isNanum ? "나눔" : "판매중",
      likes: 0,
      comments: 0,
      // 이미지 URL을 실제 업로드된 이미지 URL로 변환 (여기서는 placeholder)
      image: newProductData.images?.[0] ? URL.createObjectURL(newProductData.images[0]) : null
    };

    setProducts(prevProducts => [newProduct, ...prevProducts]);
    return newProduct;
  };

  // 상품 삭제 함수 (필요시 사용)
  const removeProduct = (productId) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
  };

  // 상품 업데이트 함수 (필요시 사용)
  const updateProduct = (productId, updatedData) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, ...updatedData } : product
      )
    );
  };

  const value = {
    products,
    addProduct,
    removeProduct,
    updateProduct
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}; 