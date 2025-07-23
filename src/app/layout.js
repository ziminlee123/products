import "./globals.css";
import { ProductsProvider } from '../context/ProductsContext';

export const metadata = {
  title: "상품 쇼핑몰",
  description: "당근마켓 스타일의 상품 거래 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <ProductsProvider>
          {children}
        </ProductsProvider>
      </body>
    </html>
  );
}
