'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaUsers, FaBook, FaChevronDown, FaChevronUp, FaClipboard } from 'react-icons/fa';
import styles from '@/app/(Components)/css/Navbar.module.css';

export default function Navbar({ isOpen, toggleNavbar }) {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState({
        membership: false,
        system: false,
        survey: false,
    });

    // 자동 아코디언: 현재 경로에 따라 서브메뉴 열기
    useEffect(() => {
        if (['/users/list', '/instructors/list', '/admins/list'].includes(pathname)) {
            setOpenMenus((prev) => ({ ...prev, membership: true }));
        }
        if (['/course/list', '/lectures'].includes(pathname)) {
            setOpenMenus((prev) => ({ ...prev, system: true }));
        }
        if (['/asd', '/abc'].includes(pathname)) {
            setOpenMenus((prev) => ({ ...prev, survey: true }));
        }
    }, [pathname]);

    // 현재 경로가 정확히 path이면 true
    const isActive = (path) => pathname === path;

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    return (
        <nav className={`${styles.navbar} navbar ${isOpen ? styles.open : ''}`}>
            <ul className={styles.menu}>
                {/* 회원관리 */}
                <li className={styles.menuItem}>
                    {/*
            부모 버튼에서는 isParentActive 로 active 클래스를 적용하지 않고,
            그냥 메뉴 열기/닫기만 처리.
          */}
                    <button
                        className={styles.menuButton}
                        onClick={() => toggleMenu('membership')}
                    >
                        <FaUsers className={styles.icon} /> 회원관리
                        <span className={styles.chevron}>
              {openMenus.membership ? <FaChevronUp /> : <FaChevronDown />}
            </span>
                    </button>
                    {openMenus.membership && (
                        <ul className={styles.submenu}>
                            <li className={styles.submenuItem}>
                                <Link
                                    href="/users/list"
                                    className={isActive('/users/list') ? styles.activeLink : styles.link}
                                    onClick={toggleNavbar}
                                >
                                    회원목록
                                </Link>
                            </li>
                            <li className={styles.submenuItem}>
                                <Link
                                    href="/instructors/list"
                                    className={isActive('/instructors/list') ? styles.activeLink : styles.link}
                                    onClick={toggleNavbar}
                                >
                                    강사목록
                                </Link>
                            </li>
                            <li className={styles.submenuItem}>
                                <Link
                                    href="/admins/list"
                                    className={isActive('/admins/list') ? styles.activeLink : styles.link}
                                    onClick={toggleNavbar}
                                >
                                    관리자목록
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>

                {/* 시스템관리 */}
                <li className={styles.menuItem}>
                    <button
                        className={styles.menuButton}
                        onClick={() => toggleMenu('system')}
                    >
                        <FaBook className={styles.icon} /> 시스템관리
                        <span className={styles.chevron}>
              {openMenus.system ? <FaChevronUp /> : <FaChevronDown />}
            </span>
                    </button>
                    {openMenus.system && (
                        <ul className={styles.submenu}>
                            <li className={styles.submenuItem}>
                                <Link
                                    href="/course/list"
                                    className={isActive('/course/list') ? styles.activeLink : styles.link}
                                    onClick={toggleNavbar}
                                >
                                    과정관리
                                </Link>
                            </li>
                            <li className={styles.submenuItem}>
                                <Link
                                    href="/lectures/list"
                                    className={isActive('/lectures/list') ? styles.activeLink : styles.link}
                                    onClick={toggleNavbar}
                                >
                                    강의관리
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>

                {/* 설문관리 */}
                <li className={styles.menuItem}>
                    <button
                        className={styles.menuButton}
                        onClick={() => toggleMenu('survey')}
                    >
                        <FaBook className={styles.icon} /> 설문관리
                        <span className={styles.chevron}>
              {openMenus.survey ? <FaChevronUp /> : <FaChevronDown />}
            </span>
                    </button>
                    {openMenus.survey && (
                        <ul className={styles.submenu}>
                            <li className={styles.submenuItem}>
                                <Link
                                    href="/asd"
                                    className={isActive('/asd') ? styles.activeLink : styles.link}
                                    onClick={toggleNavbar}
                                >
                                    관리
                                </Link>
                            </li>
                            <li className={styles.submenuItem}>
                                <Link
                                    href="/abc"
                                    className={isActive('/abc') ? styles.activeLink : styles.link}
                                    onClick={toggleNavbar}
                                >
                                    강의관리
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>

                {/* 게시판관리 */}
                <li className={styles.menuItem}>
                    <Link
                        href="/boards"
                        className={isActive('/boards') ? styles.activeLink : styles.link}
                        onClick={toggleNavbar}
                    >
                        <FaClipboard className={styles.icon} /> 게시판관리
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
