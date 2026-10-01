import Providers from "./providers";
import { Geist, Geist_Mono, Gaegu } from "next/font/google";
import "./globals.css";
import Nav from "./Nav";


const handFont = Gaegu({
  weight: "700",
  preload: false,
  variable: "--font-hand",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "식권대장 뭐먹지",
  description: "새싹 동대문4기 점심 맛집 리뷰와 랜덤 추천",
};
export default function RootLayout({ children }) {
  return (
        <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${handFont.variable}`}>
      <body>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
