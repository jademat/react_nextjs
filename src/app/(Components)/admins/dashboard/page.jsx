'use client';

import Link from 'next/link';
import styles from '@/app/(Components)/css/DashBoard.module.css';

export default function AdminDashboard() {
    // 긴급 요청 데이터 예시
    const urgentRequests = [
        '수강생 2명의 수강증이 필요합니다.',
        '마감처리 안된 강의 1건이 존재합니다.',
        '총 수강생은 0명 입니다',
    ];

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.pageTitle}>관리자 대시보드</h1>

            {/* 긴급 요청 섹션 */}
            <div className={styles.urgentBox}>
                {urgentRequests.map((msg, idx) => (
                    <div key={idx} className={styles.requestRow}>
                        <span>{msg}</span>
                        <button className={styles.requestButton}>자세히</button>
                    </div>
                ))}
            </div>

            {/* 좌우 2개의 테이블 */}
            <div className={styles.twoTableContainer}>
                {/* 왼쪽 테이블 */}
                <div className={styles.tableBox}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>열린 강의 목록</h2>
                        <Link href="/admin/sales-details" className={styles.detailLink}>
                            자세히
                        </Link>
                    </div>
                    <table className={styles.infoTable}>
                        <thead>
                        <tr>
                            <th>no</th>
                            <th>강의명</th>
                            <th>신청인원</th>
                            <th>마감일</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1건</td>
                            <td>1건</td>
                            <td>1건</td>
                            <td>1건</td>
                        </tr>
                        <tr>
                            <td>1건</td>
                            <td>1건</td>
                            <td>1건</td>
                            <td>1건</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* 오른쪽 테이블 */}
                <div className={styles.tableBox}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>수강 신청 현황</h2>
                        <Link href="/admin/payment-details" className={styles.detailLink}>
                            자세히
                        </Link>
                    </div>
                    <table className={styles.infoTable}>
                        <thead>
                        <tr>
                            <th>no</th>
                            <th>이름</th>
                            <th>신청명</th>
                            <th>신청일</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1건</td>
                            <td>1건</td>
                            <td>1건</td>
                            <td>1건</td>
                        </tr>
                        <tr>
                            <td>1건</td>
                            <td>1건</td>
                            <td>1건</td>
                            <td>1건</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
