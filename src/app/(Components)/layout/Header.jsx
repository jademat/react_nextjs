import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/(Components)/css/Header.module.css';

export default function Header({ toggleNavbar }) {
    const [expirationTime, setExpirationTime] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null); // 남은 시간 상태
    const [timeExpired, setTimeExpired] = useState(false); // 만료 상태
    const [intervalId, setIntervalId] = useState(null); // intervalId 상태로 저장
    const [username, setUsername] = useState(''); // 로그인한 admin 계정 이름 상태

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            const decodedToken = decodeJwt(token);
            if (decodedToken && decodedToken.exp) {
                const expirationDate = new Date(decodedToken.exp * 1000); // exp는 초 단위로 저장됨
                setExpirationTime(expirationDate);

                // 남은 시간 계산 및 실시간 갱신
                const newIntervalId = setInterval(() => {
                    const currentTime = new Date();
                    const timeLeft = expirationDate - currentTime; // 남은 시간 (밀리초)
                    if (timeLeft > 0) {
                        setRemainingTime(timeLeft);
                    } else {
                        clearInterval(newIntervalId); // 시간이 지나면 interval 중지
                        setRemainingTime(0);
                        setTimeExpired(true); // 만료되었음을 설정
                    }
                }, 1000); // 1초마다 갱신

                // 기존 interval 제거 (겹치지 않도록)
                if (intervalId) {
                    clearInterval(intervalId);
                }

                setIntervalId(newIntervalId);
                setUsername(decodedToken.sub);

                return () => clearInterval(newIntervalId);
            }
        }
    }, []);

    // JWT 토큰을 디코딩하는 함수
    const decodeJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };

    // 남은 시간을 시:분:초 형식으로 변환하는 함수
    const formatRemainingTime = (time) => {
        const hours = Math.floor(time / 1000 / 60 / 60);
        const minutes = Math.floor((time / 1000 / 60) % 60);
        const seconds = Math.floor((time / 1000) % 60);
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    const refreshToken = () => {
        fetch('http://localhost:8080/api/admins/admin/refresh', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.accessToken) {
                    // 갱신된 토큰을 로컬 스토리지에 저장
                    localStorage.setItem('accessToken', data.accessToken);
                    Swal.fire('토큰 갱신', '토큰이 갱신되었습니다!', 'success');

                    // 새로 갱신된 토큰을 기반으로 남은 시간 재계산
                    const decodedToken = decodeJwt(data.accessToken);
                    const expirationDate = new Date(decodedToken.exp * 1000); // 새로 받은 expiration time
                    setExpirationTime(expirationDate);
                    setTimeExpired(false);

                    // 남은 시간 재계산
                    const newIntervalId = setInterval(() => {
                        const currentTime = new Date();
                        const timeLeft = expirationDate - currentTime; // 남은 시간 (밀리초)
                        if (timeLeft > 0) {
                            setRemainingTime(timeLeft);
                        } else {
                            clearInterval(newIntervalId); // 시간이 지나면 interval 중지
                            setRemainingTime(0);
                            setTimeExpired(true); // 만료되었음을 설정
                        }
                    }, 1000); // 1초마다 갱신

                    // 기존 interval 제거 (겹치지 않도록)
                    if (intervalId) {
                        clearInterval(intervalId);
                    }

                    setIntervalId(newIntervalId); // 새로 설정된 intervalId 저장
                }
            })
            .catch((err) => {
                console.error('토큰 갱신 오류', err);
                Swal.fire('갱신 실패', '토큰 갱신에 실패했습니다.', 'error');
            });
    };

    const handleLogout = () => {
        Swal.fire({
            title: '로그아웃 하시겠습니까?',
            text: '로그아웃을 진행하면 세션이 종료됩니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '로그아웃',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                // 로컬 스토리지에서 토큰 제거
                localStorage.removeItem("accessToken");
                // 로그아웃 성공 알림
                Swal.fire({
                    title: '로그아웃 완료',
                    text: '성공적으로 로그아웃되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                }).then(() => {
                    // 확인을 누른 후 로그인 페이지로 리다이렉트
                    window.location.href = "/admins/login";
                });
            }
        });
    };

    return (
        <header className={`${styles.header} header`}>
            <button className={styles.menuToggle} onClick={toggleNavbar}>
                ☰
            </button>
            <Link href="/admins/dashboard" className={styles.logo}>
                HLB academy
            </Link>
            <div className={styles.userInfo}>
                <span>Welcome, {username}</span>
                {remainingTime !== null && (
                    <span className={styles.tokenExpiry}>
                        {timeExpired ? '세션 만료됨' : `남은 시간: ${formatRemainingTime(remainingTime)}`}
                    </span>
                )}
                <button className={styles.logout} onClick={handleLogout}>
                    로그아웃
                </button>
                <button className={styles.refreshTokenButton} onClick={refreshToken}>
                    갱신
                </button>
            </div>
        </header>
    );
}
