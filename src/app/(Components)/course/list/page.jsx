'use client';

import { useState } from 'react';
import styles from '@/app/(Components)/css/CourseList.module.css';

export default function CourseList() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [formData, setFormData] = useState({
        courseName: '',
        year: '',
        department: '',
        weeks: '',
        hoursPerWeek: '',
        totalHours: '',
    });

    const courseData = [
        {
            id: 1,
            courseName: 'K-디지털 JAVA 과정',
            year: '2025',
            department: '풀스택개발',
            weeks: '24',
            hoursPerWeek: '30',
            totalHours: '720',
        },
        {
            id: 2,
            courseName: 'K-디지털 C언어 과정',
            year: '2025',
            department: '임베디드',
            weeks: '20',
            hoursPerWeek: '28',
            totalHours: '560',
        },
    ];

    const handleRowClick = (course) => {
        setSelectedCourse(course);
        setIsRegisterOpen(false);
    };

    const handleClose = () => {
        setSelectedCourse(null);
        setIsRegisterOpen(false);
    };

    const handleRegisterClick = () => {
        setFormData({
            courseName: '',
            year: '',
            department: '',
            weeks: '',
            hoursPerWeek: '',
            totalHours: '',
        });
        setIsRegisterOpen(true);
        setSelectedCourse(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('등록된 과정:', formData);
        setIsRegisterOpen(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>과정 등록/조회</h1>

            <div className={styles.contentWrapper}>
                {/* 왼쪽: 목록 */}
                <div className={styles.tableWrapper}>
                    <div className={styles.toolbar}>
                        <button className={styles.registerBtn} onClick={handleRegisterClick}>등록</button>
                    </div>

                    <table className={styles.courseTable}>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>과정명</th>
                            <th>수업년도</th>
                            <th>과목구분</th>
                            <th>주당수업</th>
                            <th>총수업시간</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courseData.map((course, idx) => (
                            <tr
                                key={course.id}
                                onClick={() => handleRowClick(course)}
                                className={styles.tableRow}
                            >
                                <td>{idx + 1}</td>
                                <td>{course.courseName}</td>
                                <td>{course.year}</td>
                                <td>{course.department}</td>
                                <td>{course.hoursPerWeek}</td>
                                <td>{course.totalHours}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 오른쪽: 폼 */}
                {(selectedCourse || isRegisterOpen) && (
                    <div className={styles.detailForm}>
                        <h2>{isRegisterOpen ? '과정 등록' : '과정 상세정보'}</h2>
                        <form onSubmit={handleSubmit} className={styles.formLayout}>
                            <div className={styles.formRow}>
                                <label>과정명</label>
                                <input
                                    name="courseName"
                                    value={isRegisterOpen ? formData.courseName : selectedCourse?.courseName || ''}
                                    onChange={isRegisterOpen ? handleInputChange : undefined}
                                    readOnly={!isRegisterOpen}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label>수업년도</label>
                                <input
                                    name="year"
                                    value={isRegisterOpen ? formData.year : selectedCourse?.year || ''}
                                    onChange={isRegisterOpen ? handleInputChange : undefined}
                                    readOnly={!isRegisterOpen}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label>과목구분</label>
                                <input
                                    name="department"
                                    value={isRegisterOpen ? formData.department : selectedCourse?.department || ''}
                                    onChange={isRegisterOpen ? handleInputChange : undefined}
                                    readOnly={!isRegisterOpen}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label>강의주차</label>
                                <input
                                    name="weeks"
                                    value={isRegisterOpen ? formData.weeks : selectedCourse?.weeks || ''}
                                    onChange={isRegisterOpen ? handleInputChange : undefined}
                                    readOnly={!isRegisterOpen}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label>주당수업시간</label>
                                <input
                                    name="hoursPerWeek"
                                    value={isRegisterOpen ? formData.hoursPerWeek : selectedCourse?.hoursPerWeek || ''}
                                    onChange={isRegisterOpen ? handleInputChange : undefined}
                                    readOnly={!isRegisterOpen}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label>총수업시간</label>
                                <input
                                    name="totalHours"
                                    value={isRegisterOpen ? formData.totalHours : selectedCourse?.totalHours || ''}
                                    onChange={isRegisterOpen ? handleInputChange : undefined}
                                    readOnly={!isRegisterOpen}
                                />
                            </div>

                            <div className={styles.buttonRow}>
                                {isRegisterOpen ? (
                                    <>
                                        <button type="submit" className={styles.submitButton}>등록</button>&nbsp;
                                        <button type="button" className={styles.closeButton} onClick={handleClose}>닫기</button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" className={styles.submitButton}>수정</button>&nbsp;
                                        <button type="button" className={styles.closeButton} onClick={handleClose}>닫기</button>
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
