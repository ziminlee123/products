import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase 환경 변수가 없으면 null로 설정 (개발 중에는 더미 데이터 사용)
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// 더미 데이터 (Supabase 연결 안 될 때 사용)
const dummyProducts = [
  {
    id: "1",
    title: "파세코 창문형 인버터 에어컨 PWA-3250W",
    description: "파세코 창문형 인버터 에어컨 판매합니다!\n\n• 모델명: PWA-3250W\n• 2023년 6월 구매 (1년 사용)\n• 냉방능력: 3.2kW (10-13평형)\n• 인버터 방식으로 전기료 절약\n\n이사로 인한 급처분입니다.",
    price: 340000,
    image_url: "https://images.unsplash.com/photo-1631545806634-4b3d25632e9c?w=800&h=600&fit=crop&crop=center",
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "캐리어 벽걸이 에어컨",
    description: "캐리어 벽걸이 에어컨 나눔합니다 💛\n\n• 구형 모델이지만 정상 작동\n• 약 15년 정도 사용 (2009년 구매)\n• 냉방은 잘 되나 소음이 약간 있음\n\n이사 가면서 새 에어컨으로 교체해서 나눔해요.",
    price: 0,
    image_url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop&crop=center",
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "m1 맥북 a급 급처",
    description: "맥북 에어 M1 A급 상태로 급처분합니다!\n\n• MacBook Air 13인치 (2020)\n• Apple M1 칩, 8GB RAM, 256GB SSD\n• 스페이스 그레이 색상\n• 배터리 사이클: 245회 (양호)\n\n해외 출장으로 인한 급처분입니다.",
    price: 700000,
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&crop=center",
    created_at: new Date().toISOString()
  }
];

// 테이블 함수들
export const supabaseApi = {
  // 상품 관련 API
  products: {
    // 모든 상품 가져오기
    getAll: async () => {
      if (!supabase) {
        console.log('Supabase가 연결되지 않았습니다. 더미 데이터를 반환합니다.');
        return dummyProducts;
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    // ID로 상품 가져오기
    getById: async (id) => {
      if (!supabase) {
        const product = dummyProducts.find(p => p.id === id);
        if (!product) throw new Error('상품을 찾을 수 없습니다.');
        return product;
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    // 새 상품 추가하기
    create: async (product) => {
      if (!supabase) {
        const newProduct = {
          ...product,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        dummyProducts.unshift(newProduct);
        return newProduct;
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    // 상품 업데이트하기
    update: async (id, updates) => {
      if (!supabase) {
        const index = dummyProducts.findIndex(p => p.id === id);
        if (index === -1) throw new Error('상품을 찾을 수 없습니다.');
        dummyProducts[index] = { ...dummyProducts[index], ...updates };
        return dummyProducts[index];
      }
      
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    // 상품 삭제하기
    delete: async (id) => {
      if (!supabase) {
        const index = dummyProducts.findIndex(p => p.id === id);
        if (index === -1) throw new Error('상품을 찾을 수 없습니다.');
        dummyProducts.splice(index, 1);
        return;
      }
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },

    // 검색하기
    search: async (query) => {
      if (!supabase) {
        return dummyProducts.filter(product =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  }
} 