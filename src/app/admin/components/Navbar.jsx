// app/(admin)/components/Navbar.jsx
import Link from 'next/link';

export default function Navbar({ isOpen, toggleNavbar }) {
    return (
        <nav
            style={{
                width: isOpen ? '200px' : '0px',
                overflow: 'hidden',
                transition: 'width 0.3s ease',
                backgroundColor: '#34495e',
                color: '#fff',
            }}
        >
            <ul style={{ listStyle: 'none', padding: '20px', margin: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                    <Link href="/admin" style={{ color: '#fff', textDecoration: 'none' }} onClick={toggleNavbar}>
                        Dashboard
                    </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <Link href="/admin/users" style={{ color: '#fff', textDecoration: 'none' }} onClick={toggleNavbar}>
                        Users
                    </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <Link href="/admin/instructors" style={{ color: '#fff', textDecoration: 'none' }} onClick={toggleNavbar}>
                        Instructors
                    </Link>
                </li>
                <li>
                    <Link href="/admin/settings" style={{ color: '#fff', textDecoration: 'none' }} onClick={toggleNavbar}>
                        Settings
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
