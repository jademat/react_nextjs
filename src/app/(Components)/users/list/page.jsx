'use client';

import { useState } from 'react';
import styles from '@/app/(Components)/css/UserList.module.css';

export default function UserList() {
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registerData, setRegisterData] = useState({
        name: '',
        affiliation: '',
        userId: '',
        phone: '',
        email: '',
        regDate: '',
        state: '정상',
    });

    const memberData = [
        {
            no: 1,
            affiliation: '번역학과',
            name: '홍길동',
            userId: 'gildong',
            phone: '010-1234-5678',
            email: 'gildong@example.com',
            regDate: '2025-04-15',
            state: '정상',
        },
        {
            no: 2,
            affiliation: '통역학과',
            name: '이영희',
            userId: 'young',
            phone: '010-1111-2222',
            email: 'young@example.com',
            regDate: '2025-04-16',
            state: '정지',
        },
    ];

    const filteredMembers = memberData.filter((member) =>
        [member.name, member.userId, member.phone, member.email].some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleRowClick = (member) => {
        setSelectedMember(member);
        setIsRegisterOpen(false);
    };

    const closeDetail = () => {
        setSelectedMember(null);
        setIsRegisterOpen(false);
    };

    const toggleRegister = () => {
        setIsRegisterOpen(true);
        setSelectedMember(null);
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        console.log('등록 정보:', registerData);
        setIsRegisterOpen(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>회원목록</h1>

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
                    <th>회원명</th>
                    <th>아이디</th>
                    <th>연락처</th>
                    <th>이메일</th>
                    <th>가입일</th>
                    <th>상태</th>
                </tr>
                </thead>
                <tbody>
                {filteredMembers.map((member) => (
                    <tr
                        key={member.no}
                        onClick={() => handleRowClick(member)}
                        className={styles.tableRow}
                    >
                        <td>{member.no}</td>
                        <td>{member.affiliation}</td>
                        <td>{member.name}</td>
                        <td>{member.userId}</td>
                        <td>{member.phone}</td>
                        <td>{member.email}</td>
                        <td>{member.regDate}</td>
                        <td>{member.state}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {(selectedMember || isRegisterOpen) && (
                <div className={styles.detailForm}>
                    <div className={styles.detailHeader}>
                        <h2>{isRegisterOpen ? '회원 등록' : '회원 상세정보'}</h2>
                        <button onClick={closeDetail} className={styles.closeButton}>닫기</button>
                    </div>
                    <form onSubmit={isRegisterOpen ? handleRegisterSubmit : undefined} className={styles.responsiveForm}>
                        <div className={styles.formRow}>
                            <label>회원명</label>
                            <input
                                type="text"
                                name="name"
                                value={isRegisterOpen ? registerData.name : undefined}
                                onChange={isRegisterOpen ? handleRegisterChange : undefined}
                                defaultValue={!isRegisterOpen ? selectedMember?.name : undefined}
                                placeholder="회원명 입력"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>소속</label>
                            <input
                                type="text"
                                name="affiliation"
                                value={isRegisterOpen ? registerData.affiliation : undefined}
                                onChange={isRegisterOpen ? handleRegisterChange : undefined}
                                defaultValue={!isRegisterOpen ? selectedMember?.affiliation : undefined}
                                placeholder="소속 입력"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>아이디</label>
                            <input
                                type="text"
                                name="userId"
                                value={isRegisterOpen ? registerData.userId : undefined}
                                onChange={isRegisterOpen ? handleRegisterChange : undefined}
                                defaultValue={!isRegisterOpen ? selectedMember?.userId : undefined}
                                placeholder="아이디 입력"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>연락처</label>
                            <input
                                type="text"
                                name="phone"
                                value={isRegisterOpen ? registerData.phone : undefined}
                                onChange={isRegisterOpen ? handleRegisterChange : undefined}
                                defaultValue={!isRegisterOpen ? selectedMember?.phone : undefined}
                                placeholder="연락처 입력"
                            />

                        </div>
                        <div className={styles.formRow}>
                            <label>이메일</label>
                            <input
                                type="text"
                                name="email"
                                value={isRegisterOpen ? registerData.email : undefined}
                                onChange={isRegisterOpen ? handleRegisterChange : undefined}
                                defaultValue={!isRegisterOpen ? selectedMember?.email : undefined}
                                placeholder="이메일 입력"
                            />

                        </div>
                        <div className={styles.formRow}>
                            <label>가입일</label>
                            <input
                                type="date"
                                name="regDate"
                                value={isRegisterOpen ? registerData.regDate : undefined}
                                onChange={isRegisterOpen ? handleRegisterChange : undefined}
                                defaultValue={!isRegisterOpen ? selectedMember?.regDate : undefined}
                            />

                        </div>
                        <div className={styles.formRow}>
                            <label>상태</label>
                            <select
                                name="state"
                                value={isRegisterOpen ? registerData.state : undefined}
                                onChange={isRegisterOpen ? handleRegisterChange : undefined}
                                defaultValue={!isRegisterOpen ? selectedMember?.state : undefined}
                            >
                                <option value="정상">정상</option>
                                <option value="정지">정지</option>
                            </select>
                        </div>
                        <div className={styles.buttonRow}>
                            <button type="submit" className={styles.submitButton}>
                                {isRegisterOpen ? '등록' : '수정'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}