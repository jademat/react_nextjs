'use client';

import { useState } from 'react';
import styles from '@/app/(Components)/css/CommonList.module.css';

export default function UserList() {
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
    };

    const closeDetail = () => {
        setSelectedMember(null);
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

            {selectedMember && (
                <div className={styles.detailFormBox}>
                    <div className={styles.detailHeader}>
                        <h2>회원 상세정보</h2>
                        <button onClick={closeDetail} className={styles.closeButton}>닫기</button>
                    </div>
                    <table className={styles.detailTable}>
                        <tbody>
                        <tr>
                            <th>회원명</th>
                            <td>{selectedMember.name}</td>
                            <th>아이디</th>
                            <td>{selectedMember.userId}</td>
                        </tr>
                        <tr>
                            <th>소속</th>
                            <td>{selectedMember.affiliation}</td>
                            <th>이메일</th>
                            <td>{selectedMember.email}</td>
                        </tr>
                        <tr>
                            <th>연락처</th>
                            <td>{selectedMember.phone}</td>
                            <th>가입일</th>
                            <td>{selectedMember.regDate}</td>
                        </tr>
                        <tr>
                            <th>상태</th>
                            <td colSpan="3">{selectedMember.state}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
