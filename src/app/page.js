import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            상품 쇼핑몰
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            최고 품질의 상품들을 만나보세요
          </p>
        </div>
        
        <div className="text-center">
          <a 
            href="/products" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
          >
            상품 목록 보기
          </a>
        </div>
      </div>
    </div>
  )
}
