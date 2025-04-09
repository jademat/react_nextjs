'use client';

import {useEffect, useState} from 'react';
import Header from '@/app/(Components)/layout/Header.jsx';
import Navbar from '@/app/(Components)/layout/Navbar.jsx';
import Footer from '@/app/(Components)/layout/Footer.jsx';
import '@/app/(Components)/css/layout.css';
import {useRouter} from "next/navigation"; // 전역 레이아웃 CSS

export default function AdminLayout({ children }) {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const toggleNavbar = () => setNavbarOpen(!navbarOpen);

    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다");
            router.push("/admins/login");
        }
        else {
            setChecked(true); // ✅ 인증 완료 시만 화면 보여줌
        }
    }, []);
    if (!checked) return null;
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
