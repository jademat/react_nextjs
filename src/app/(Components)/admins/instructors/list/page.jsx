'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/(Components)/css/CommonList.module.css';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

export default function InstructorList() {
    const [instructorData, setInstructorData] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [registerData, setRegisterData] = useState({
        instId: '',
        passwd: '',
        instNm: '',
        genCd: '',
        birthDate: '',
        zipCd: '',
        addr: '',
        addrDtl: '',
        email: ''
    });

    useEffect(() => {
        fetchWithAuth("http://localhost:8080/api/admins/inst/list")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.content)) {
                    setInstructorData(data.content);
                } else {
                    console.error("데이터 형식이 올바르지 않습니다.", data);
                }
            })
            .catch(error => {
                console.error("강사 데이터를 불러오는 중 오류 발생:", error);
            });
    }, []);

    const filteredInstructors = instructorData.filter((inst) =>
        [inst.instNm, inst.instId, inst.email].some((field) =>
            field?.toLowerCase().includes(searchTerm.toLowerCase())
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
            instId: '',
            passwd: '',
            instNm: '',
            genCd: '',
            birthDate: '',
            zipCd: '',
            addr: '',
            addrDtl: '',
            email: ''
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
                    <th>강사명</th>
                    <th>아이디</th>
                    <th>이메일</th>
                    <th>가입일</th>
                </tr>
                </thead>
                <tbody>
                {filteredInstructors.map((inst, index) => (
                    <tr key={inst.instNo} onClick={() => handleRowClick(inst)} className={styles.tableRow}>
                        <td>{index + 1}</td>
                        <td>{inst.instNm}</td>
                        <td>{inst.instId}</td>
                        <td>{inst.email}</td>
                        <td>{inst.instDate?.substring(0, 10)}</td>
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
                                <input name="instNm" value={registerData.instNm} onChange={handleRegisterChange} required />
                            </div>
                            <div className={styles.formRow}>
                                <label>아이디</label>
                                <input name="instId" value={registerData.instId} onChange={handleRegisterChange} />
                            </div>
                            <div className={styles.formRow}>
                                <label>비밀번호</label>
                                <input name="passwd" type="password" value={registerData.passwd} onChange={handleRegisterChange} />
                            </div>
                            <div className={styles.formRow}>
                                <label>성별</label>
                                <select name="genCd" value={registerData.genCd} onChange={handleRegisterChange}>
                                    <option value="">선택</option>
                                    <option value="M">남</option>
                                    <option value="F">여</option>
                                </select>
                            </div>
                            <div className={styles.formRow}>
                                <label>생년월일</label>
                                <input name="birthDate" type="text" value={registerData.birthDate} onChange={handleRegisterChange} />
                            </div>
                            <div className={styles.formRow}>
                                <label>우편번호</label>
                                <input name="zipCd" value={registerData.zipCd} onChange={handleRegisterChange} />
                            </div>
                            <div className={styles.formRow}>
                                <label>주소</label>
                                <input name="addr" value={registerData.addr} onChange={handleRegisterChange} />
                            </div>
                            <div className={styles.formRow}>
                                <label>상세주소</label>
                                <input name="addrDtl" value={registerData.addrDtl} onChange={handleRegisterChange} />
                            </div>
                            <div className={styles.formRow}>
                                <label>이메일</label>
                                <input name="email" value={registerData.email} onChange={handleRegisterChange} />
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
                                <td>{formData.instNm}</td>
                                <th>아이디</th>
                                <td>{formData.instId}</td>
                            </tr>
                            <tr>
                                <th>성별</th>
                                <td>{formData.genCd}</td>
                                <th>생년월일</th>
                                <td>{formData.birthDate}</td>
                            </tr>
                            <tr>
                                <th>우편번호</th>
                                <td>{formData.zipCd}</td>
                                <th>이메일</th>
                                <td>{formData.email}</td>
                            </tr>
                            <tr>
                                <th>주소</th>
                                <td colSpan="3">{formData.addr} {formData.addrDtl}</td>
                            </tr>
                            <tr>
                                <th>가입일</th>
                                <td colSpan="3">{formData.instDate?.substring(0, 10)}</td>
                            </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
