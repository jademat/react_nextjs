'use client';

import { useState } from 'react';
import Header from '@/app/admin/layout/Header';
import Navbar from '@/app/admin/layout/Navbar';
import Footer from '@/app/admin/layout/Footer';
import '@/app/admin/css/layout.css'; // 전역 레이아웃 CSS

export default function AdminLayout({ children }) {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const toggleNavbar = () => setNavbarOpen(!navbarOpen);

    return (
        <>
            <Header toggleNavbar={toggleNavbar} />
            <Navbar isOpen={navbarOpen} toggleNavbar={toggleNavbar} />
            <div className="contentArea">
                {children}
            </div>
            <Footer />
        </>
    );
}
