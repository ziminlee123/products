import Image from "next/image";
import Link from "next/link";

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
        
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/products" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              상품 목록 보기
            </Link>
            
            <div className="flex gap-3">
              <Link 
                href="/auth/login" 
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                로그인
              </Link>
              <Link 
                href="/auth/signup" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                회원가입
              </Link>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            👆 회원가입하고 상품을 등록해보세요!
          </p>
        </div>
      </div>
    </div>
  )
}
