-- public.users 테이블 생성 (auth.users와 연동)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT,
  profile_image_url TEXT,
  phone TEXT,
  address TEXT,
  district TEXT, -- 구 (예: 마포구, 강남구)
  neighborhood TEXT, -- 동 (예: 합정동, 상수동)
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.0, -- 평점 (0.00 ~ 5.00)
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_nickname ON public.users(nickname);
CREATE INDEX idx_users_district ON public.users(district);
CREATE INDEX idx_users_neighborhood ON public.users(neighborhood);

-- 샘플 사용자 데이터 (실제로는 회원가입 시 자동 생성됨)
INSERT INTO public.users (id, email, nickname, profile_image_url, phone, address, district, neighborhood, is_verified, rating, rating_count) VALUES
-- 에어컨 판매자
('550e8400-e29b-41d4-a716-446655440011', 'seller1@example.com', '착한판매자', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '010-1234-5678', '서울시 마포구 망원동 123-45', '마포구', '망원동', TRUE, 4.8, 15),
-- 에어컨 구매자
('550e8400-e29b-41d4-a716-446655440010', 'buyer1@example.com', '믿음직구매자', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '010-2345-6789', '서울시 마포구 합정동 456-78', '마포구', '합정동', TRUE, 4.9, 8),
-- 맥북 판매자
('550e8400-e29b-41d4-a716-446655440013', 'macbook_seller@example.com', '맥북전문가', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '010-3456-7890', '서울시 강남구 역삼동 789-12', '강남구', '역삼동', TRUE, 4.7, 22),
-- 맥북 구매자
('550e8400-e29b-41d4-a716-446655440012', 'macbook_buyer@example.com', '학생구매자', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '010-4567-8901', '서울시 강남구 논현동 321-65', '강남구', '논현동', FALSE, 0.0, 0),
-- 공기청정기 나눔 제공자
('550e8400-e29b-41d4-a716-446655440015', 'giver1@example.com', '나눔천사', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '010-5678-9012', '서울시 마포구 성산동 654-32', '마포구', '성산동', TRUE, 5.0, 31),
-- 공기청정기 나눔 받는 사람
('550e8400-e29b-41d4-a716-446655440014', 'receiver1@example.com', '감사한받는이', 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face', '010-6789-0123', '서울시 마포구 상수동 987-43', '마포구', '상수동', TRUE, 4.6, 5);

-- Row Level Security (RLS) 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 모든 사람이 사용자 기본 정보를 볼 수 있도록 (개인정보 제외)
CREATE POLICY "Anyone can view basic user info" ON public.users 
FOR SELECT USING (true);

-- 본인만 자신의 정보를 수정할 수 있도록
CREATE POLICY "Users can update own profile" ON public.users 
FOR UPDATE USING (auth.uid() = id);

-- 회원가입 시 자동으로 users 테이블에 레코드 생성하는 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nickname)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- auth.users에 새 사용자가 생성되면 자동으로 public.users에도 생성
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users 테이블 업데이트 시 updated_at 자동 갱신
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 사용자 평점 업데이트 함수
CREATE OR REPLACE FUNCTION update_user_rating(
  user_id UUID,
  new_rating DECIMAL
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET 
    rating = (rating * rating_count + new_rating) / (rating_count + 1),
    rating_count = rating_count + 1,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 주변 사용자 찾기 함수 (같은 구 또는 동네)
CREATE OR REPLACE FUNCTION get_nearby_users(
  current_user_id UUID,
  search_district TEXT DEFAULT NULL,
  search_neighborhood TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  nickname TEXT,
  profile_image_url TEXT,
  district TEXT,
  neighborhood TEXT,
  rating DECIMAL,
  rating_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.nickname,
    u.profile_image_url,
    u.district,
    u.neighborhood,
    u.rating,
    u.rating_count
  FROM public.users u
  WHERE 
    u.id != current_user_id
    AND (search_district IS NULL OR u.district = search_district)
    AND (search_neighborhood IS NULL OR u.neighborhood = search_neighborhood)
  ORDER BY u.rating DESC, u.rating_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 