'use client';

import { useState } from 'react';
import styles from '@/app/(Components)/css/LectureList.module.css';

export default function LectureList() {
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        course: '',
        title: '',
        instructor: '',
        startDate: '',
        endDate: '',
        quota: '',
        applicants: '',
    });

    const today = new Date().toISOString().split('T')[0];

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
            applicantList: [
                { name: '홍길동', phone: '010-1234-5678', email: 'hong@example.com' },
                { name: '김민수', phone: '010-5678-1234', email: 'kim@example.com' },
            ],
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
            applicantList: [
                { name: '이영희', phone: '010-9999-8888', email: 'lee@example.com' },
            ],
        },
    ];

    const filteredLectures = lectures.filter((lec) =>
        lec.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = (lecture) => {
        setSelectedLecture(lecture);
        setIsRegisterOpen(false);
    };

    const handleRegisterClick = () => {
        setFormData({
            course: '',
            title: '',
            instructor: '',
            startDate: '',
            endDate: '',
            quota: '',
            applicants: '',
        });
        setSelectedLecture(null);
        setIsRegisterOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('등록된 강의:', formData);
        setIsRegisterOpen(false);
    };

    const handleClose = () => {
        setSelectedLecture(null);
        setIsRegisterOpen(false);
    };

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
                <button className={styles.registerBtn} onClick={handleRegisterClick}>등록</button>
            </div>

            <div className={styles.wrapper}>
                <div className={styles.tableWrapper}>
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
                                onClick={() => handleRowClick(lecture)}
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
                </div>

                {(selectedLecture || isRegisterOpen) && (
                    <div className={styles.detailBox}>
                        <h2>{isRegisterOpen ? '강의 등록' : '강의 상세정보'}</h2>
                        <form className={styles.formLayout} onSubmit={handleSubmit}>
                            {['course', 'title', 'instructor', 'startDate', 'endDate', 'quota', 'applicants'].map((field, i) => (
                                <div className={styles.formRow} key={i}>
                                    <label>{{
                                        course: '과정명',
                                        title: '강의명',
                                        instructor: '강사',
                                        startDate: '시작일',
                                        endDate: '마감일',
                                        quota: '정원',
                                        applicants: '신청자 수'
                                    }[field]}</label>
                                    <input
                                        type={field.includes('Date') ? 'date' : 'text'}
                                        name={field}
                                        value={
                                            isRegisterOpen
                                                ? formData[field]
                                                : selectedLecture?.[field] || ''
                                        }
                                        onChange={isRegisterOpen ? handleInputChange : undefined}
                                        readOnly={!isRegisterOpen}
                                    />
                                </div>
                            ))}

                            {!isRegisterOpen && selectedLecture?.applicantList?.length > 0 && (
                                <div className={styles.applicantList}>
                                    <h3>신청자 명단</h3>
                                    <table className={styles.applicantTable}>
                                        <thead>
                                        <tr>
                                            <th>이름</th>
                                            <th>연락처</th>
                                            <th>이메일</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedLecture.applicantList.map((app, i) => (
                                            <tr key={i}>
                                                <td>{app.name}</td>
                                                <td>{app.phone}</td>
                                                <td>{app.email}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className={styles.buttonRow}>
                                {isRegisterOpen ? (
                                    <>
                                        <button type="submit" className={styles.submitButton}>등록</button>
                                        <button type="button" onClick={handleClose} className={styles.closeButton}>닫기</button>
                                    </>
                                ) : (
                                    <>
                                        {today >= selectedLecture.endDate &&
                                            selectedLecture.applicants < selectedLecture.quota * 2 / 3 && (
                                                <button className={styles.cancelBtn}>폐강처리</button>
                                            )}
                                        <button type="button" onClick={handleClose} className={styles.closeButton}>닫기</button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
