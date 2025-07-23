'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useProducts } from '../../../context/ProductsContext';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'seller',
      text: '안녕하세요! 문의사항이 있으시면 언제든 말씀해주세요 😊',
      time: '14:30',
      isRead: true
    }
  ]);
  const chatRef = useRef(null);

  // 자주 사용하는 이모지들
  const quickEmojis = ['👍', '😊', '😢', '😍', '🤔', '👏', '🙏', '❤️'];
  const frequentEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳',
    '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
    '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
    '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✊', '👊',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤'
  ];

  useEffect(() => {
    const productId = parseInt(params.id);
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [params.id, products]);

  useEffect(() => {
    if (showChat && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, showChat]);

  // 메시지 전송
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: 'buyer',
      text: newMessage,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowEmojiPicker(false);

    // 판매자 자동 응답 (2초 후)
    setTimeout(() => {
      const responses = [
        '네, 확인했습니다! 언제 거래 가능하신가요?',
        '직거래 가능하시면 연락 주세요 👍',
        '네고 조금 가능해요. 얼마 정도 생각하고 계신가요?',
        '상태 정말 좋아요! 직접 보시면 만족하실 거예요',
        '빠른 거래 원하시면 지금 바로 가능해요!'
      ];
      
      const autoReply = {
        id: messages.length + 2,
        sender: 'seller',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };

      setMessages(prev => [...prev, autoReply]);
    }, 2000);
  };

  // 이모지 추가
  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // 빠른 이모지 전송
  const sendQuickEmoji = (emoji) => {
    const message = {
      id: messages.length + 1,
      sender: 'buyer',
      text: emoji,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setMessages(prev => [...prev, message]);

    // 판매자 이모지 응답 (1초 후)
    setTimeout(() => {
      const emojiResponses = ['👍', '😊', '🙏', '❤️', '😄'];
      const randomEmoji = emojiResponses[Math.floor(Math.random() * emojiResponses.length)];
      
      const autoReply = {
        id: messages.length + 2,
        sender: 'seller',
        text: randomEmoji,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };

      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  // 공유 기능들
  const shareToKakao = () => {
    const currentUrl = window.location.href;
    const shareText = `${product.title}\n${product.price ? `${product.price.toLocaleString()}원` : '나눔💛'}\n\n${product.description.slice(0, 100)}...`;
    
    // 카카오톡 공유 (실제 구현시 카카오 SDK 필요)
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: shareText,
        url: currentUrl,
      }).catch((error) => {
        console.log('공유 실패:', error);
        // 폴백: 클립보드에 복사
        copyToClipboard(currentUrl);
      });
    } else {
      // 카카오톡 앱 열기 시도 (모바일에서)
      const kakaoUrl = `kakaotalk://send?text=${encodeURIComponent(shareText + '\n' + currentUrl)}`;
      window.open(kakaoUrl, '_blank');
      
      // 일정 시간 후 앱이 열리지 않으면 웹 카카오톡으로
      setTimeout(() => {
        copyToClipboard(currentUrl);
        alert('링크가 복사되었습니다! 카카오톡에 붙여넣어 주세요.');
      }, 1000);
    }
    setShowShareMenu(false);
  };

  const shareUrl = () => {
    const currentUrl = window.location.href;
    copyToClipboard(currentUrl);
    alert('링크가 복사되었습니다!');
    setShowShareMenu(false);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // 폴백 방법
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">상품을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-black/50 text-white sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              
              {/* 공유 메뉴 */}
              {showShareMenu && (
                <>
                  {/* 배경 오버레이 */}
                  <div 
                    className="fixed inset-0 bg-black/20 z-30"
                    onClick={() => setShowShareMenu(false)}
                  ></div>
                  
                  {/* 공유 메뉴 팝업 */}
                  <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 z-40 min-w-48">
                    <div className="py-2">
                      <button
                        onClick={shareToKakao}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      >
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-brown-600">카</span>
                        </div>
                        <span className="font-medium">카카오톡 공유</span>
                      </button>
                      
                      <button
                        onClick={shareUrl}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <span className="font-medium">링크 복사</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <button className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 상품 이미지 */}
      <div className="relative">
        <div className="relative h-96 bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* 이미지 카운터 */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          1 / 1
        </div>
      </div>

      {/* 판매자 정보 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">안녕하세요</h3>
                <span className="text-orange-500 text-2xl">😊</span>
              </div>
              <p className="text-sm text-gray-500">합정동</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1">
              <span className="text-orange-500 text-lg font-bold">99°C</span>
            </div>
            <p className="text-xs text-gray-500">매너온도</p>
          </div>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h1 className="text-lg font-semibold text-gray-900 mb-2">
          {product.title}
        </h1>
        
        <div className="flex items-center gap-2 mb-4">
          {product.isNanum ? (
            <span className="text-orange-500 text-xl font-bold">나눔💛</span>
          ) : (
            <>
              <div className="flex flex-col">
                {product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice ? (
                  <>
                    <span className="text-xl font-bold text-gray-900">
                      {product.minPrice.toLocaleString()}원 ~ {product.maxPrice.toLocaleString()}원
                    </span>
                    <span className="text-sm text-orange-600 font-medium">가격 협상 가능</span>
                  </>
                ) : product.minPrice && !product.maxPrice ? (
                  <>
                    <span className="text-xl font-bold text-gray-900">
                      {product.minPrice.toLocaleString()}원부터
                    </span>
                    <span className="text-sm text-orange-600 font-medium">최소 가격</span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-gray-900">
                    {(product.maxPrice || product.minPrice || product.price)?.toLocaleString()}원
                  </span>
                )}
              </div>
              {product.status === '예약중' && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">예약중</span>
              )}
            </>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{product.location}</span>
          <span className="mx-2">•</span>
          <span>{product.timeAgo}</span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>

      {/* 관심, 조회수 정보 */}
      <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200">
        관심 {product.likes || 0} · 조회 {Math.floor(Math.random() * 200) + 50}
      </div>

      {/* 채팅창 */}
      {showChat && (
        <div className="fixed inset-x-0 bottom-20 top-20 bg-white border-t border-gray-200 z-30 flex flex-col">
          {/* 채팅 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">안녕하세요</span>
            </div>
            <button 
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 빠른 이모지 */}
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <div className="flex gap-2 overflow-x-auto">
              {quickEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => sendQuickEmoji(emoji)}
                  className="flex-shrink-0 w-10 h-10 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 채팅 메시지 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatRef}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'buyer' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'buyer' ? 'text-orange-100' : 'text-gray-500'
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 이모지 피커 */}
          {showEmojiPicker && (
            <div className="border-t border-gray-200 bg-white p-4 max-h-40 overflow-y-auto">
              <div className="grid grid-cols-8 gap-2">
                {frequentEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 메시지 입력 */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
              >
                😊
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 액션 버튼 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-lg border ${isLiked ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-600'}`}
          >
            <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              setShowChat(!showChat);
              if (!showChat) {
                // 채팅창 열릴 때 기본 메시지 자동 입력
                setNewMessage('안녕하세요, 구매 가능할까요?');
              }
            }}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {showChat ? '채팅 닫기' : '판매자와 채팅하기'}
          </button>
        </div>
      </div>
    </div>
  );
} 