// app/layout.js
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

export const metadata = {
    title: 'HLBAcademy',
    description: 'Admin Dashboard Example',
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
        <body>{children}</body>
        </html>
    );
}
