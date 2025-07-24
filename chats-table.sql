-- chats 테이블 생성
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  product_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_chats_sender_id ON chats(sender_id);
CREATE INDEX idx_chats_receiver_id ON chats(receiver_id);
CREATE INDEX idx_chats_product_id ON chats(product_id);
CREATE INDEX idx_chats_created_at ON chats(created_at DESC);

-- 외래키 제약조건 (products 테이블과 연결)
ALTER TABLE chats 
ADD CONSTRAINT fk_chats_product 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- 샘플 채팅 데이터 삽입
INSERT INTO chats (message, sender_id, receiver_id, product_id) VALUES
('안녕하세요! 에어컨 아직 판매중인가요?', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001'),
('네 맞습니다! 직거래 가능하신가요?', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001'),
('네 가능합니다. 언제쯤 보실 수 있나요?', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001'),
('맥북 상태가 궁금해요. 사진 더 보여주실 수 있나요?', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003'),
('네 카톡으로 추가 사진 보내드릴게요!', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003'),
('공기청정기 나눔 받고 싶습니다!', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440004'),
('좋습니다! 언제 가져가실 수 있나요?', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440004');

-- Row Level Security (RLS) 활성화
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- 자신이 보낸 메시지나 받은 메시지만 볼 수 있도록 정책 생성
CREATE POLICY "Users can view their own chats" ON chats 
FOR SELECT USING (
  auth.uid()::text = sender_id::text OR 
  auth.uid()::text = receiver_id::text
);

-- 인증된 사용자만 메시지를 보낼 수 있도록 정책 생성
CREATE POLICY "Authenticated users can send messages" ON chats 
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = sender_id::text
);

-- 자신이 보낸 메시지만 수정할 수 있도록 정책 생성
CREATE POLICY "Users can update their own messages" ON chats 
FOR UPDATE USING (
  auth.uid()::text = sender_id::text
);

-- 자신이 보낸 메시지만 삭제할 수 있도록 정책 생성
CREATE POLICY "Users can delete their own messages" ON chats 
FOR DELETE USING (
  auth.uid()::text = sender_id::text
);

-- 채팅방 목록을 위한 뷰 생성 (최신 메시지 기준)
CREATE OR REPLACE VIEW chat_rooms AS
SELECT DISTINCT ON (
  CASE 
    WHEN sender_id < receiver_id THEN sender_id || '-' || receiver_id
    ELSE receiver_id || '-' || sender_id
  END,
  product_id
)
  id,
  message as last_message,
  sender_id,
  receiver_id,
  product_id,
  created_at as last_message_time,
  CASE 
    WHEN sender_id < receiver_id THEN sender_id || '-' || receiver_id
    ELSE receiver_id || '-' || sender_id
  END as room_id
FROM chats
ORDER BY 
  CASE 
    WHEN sender_id < receiver_id THEN sender_id || '-' || receiver_id
    ELSE receiver_id || '-' || sender_id
  END,
  product_id,
  created_at DESC; 