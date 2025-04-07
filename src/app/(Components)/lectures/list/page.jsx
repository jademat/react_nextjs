'use client';

import { useState } from 'react';
import styles from '@/app/(Components)/css/LectureList.module.css';

export default function LectureList() {
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const lectures = [
        {
            id: 1,
            course: 'K-디지털 JAVA 과정',
            title: '자바 기초와 실습',
            instructor: '홍길동',
            startDate: '2025-06-01',
            endDate: '2025-08-31',
            quota: 30,
            applicants: 3,
        },
        {
            id: 2,
            course: 'K-디지털 C언어 과정',
            title: 'C언어 입문',
            instructor: '이영희',
            startDate: '2025-05-01',
            endDate: '2025-06-30',
            quota: 20,
            applicants: 10,
        },
    ];

    const filteredLectures = lectures.filter((lec) =>
        lec.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>강의 등록/조회</h1>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    placeholder="강의명 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <table className={styles.lectureTable}>
                <thead>
                <tr>
                    <th>No</th>
                    <th>과정명</th>
                    <th>강의명</th>
                    <th>강사</th>
                    <th>시작일</th>
                    <th>마감일</th>
                    <th>정원</th>
                    <th>신청자</th>
                </tr>
                </thead>
                <tbody>
                {filteredLectures.map((lecture, idx) => (
                    <tr
                        key={lecture.id}
                        onClick={() => setSelectedLecture(lecture)}
                        className={styles.tableRow}
                    >
                        <td>{idx + 1}</td>
                        <td>{lecture.course}</td>
                        <td>{lecture.title}</td>
                        <td>{lecture.instructor}</td>
                        <td>{lecture.startDate}</td>
                        <td>{lecture.endDate}</td>
                        <td>{lecture.quota}</td>
                        <td>{lecture.applicants}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedLecture && (
                <div className={styles.detailBox}>
                    <div className={styles.detailHeader}>
                        <h2>강의 상세정보</h2>
                        <button className={styles.closeBtn} onClick={() => setSelectedLecture(null)}>
                            닫기
                        </button>
                    </div>
                    <div className={styles.detailContent}>
                        <div><strong>과정명:</strong> {selectedLecture.course}</div>
                        <div><strong>강의명:</strong> {selectedLecture.title}</div>
                        <div><strong>강사:</strong> {selectedLecture.instructor}</div>
                        <div><strong>시작일:</strong> {selectedLecture.startDate}</div>
                        <div><strong>마감일:</strong> {selectedLecture.endDate}</div>
                        <div><strong>정원:</strong> {selectedLecture.quota}명</div>
                        <div><strong>신청자 수:</strong> {selectedLecture.applicants}명</div>
                        {today >= selectedLecture.endDate &&
                            selectedLecture.applicants < selectedLecture.quota * (2 / 3) && (
                                <button className={styles.cancelBtn}>폐강처리</button>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
}
