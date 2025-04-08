'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '@/app/(Components)/css/CommonList.module.css';

export default function AdminListPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [adminData, setAdminData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '0');

    // 리스트검색
    useEffect(() => {
        const apiUrl = `http://localhost:8080/api/admins/admin/list?page=${page}${search ? `&search=${search}` : ''}`;
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setAdminData(data.content || []);
                setTotalPages(data.totalPages || 0);
            })
            .catch(console.error);
    }, [search, page]);

    // 상세보기
    const handleRowClick = (adminNo) => {
        fetch(`http://localhost:8080/api/admins/admin/detail/${adminNo}`)
            .then(res => res.json())
            .then(data => setSelectedAdmin(data))
            .catch(console.error);
    };

    // 엔터시 검색
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const keyword = e.target.value.trim();
            router.push(`/admins/admin/list?page=0${keyword ? `&search=${keyword}` : ''}`);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>관리자 목록</h1>

            <div className={styles.toolbar}>
                <div className={styles.searchArea}>
                    <input
                        type="text"
                        defaultValue={search}
                        onKeyDown={handleSearch}
                        placeholder="이름, 아이디, 이메일 검색"
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.buttonArea}>
                    <button className={styles.registerButton}>등록</button>
                </div>
            </div>

            <table className={styles.memberTable}>
                <thead>
                <tr>
                    <th>No</th>
                    <th>이름</th>
                    <th>아이디</th>
                    <th>이메일</th>
                    <th>연락처</th>
                    <th>주소</th>
                </tr>
                </thead>
                <tbody>
                {adminData.map((admin) => (
                    <tr key={admin.adminNo} onClick={() => handleRowClick(admin.adminNo)} className={styles.tableRow}>
                        <td>{admin.adminNo}</td>
                        <td>{admin.adminNm}</td>
                        <td>{admin.loginId}</td>
                        <td>{admin.email}</td>
                        <td>{admin.hpNo}</td>
                        <td>{admin.addr} {admin.addrDtl}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.pagination}>
                <button
                    onClick={() => router.push(`/admins/admin/list?page=${Math.max(0, page - 1)}${search ? `&search=${search}` : ''}`)}
                    className={styles.pageBtn}
                    disabled={page === 0}
                >
                    ◀ 이전
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => router.push(`/admins/admin/list?page=${i}${search ? `&search=${search}` : ''}`)}
                        className={`${styles.pageBtn} ${i === page ? styles.activePageBtn : ''}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => router.push(`/admins/admin/list?page=${Math.min(totalPages - 1, page + 1)}${search ? `&search=${search}` : ''}`)}
                    className={styles.pageBtn}
                    disabled={page === totalPages - 1}
                >
                    다음 ▶
                </button>
            </div>

            {selectedAdmin && (
                <div className={styles.detailBox}>
                    <table className={styles.detailTable}>
                        <tbody>
                        <tr>
                            <th>아이디</th>
                            <td>{selectedAdmin.loginId}</td>
                            <th>이름</th>
                            <td>{selectedAdmin.adminNm}</td>
                        </tr>
                        <tr>
                            <th>이메일</th>
                            <td>{selectedAdmin.email}</td>
                            <th>연락처</th>
                            <td>{selectedAdmin.hpNo}</td>
                        </tr>
                        <tr>
                            <th>성별</th>
                            <td>{selectedAdmin.genCd || '-'}</td>
                            <th>생년월일</th>
                            <td>{selectedAdmin.birthDate || '-'}</td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td colSpan={3}>
                                {selectedAdmin.addr || ''} {selectedAdmin.addrDtl || ''}
                            </td>
                        </tr>
                        <tr>
                            <th>생성일</th>
                            <td colSpan={3}>
                                {selectedAdmin.addrDate ? selectedAdmin.addrDate.replace('T', ' ').substring(0, 16) : '-'}
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <div className={styles.buttonRow}>
                        <button onClick={() => setSelectedAdmin(null)} className={styles.closeButton}>
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
