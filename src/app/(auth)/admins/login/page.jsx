'use client';

import { useRef, useState } from 'react';
import Swal from "sweetalert2";
import styles from '@/app/(auth)/admins/login/Login.module.css';

export default function LoginPage() {
    const [loginId, setLoginId] = useState('');
    const [pswd, setPswd] = useState('');
    const formLoginRef = useRef(null);
    const [errors, setErrors] = useState({});

    const processLoginok = async (values) => {
        console.log(values);
        fetch("http://localhost:8080/api/admins/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values),
        }).then(async response => {
            if (response.ok) {
                const data = await response.json();
                console.log(data);

                if (data.accessToken) {
                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("role", data.role);

                    Swal.fire({
                        icon: 'success',
                        title: '로그인 성공!',
                        showConfirmButton: false,
                        timer: 1200
                    }).then(() => {
                        location.href = "/admins/dashboard";
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: '토큰 없음',
                        text: '다시 로그인 해주세요.',
                    }).then(() => {
                        location.href = "/admins/login";
                    });
                }

            } else if (response.status === 401) {
                const message = await response.text();
                Swal.fire({
                    icon: 'error',
                    title: '로그인 실패',
                    text: message
                });
            }
        }).catch(error => {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: '서버 오류',
                text: '서버와 통신하는 중 오류가 발생했습니다!!'
            });
        });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(formLoginRef.current);
        const formValues = Object.fromEntries(formData.entries());

        const formErrors = validateLoginForm(formValues);

        if (Object.keys(formErrors).length === 0) {
            console.log('로그인 요청데이터 : ', formValues);
            processLoginok(formValues);
        } else {
            setErrors(formErrors);
            console.log(formErrors);
        }
    };

    const validateLoginForm = (values) => {
        const errors = {};
        if (!values.loginId || values.loginId.trim() === '') {
            errors.loginId = '아이디를 입력해주세요';
        }
        if (!values.pswd || values.pswd.trim() === '') {
            errors.pswd = '비밀번호를 입력해주세요';
        }
        return errors;
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2 className={styles.title}>Welcome Back!</h2>
                <form ref={formLoginRef} onSubmit={handleLoginSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="loginId" className={styles.label}>아이디</label>
                        <input
                            type="text"
                            id="loginId"
                            name="loginId"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className={styles.input}
                            placeholder="아이디를 입력하세요"
                        />
                        {errors.loginId && <div className={styles.error}>{errors.loginId}</div>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="pswd" className={styles.label}>비밀번호</label>
                        <input
                            type="password"
                            id="pswd"
                            name="pswd"
                            value={pswd}
                            onChange={(e) => setPswd(e.target.value)}
                            className={styles.input}
                            placeholder="비밀번호를 입력하세요"
                        />
                        {errors.pswd && <div className={styles.error}>{errors.pswd}</div>}
                    </div>
                    <button type="submit" className={styles.button}>로그인</button>
                </form>
            </div>
        </div>
    );
}
