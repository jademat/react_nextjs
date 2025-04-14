'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '@/app/(Components)/css/CommonList.module.css';
import { fetchInstructorList, handleRegisterSubmit, validateInstructorForm, initialForm } from '@/app/utils/instructorUtils';

export default function InstructorList() {
    const [instructorData, setInstructorData] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [errors, setErrors] = useState({});
    const formRef = useRef(null);

    const [registerData, setRegisterData] = useState(initialForm);

    useEffect(() => {
        fetchInstructorList(searchTerm, page, setInstructorData, setTotalPages, setTotalElements);
    }, [searchTerm, page]);

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
        setRegisterData(initialForm);
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
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
                <button className={styles.registerButton} onClick={toggleRegister}>등록</button>
            </div>

            <table className={styles.memberTable}>
                <thead>
                <tr>
                    <th>강사명</th>
                    <th>아이디</th>
                    <th>이메일</th>
                    <th>가입일</th>
                </tr>
                </thead>
                <tbody>
                {instructorData.map((inst) => (
                    <tr key={inst.instNo} onClick={() => handleRowClick(inst)} className={styles.tableRow}>
                        <td>{inst.instNm}</td>
                        <td>{inst.instId}</td>
                        <td>{inst.email}</td>
                        <td>{inst.instDate?.substring(0, 10)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {totalPages > 0 && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        className={styles.pageBtn}
                        disabled={page === 0}
                    >
                        ◀ 이전
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`${styles.pageBtn} ${i === page ? styles.activePageBtn : ''}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        className={styles.pageBtn}
                        disabled={page === totalPages - 1}
                    >
                        다음 ▶
                    </button>
                </div>
            )}

            {isFormOpen && (
                <div className={styles.detailBox}>
                    <div className={styles.detailHeader}>
                        <h2>{isRegisterOpen ? '강사 등록' : '강사 상세정보'}</h2>
                        <button onClick={closeDetail} className={styles.closeButton}>닫기</button>
                    </div>

                    {isRegisterOpen ? (
                        <form
                            ref={formRef}
                            onSubmit={(e) => handleRegisterSubmit(
                                e,
                                formRef,
                                registerData,
                                setRegisterData,
                                setErrors,
                                setIsRegisterOpen,
                                searchTerm,
                                page,
                                setInstructorData,
                                setTotalPages,
                                setTotalElements
                            )}
                            className={styles.registerForm}
                        >
                            <div className={styles.formRow}><label>강사명</label><input name="instNm" value={registerData.instNm} onChange={handleRegisterChange} required /></div>
                            <div className={styles.formRow}><label>아이디</label><input name="instId" value={registerData.instId} onChange={handleRegisterChange} required /></div>
                            <div className={styles.formRow}><label>비밀번호</label><input name="passwd" type="password" value={registerData.passwd} onChange={handleRegisterChange} required /></div>
                            <div className={styles.formRow}><label>성별</label>
                                <select name="genCd" value={registerData.genCd} onChange={handleRegisterChange}>
                                    <option value="">선택</option>
                                    <option value="M">남</option>
                                    <option value="F">여</option>
                                </select>
                            </div>
                            <div className={styles.formRow}><label>생년월일</label><input name="birthDate" value={registerData.birthDate} onChange={handleRegisterChange} /></div>
                            <div className={styles.formRow}><label>우편번호</label><input name="zipCd" value={registerData.zipCd} onChange={handleRegisterChange} /></div>
                            <div className={styles.formRow}><label>주소</label><input name="addr" value={registerData.addr} onChange={handleRegisterChange} /></div>
                            <div className={styles.formRow}><label>상세주소</label><input name="addrDtl" value={registerData.addrDtl} onChange={handleRegisterChange} /></div>
                            <div className={styles.formRow}><label>이메일</label><input name="email" value={registerData.email} onChange={handleRegisterChange} /></div>
                            <div className={styles.buttonRow}><button type="submit" className={styles.submitButton}>등록</button></div>
                        </form>
                    ) : (
                        <table className={styles.detailTable}>
                            <tbody>
                            <tr><th>강사명</th><td>{formData.instNm}</td><th>아이디</th><td>{formData.instId}</td></tr>
                            <tr><th>성별</th><td>{formData.genCd}</td><th>생년월일</th><td>{formData.birthDate}</td></tr>
                            <tr><th>우편번호</th><td>{formData.zipCd}</td><th>이메일</th><td>{formData.email}</td></tr>
                            <tr><th>주소</th><td colSpan="3">{formData.addr} {formData.addrDtl}</td></tr>
                            <tr><th>가입일</th><td colSpan="3">{formData.instDate?.substring(0, 10)}</td></tr>
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
