// app/(admin)/layout.js
'use client';

import { useState } from 'react';
import Header from '@/app/admin/components/Header';
import Navbar from '@/app/admin/components/Navbar';
import Footer from '@/app/admin/components/Footer';
import '@/app/globals.css';

export default function AdminLayout({ children }) {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const toggleNavbar = () => setIsNavbarOpen(!isNavbarOpen);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* 상단 헤더 */}
            <Header toggleNavbar={toggleNavbar} isNavbarOpen={isNavbarOpen} />

            {/* 본문 영역: 네비게이션 + 콘텐츠 */}
            <div style={{ display: 'flex', flex: 1 }}>
                <Navbar isOpen={isNavbarOpen} toggleNavbar={toggleNavbar} />
                <div style={{ flex: 1, padding: '20px', background: '#f5f5f5' }}>
                    {children}
                </div>
            </div>

            {/* 하단 푸터 */}
            <Footer />
        </div>
    );
}
