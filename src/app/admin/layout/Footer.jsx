import styles from '@/app/admin/css/Footer.module.css';

export default function Footer() {
    return (
        <footer className={`${styles.footer} footer`}>
            © {new Date().getFullYear()} HLB academy. All rights reserved.
        </footer>
    );
}
