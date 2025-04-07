'use client';

import { useState } from 'react';
import styles from '@/app/(Components)/css/CommonList.module.css';

export default function AdminList() {
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registerData, setRegisterData] = useState({
        name: '',
        department: '',
        userId: '',
        phone: '',
        email: '',
        regDate: '',
        state: '정상',
    });

    const [adminData, setAdminData] = useState([
        {
            no: 1,
            department: '총무부',
            name: '관리자1',
            userId: 'admin1',
            phone: '010-2222-3333',
            email: 'admin1@example.com',
            regDate: '2025-04-01',
            state: '정상',
        },
        {
            no: 2,
            department: '기획부',
            name: '관리자2',
            userId: 'admin2',
            phone: '010-4444-5555',
            email: 'admin2@example.com',
            regDate: '2025-04-02',
            state: '정지',
        },
    ]);

    const filteredAdmins = adminData.filter((admin) =>
        [admin.name, admin.userId, admin.phone, admin.email].some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleRowClick = (admin) => {
        setSelectedAdmin(admin);
        setIsRegisterOpen(false);
    };

    const closeForm = () => {
        setSelectedAdmin(null);
        setIsRegisterOpen(false);
    };

    const toggleRegister = () => {
        setIsRegisterOpen(true);
        setSelectedAdmin(null);
        setRegisterData({
            name: '',
            department: '',
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
        const newAdmin = {
            ...registerData,
            no: adminData.length + 1,
        };
        setAdminData((prev) => [...prev, newAdmin]);
        setIsRegisterOpen(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedAdmin((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setAdminData((prev) =>
            prev.map((admin) =>
                admin.no === selectedAdmin.no ? selectedAdmin : admin
            )
        );
        setSelectedAdmin(null);
    };

    const isFormOpen = selectedAdmin || isRegisterOpen;
    const formData = isRegisterOpen ? registerData : selectedAdmin || {};

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>관리자 목록</h1>

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
                    <th>부서</th>
                    <th>이름</th>
                    <th>아이디</th>
                    <th>연락처</th>
                    <th>이메일</th>
                    <th>가입일</th>
                    <th>상태</th>
                </tr>
                </thead>
                <tbody>
                {filteredAdmins.map((admin) => (
                    <tr key={admin.no} onClick={() => handleRowClick(admin)} className={styles.tableRow}>
                        <td>{admin.no}</td>
                        <td>{admin.department}</td>
                        <td>{admin.name}</td>
                        <td>{admin.userId}</td>
                        <td>{admin.phone}</td>
                        <td>{admin.email}</td>
                        <td>{admin.regDate}</td>
                        <td>{admin.state}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {isFormOpen && (
                <div className={styles.detailForm}>
                    <div className={styles.detailHeader}>
                        <h2>{isRegisterOpen ? '관리자 등록' : '관리자 정보 수정'}</h2>
                        <button onClick={closeForm} className={styles.closeButton}>닫기</button>
                    </div>
                    <form
                        onSubmit={isRegisterOpen ? handleRegisterSubmit : handleEditSubmit}
                        className={styles.responsiveForm}
                    >
                        <div className={styles.formRow}>
                            <label>이름</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={isRegisterOpen ? handleRegisterChange : handleEditChange}
                                placeholder="이름 입력"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>부서</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={isRegisterOpen ? handleRegisterChange : handleEditChange}
                                placeholder="부서 입력"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>아이디</label>
                            <input
                                type="text"
                                name="userId"
                                value={formData.userId}
                                onChange={isRegisterOpen ? handleRegisterChange : handleEditChange}
                                placeholder="아이디 입력" readOnly
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>연락처</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={isRegisterOpen ? handleRegisterChange : handleEditChange}
                                placeholder="연락처 입력"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>이메일</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={isRegisterOpen ? handleRegisterChange : handleEditChange}
                                placeholder="이메일 입력"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>가입일</label>
                            <input
                                type="date"
                                name="regDate"
                                value={formData.regDate}
                                onChange={isRegisterOpen ? handleRegisterChange : handleEditChange}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>상태</label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={isRegisterOpen ? handleRegisterChange : handleEditChange}
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
