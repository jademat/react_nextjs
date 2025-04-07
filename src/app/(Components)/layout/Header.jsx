import Link from 'next/link';
import styles from '@/app/(Components)/css/Header.module.css';

export default function Header({ toggleNavbar }) {
    return (
        <header className={`${styles.header} header`}>
            {/* 모바일에서는 햄버거 메뉴 버튼 표시 */}
            <button className={styles.menuToggle} onClick={toggleNavbar}>
                ☰
            </button>
            <Link href="/dashboard" className={styles.logo}>
                HLB academy
            </Link>
            <div className={styles.userInfo}>
                <span>Welcome, Admin</span>
                <button className={styles.logout}>Logout</button>
            </div>
        </header>
    );
}
