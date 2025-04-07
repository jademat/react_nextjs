'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/(auth)/login/Login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // 아이디와 비밀번호가 모두 입력되면 관리자 영역으로 이동
        if (username && password) {
            router.push('/dashboard');
        } else {
            alert('아이디와 비밀번호를 모두 입력하세요.');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2 className={styles.title}>Welcome Back!</h2>
                <form onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>
                            아이디
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            placeholder="아이디를 입력하세요"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>
                    <button type="submit" className={styles.button}>
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}
