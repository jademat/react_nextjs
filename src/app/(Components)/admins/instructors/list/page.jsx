'use client';

import { useState } from 'react';
import styles from '@/app/(Components)/css/CommonList.module.css';

export default function InstructorList() {
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [registerData, setRegisterData] = useState({
        name: '',
        affiliation: '',
        userId: '',
        phone: '',
        email: '',
        regDate: '',
        state: '정상',
    });

    const instructorData = [
        {
            no: 1,
            affiliation: '영어과',
            name: '김철수',
            userId: 'chulsoo',
            phone: '010-9876-5432',
            email: 'chulsoo@example.com',
            regDate: '2025-04-10',
            state: '정상',
        },
        {
            no: 2,
            affiliation: '프랑스어과',
            name: '박영희',
            userId: 'younghee',
            phone: '010-1234-1111',
            email: 'younghee@example.com',
            regDate: '2025-04-12',
            state: '정지',
        },
    ];

    const filteredInstructors = instructorData.filter((inst) =>
        [inst.name, inst.userId, inst.phone, inst.email].some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleRowClick = (inst) => {
        setSelectedInstructor(inst);
        setIsRegisterOpen(false);
    };

    const closeDetail = () => {
        setSelectedInstructor(null);
        setIsRegisterOpen(false);
    };

    const toggleRegister = () => {
        setIsRegisterOpen(true);
        setSelectedInstructor(null);
        setRegisterData({
            name: '',
            affiliation: '',
            userId: '',
            phone: '',
            email: '',
            regDate: '',
            state: '정상',
        });
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        console.log('등록된 강사:', registerData);
        setIsRegisterOpen(false);
    };

    const isFormOpen = selectedInstructor || isRegisterOpen;
    const formData = isRegisterOpen ? registerData : selectedInstructor || {};

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>강사 목록</h1>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    placeholder="이름, 아이디, 이메일 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <button className={styles.registerBtn} onClick={toggleRegister}>등록</button>
            </div>

            <table className={styles.memberTable}>
                <thead>
                <tr>
                    <th>No</th>
                    <th>소속</th>
                    <th>강사명</th>
                    <th>아이디</th>
                    <th>연락처</th>
                    <th>이메일</th>
                    <th>가입일</th>
                    <th>상태</th>
                </tr>
                </thead>
                <tbody>
                {filteredInstructors.map((inst) => (
                    <tr
                        key={inst.no}
                        onClick={() => handleRowClick(inst)}
                        className={styles.tableRow}
                    >
                        <td>{inst.no}</td>
                        <td>{inst.affiliation}</td>
                        <td>{inst.name}</td>
                        <td>{inst.userId}</td>
                        <td>{inst.phone}</td>
                        <td>{inst.email}</td>
                        <td>{inst.regDate}</td>
                        <td>{inst.state}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {isFormOpen && (
                <div className={styles.detailFormBox}>
                    <div className={styles.detailHeader}>
                        <h2>{isRegisterOpen ? '강사 등록' : '강사 상세정보'}</h2>
                        <button onClick={closeDetail} className={styles.closeButton}>닫기</button>
                    </div>

                    {isRegisterOpen ? (
                        <form onSubmit={handleRegisterSubmit} className={styles.responsiveForm}>
                            <div className={styles.formRow}>
                                <label>강사명</label>
                                <input name="name" value={registerData.name} onChange={handleRegisterChange} required />
                            </div>
                            <div className={styles.formRow}>
                                <label>소속</label>
                                <input name="affiliation" value={registerData.affiliation} onChange={handleRegisterChange} />
                            </div>
                            <div className={styles.formRow}>
                                <label>아이디</label>
                                <input name="userId" value={registerData.userId} onChange={handleRegisterChange} />
                            </div>
                            <div className={styles.formRow}>
                                <label>연락처</label>
                                <input name="phone" value={registerData.phone} onChange={handleRegisterChange} />
                            </div>
                            <div className={styles.formRow}>
                                <label>이메일</label>
                                <input name="email" value={registerData.email} onChange={handleRegisterChange} />
                            </div>
                            <div className={styles.formRow}>
                                <label>가입일</label>
                                <input name="regDate" type="date" value={registerData.regDate} onChange={handleRegisterChange} />
                            </div>
                            <div className={styles.formRow}>
                                <label>상태</label>
                                <select name="state" value={registerData.state} onChange={handleRegisterChange}>
                                    <option value="정상">정상</option>
                                    <option value="정지">정지</option>
                                </select>
                            </div>
                            <div className={styles.buttonRow}>
                                <button type="submit" className={styles.submitButton}>등록</button>
                            </div>
                        </form>
                    ) : (
                        <table className={styles.detailTable}>
                            <tbody>
                            <tr>
                                <th>강사명</th>
                                <td>{formData.name}</td>
                                <th>소속</th>
                                <td>{formData.affiliation}</td>
                            </tr>
                            <tr>
                                <th>아이디</th>
                                <td>{formData.userId}</td>
                                <th>연락처</th>
                                <td>{formData.phone}</td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td>{formData.email}</td>
                                <th>가입일</th>
                                <td>{formData.regDate}</td>
                            </tr>
                            <tr>
                                <th>상태</th>
                                <td colSpan="3">{formData.state}</td>
                            </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
