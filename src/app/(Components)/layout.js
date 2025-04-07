'use client';

import { useState } from 'react';
import Header from '@/app/(Components)/layout/Header.jsx';
import Navbar from '@/app/(Components)/layout/Navbar.jsx';
import Footer from '@/app/(Components)/layout/Footer.jsx';
import '@/app/(Components)/css/layout.css'; // 전역 레이아웃 CSS

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
