-- 상품 테이블 생성
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER DEFAULT 0,
  min_price INTEGER,
  max_price INTEGER,
  image_url TEXT,
  location VARCHAR(255) DEFAULT '합정동',
  time_ago VARCHAR(50) DEFAULT '방금 전',
  status VARCHAR(50) DEFAULT '판매중',
  is_nanum BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 샘플 데이터 삽입
INSERT INTO products (title, description, price, min_price, max_price, image_url, location, time_ago, status, is_nanum, likes, comments) VALUES
('파세코 창문형 인버터 에어컨 PWA-3250W', '파세코 창문형 인버터 에어컨 판매합니다!

• 모델명: PWA-3250W
• 2023년 6월 구매 (1년 사용)
• 냉방능력: 3.2kW (10-13평형)
• 인버터 방식으로 전기료 절약

이사로 인한 급처분입니다.', 340000, 300000, NULL, 'https://images.unsplash.com/photo-1631545806634-4b3d25632e9c?w=800&h=600&fit=crop&crop=center', '400m · 망원제1동', '1시간 전', '판매중', false, 6, 0),

('캐리어 벽걸이 에어컨', '캐리어 벽걸이 에어컨 나눔합니다 💛

• 구형 모델이지만 정상 작동
• 약 15년 정도 사용 (2009년 구매)
• 냉방은 잘 되나 소음이 약간 있음

이사 가면서 새 에어컨으로 교체해서 나눔해요.', 0, NULL, NULL, 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop&crop=center', '1.8km · 양평동4가', '5분 전', '나눔', true, 0, 1),

('m1 맥북 a급 급처', '맥북 에어 M1 A급 상태로 급처분합니다!

• MacBook Air 13인치 (2020)
• Apple M1 칩, 8GB RAM, 256GB SSD
• 스페이스 그레이 색상
• 배터리 사이클: 245회 (양호)

해외 출장으로 인한 급처분입니다.', 700000, 650000, 750000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&crop=center', '양평제2동', '4분 전', '판매중', false, 1, 1),

('나눔 샤오미 미에어 공기청정기', '샤오미 미에어 공기청정기 나눔합니다 💛

• 모델: Mi Air Purifier 2S
• 사용기간: 약 2년
• 현재 상태: 정상 작동
• 필터 교체 필요 (약 2만원 정도)', 0, NULL, NULL, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center', '900m · 성산동', '6분 전', '나눔', true, 0, 0),

('아이폰 14 Pro 128GB 딥퍼플', '아이폰 14 Pro 128GB 딥퍼플 판매합니다

• 구매일: 2023년 2월
• 용량: 128GB
• 색상: 딥 퍼플
• 배터리 최대 용량: 89%
• 외관 상태: S급 (거의 새것)', 850000, NULL, NULL, 'https://images.unsplash.com/photo-1663499482523-1c0158c57200?w=800&h=600&fit=crop&crop=center', '1.2km · 합정동', '10분 전', '예약중', false, 3, 2);

-- Row Level Security (RLS) 활성화
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 모든 사람이 읽을 수 있도록 정책 생성
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

-- 인증된 사용자만 INSERT/UPDATE/DELETE 가능하도록 정책 생성 (필요시)
CREATE POLICY "Authenticated users can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated'); 