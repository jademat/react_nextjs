import Link from 'next/link';
import styles from '@/app/(Components)/css/Header.module.css';
import {router} from "next/client.js";

export default function Header({ toggleNavbar }) {
    return (
        <header className={`${styles.header} header`}>
            {/* 모바일에서는 햄버거 메뉴 버튼 표시 */}
            <button className={styles.menuToggle} onClick={toggleNavbar}>
                ☰
            </button>
            <Link href="/admins/dashboard" className={styles.logo}>
                HLB academy
            </Link>
            <div className={styles.userInfo}>
                <span>Welcome, Admin</span>
                <button className={styles.logout}
                    onClick={() => {
                        localStorage.removeItem("accessToken");
                        alert("로그아웃 되었습니다");
                        return(
                            location.href =("/admins/login")
                        );
                    }}
                >
                    로그아웃
                </button>
            </div>
        </header>
    );
}
