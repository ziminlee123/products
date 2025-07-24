-- chats 테이블 생성 (읽음/안 읽음 기능 포함, 샘플 데이터 없음)
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_chats_sender_id ON chats(sender_id);
CREATE INDEX idx_chats_receiver_id ON chats(receiver_id);
CREATE INDEX idx_chats_product_id ON chats(product_id);
CREATE INDEX idx_chats_created_at ON chats(created_at DESC);
CREATE INDEX idx_chats_is_read ON chats(is_read);

-- Row Level Security (RLS) 활성화
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- 자신이 보낸 메시지나 받은 메시지만 볼 수 있도록 정책 생성
CREATE POLICY "Users can view their own chats" ON chats 
FOR SELECT USING (
  auth.uid() = sender_id OR 
  auth.uid() = receiver_id
);

-- 인증된 사용자만 메시지를 보낼 수 있도록 정책 생성
CREATE POLICY "Authenticated users can send messages" ON chats 
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND 
  auth.uid() = sender_id
);

-- 자신이 보낸 메시지와 자신이 받은 메시지의 읽음 상태만 업데이트 가능
CREATE POLICY "Users can update read status" ON chats 
FOR UPDATE USING (
  auth.uid() = sender_id OR 
  auth.uid() = receiver_id
);

-- 자신이 보낸 메시지만 삭제할 수 있도록 정책 생성
CREATE POLICY "Users can delete their own messages" ON chats 
FOR DELETE USING (
  auth.uid() = sender_id
);

-- 채팅방 목록을 위한 뷰 생성 (읽지 않은 메시지 개수 포함)
CREATE OR REPLACE VIEW chat_rooms AS
WITH latest_messages AS (
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
    is_read as last_message_read,
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
    created_at DESC
),
unread_counts AS (
  SELECT 
    CASE 
      WHEN sender_id < receiver_id THEN sender_id || '-' || receiver_id
      ELSE receiver_id || '-' || sender_id
    END as room_id,
    product_id,
    receiver_id,
    COUNT(*) as unread_count
  FROM chats 
  WHERE is_read = FALSE 
  GROUP BY 
    CASE 
      WHEN sender_id < receiver_id THEN sender_id || '-' || receiver_id
      ELSE receiver_id || '-' || sender_id
    END,
    product_id,
    receiver_id
)
SELECT 
  lm.*,
  COALESCE(uc.unread_count, 0) as unread_count
FROM latest_messages lm
LEFT JOIN unread_counts uc ON (
  lm.room_id = uc.room_id AND 
  lm.product_id = uc.product_id AND
  lm.receiver_id = uc.receiver_id
);

-- 메시지 읽음 처리 함수
CREATE OR REPLACE FUNCTION mark_messages_as_read(
  p_sender_id UUID,
  p_receiver_id UUID,
  p_product_id UUID DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
  updated_count INT;
BEGIN
  UPDATE chats 
  SET 
    is_read = TRUE,
    read_at = NOW()
  WHERE 
    sender_id = p_sender_id 
    AND receiver_id = p_receiver_id
    AND is_read = FALSE
    AND (p_product_id IS NULL OR product_id = p_product_id);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 안 읽은 메시지 개수 조회 함수
CREATE OR REPLACE FUNCTION get_unread_message_count(
  p_user_id UUID,
  p_product_id UUID DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
  unread_count INT;
BEGIN
  SELECT COUNT(*)
  INTO unread_count
  FROM chats 
  WHERE 
    receiver_id = p_user_id 
    AND is_read = FALSE
    AND (p_product_id IS NULL OR product_id = p_product_id);
  
  RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 