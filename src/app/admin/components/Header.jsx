// app/(admin)/components/Header.jsx
export default function Header({ toggleNavbar, isNavbarOpen }) {
    return (
        <header
            style={{
                backgroundColor: '#2c3e50',
                color: '#fff',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '60px',
            }}
        >
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>My Admin</div>
            <button
                onClick={toggleNavbar}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '18px',
                    cursor: 'pointer',
                }}
            >
                {isNavbarOpen ? 'Close Menu' : 'Open Menu'}
            </button>
        </header>
    );
}
