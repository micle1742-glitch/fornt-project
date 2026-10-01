"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
    const pathname = usePathname();

    return (
        <header className="nav">
            <div className="nav-inner">
                <Link href="/" className="nav-logo">
                    <img src="/images/common/logo.png" alt="식권대장 뭐먹지 로고" />
                    <span>식권대장 뭐먹지</span>
                </Link>

                <nav className="nav-tabs">
                    <Link href="/" className={pathname === "/" ? "nav-tab active" : "nav-tab"}>
                        리뷰보기
                    </Link>
                    <Link href="/review" className={pathname === "/review" ? "nav-tab active" : "nav-tab"}>
                        오늘의 점심
                    </Link>
                </nav>

                <button className="nav-user" aria-label="내 정보">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                </button>
            </div>
        </header>
    );
}