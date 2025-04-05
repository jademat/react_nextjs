// app/(admin)/components/Footer.jsx
export default function Footer() {
    return (
        <footer
            style={{
                backgroundColor: '#2c3e50',
                color: '#fff',
                textAlign: 'center',
                padding: '10px',
                height: '50px',
            }}
        >
            © {new Date().getFullYear()} My Admin. All rights reserved.
        </footer>
    );
}
