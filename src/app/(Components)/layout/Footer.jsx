import styles from '@/app/(Components)/css/Footer.module.css';

export default function Footer() {
    return (
        <footer className={`${styles.footer} footer`}>
            © {new Date().getFullYear()} HLB academy. All rights reserved.
        </footer>
    );
}
