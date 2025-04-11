'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/(Components)/css/CourseList.module.css';
import {
    fetchCourseList,
    handleClose,
    handleCourseClick,
    handleCourseSearch,
    handleCourseSubmit,
    handleInputChange,
    handleRowClick,
    handleDeleteCourse,
    initialCourseFormData,
} from '@/app/utils/courseUtils';

export default function CourseList() {
    const [courseData, setCourseData] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isCourseOpen, setIsCourseOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [formData, setFormData] = useState(initialCourseFormData);
    const [errors, setErrors] = useState({});
    const pageSize = 10;
    const formRef = useRef(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '0');

    useEffect(() => {
        fetchCourseList(search, page, setCourseData, setTotalPages, setTotalElements);
    }, [search, page]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>과정 등록/조회</h1>

            <div className={styles.contentWrapper}>
                <div className={styles.tableWrapper}>
                    <div className={styles.toolbar}>
                        <div className={styles.searchArea}>
                            <input
                                type="text"
                                defaultValue={search}
                                onKeyDown={(e) => handleCourseSearch(e, router)}
                                placeholder="과정명, 연도, 과목구분 검색"
                                className={styles.searchInput}
                            />
                        </div>
                        <div className={styles.buttonArea}>
                            <button
                                className={styles.registerBtn}
                                onClick={() => handleCourseClick(setFormData, setIsCourseOpen, setSelectedCourse)}
                            >
                                등록
                            </button>
                        </div>
                    </div>

                    <table className={styles.courseTable}>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>과정명</th>
                            <th>수업년도</th>
                            <th>과목구분</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courseData.map((course, index) => (
                            <tr
                                key={course.courNo}
                                onClick={() => handleRowClick(course, setSelectedCourse, setIsCourseOpen)}
                                className={styles.tableRow}
                            >
                                <td>{totalElements - (page * pageSize + index)}</td>
                                <td>{course.courNm}</td>
                                <td>{course.courYear}</td>
                                <td>{course.courDept}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {totalPages > 0 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => router.push(`/course/list?page=${Math.max(0, page - 1)}${search ? `&search=${search}` : ''}`)}
                                className={styles.pageBtn}
                                disabled={page === 0}
                            >
                                ◀ 이전
                            </button>

                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => router.push(`/course/list?page=${i}${search ? `&search=${search}` : ''}`)}
                                    className={`${styles.pageBtn} ${i === page ? styles.activePageBtn : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => router.push(`/course/list?page=${Math.min(totalPages - 1, page + 1)}${search ? `&search=${search}` : ''}`)}
                                className={styles.pageBtn}
                                disabled={page === totalPages - 1}
                            >
                                다음 ▶
                            </button>
                        </div>
                    )}
                </div>

                {(selectedCourse || isCourseOpen) && (
                    <div className={styles.detailForm}>
                        <h2>{isCourseOpen ? '과정 등록' : '과정 상세정보'}</h2>
                        <form
                            onSubmit={(e) =>
                                handleCourseSubmit(
                                    e, formRef, setErrors, fetchCourseList,
                                    setIsCourseOpen, page, search,
                                    setCourseData, setTotalPages, setTotalElements
                                )
                            }
                            ref={formRef}
                            className={styles.formLayout}
                        >
                            {[
                                { name: 'courNm', label: '과정명' },
                                { name: 'courYear', label: '수업년도' },
                                { name: 'courDept', label: '과목구분' },
                                { name: 'courWeek', label: '강의주차' },
                                { name: 'weekTime', label: '주당수업시간' },
                                { name: 'fullTime', label: '총수업시간' },
                            ].map(({ name, label }) => (
                                <div className={styles.formRow} key={name}>
                                    <label htmlFor={name}>{label}</label>
                                    <input
                                        name={name}
                                        value={isCourseOpen ? formData[name] ?? '' : selectedCourse?.[name] ?? ''}
                                        onChange={isCourseOpen ? (e) => handleInputChange(e, setFormData) : undefined}
                                        readOnly={!isCourseOpen}
                                    />
                                    {isCourseOpen && errors[name] && (
                                        <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                                            {errors[name]}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className={styles.buttonRow}>
                                {isCourseOpen ? (
                                    <>
                                        <button type="submit" className={styles.submitButton}>등록</button>
                                        &nbsp;
                                        <button type="button" className={styles.closeButton} onClick={() => handleClose(setSelectedCourse, setIsCourseOpen)}>닫기</button>
                                    </>
                                ) : (
                                    <>

                                        <button
                                            type="button"
                                            className={styles.deleteButton}
                                            onClick={() =>
                                                handleDeleteCourse(
                                                    selectedCourse?.courNo,
                                                    fetchCourseList,
                                                    setSelectedCourse,
                                                    setIsCourseOpen,
                                                    page,
                                                    search,
                                                    setCourseData,
                                                    setTotalPages,
                                                    setTotalElements
                                                )
                                            }
                                        >
                                            삭제
                                        </button>
                                        &nbsp;
                                        <button type="button" className={styles.closeButton} onClick={() => handleClose(setSelectedCourse, setIsCourseOpen)}>닫기</button>
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
