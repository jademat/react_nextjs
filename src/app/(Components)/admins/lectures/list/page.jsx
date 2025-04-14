'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '@/app/(Components)/css/LectureList.module.css';
import {
    fetchLectureList,
    fetchLectureDetail,
    fetchCourses,
    fetchInstructors,
    handleLectureSubmit,
    handleClose,
    handleInputChange,
    handleLectureClick,
    initialLectureForm,
    formatDate,
    calculateEndDate,
} from '@/app/utils/lectureUtils';

export default function LectureList() {
    const formRef = useRef(null);

    const [lectureData, setLectureData] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [formData, setFormData] = useState(initialLectureForm);
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        fetchLectureList(searchTerm, page, setLectureData, setTotalPages, setTotalElements);
        fetchCourses(setCourses);
        fetchInstructors(setInstructors);
    }, [searchTerm, page]);

    const handleRowClickWithDetail = async (lecture) => {
        const detail = await fetchLectureDetail(lecture.lectNo);
        setSelectedLecture(detail);
        setIsRegisterOpen(false);
    };

    const handleStartChange = (e) => {
        const start = e.target.value;
        const course = courses.find(c => c.courNo === parseInt(formData.courNo));
        if (course) {
            const end = calculateEndDate(start, course.fullTime, course.weekTime);
            setFormData(prev => ({ ...prev, lectStart: start, lectSubmit: end }));
        } else {
            setFormData(prev => ({ ...prev, lectStart: start }));
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>강의 등록/조회</h1>
            <div className={styles.wrapper}>
                <div className={styles.tableWrapper}>
                    <div className={styles.toolbar}>
                        <input
                            type="text"
                            placeholder="강의명, 강사명 검색"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(0);
                            }}
                            className={styles.searchInput}
                        />
                        <button className={styles.registerBtn} onClick={() => handleLectureClick(setFormData, setIsRegisterOpen, setSelectedLecture)}>
                            등록
                        </button>
                    </div>

                    <table className={styles.lectureTable}>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>강의명</th>
                            <th>강사명</th>
                            <th>개강일</th>
                            <th>수료일</th>
                            <th>상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {lectureData.map((lecture, index) => (
                            <tr key={lecture.lectNo} onClick={() => handleRowClickWithDetail(lecture)} className={styles.tableRow}>
                                <td>{totalElements - (page * pageSize + index)}</td>
                                <td>{lecture.lectNm}</td>
                                <td>{lecture.instNm}</td>
                                <td>{formatDate(lecture.lectStart)}</td>
                                <td>{formatDate(lecture.lectSubmit)}</td>
                                <td>{lecture.lectStatus}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {totalPages > 0 && (
                        <div className={styles.pagination}>
                            <button onClick={() => setPage(Math.max(0, page - 1))} className={styles.pageBtn} disabled={page === 0}>◀ 이전</button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`${styles.pageBtn} ${i === page ? styles.activePageBtn : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} className={styles.pageBtn} disabled={page === totalPages - 1}>다음 ▶</button>
                        </div>
                    )}
                </div>

                {(selectedLecture || isRegisterOpen) && (
                    <div className={styles.detailBox}>
                        <h2>{isRegisterOpen ? '강의 등록' : '강의 상세정보'}</h2>
                        <form
                            onSubmit={(e) => handleLectureSubmit(
                                e, formRef, setFormData, setIsRegisterOpen, setErrors,
                                fetchLectureList, searchTerm, page, setLectureData,
                                setTotalPages, setTotalElements, instructors, lectureData, setInstructors
                            )}
                            ref={formRef}
                            className={styles.formLayout}
                        >
                            <div className={styles.formRow}><label>과정명</label>
                                {isRegisterOpen ? (
                                    <select name="courNo" value={formData.courNo} onChange={(e) => handleInputChange(e, setFormData)}>
                                        <option value="">선택</option>
                                        {courses.map(course => (
                                            <option key={course.courNo} value={course.courNo}>{course.courNm}</option>
                                        ))}
                                    </select>
                                ) : (<input type="text" readOnly value={selectedLecture?.courNm || ''} />)}
                                {isRegisterOpen && errors.courNo && <div className={styles.error}>{errors.courNo}</div>}
                            </div>

                            <div className={styles.formRow}><label>강사명</label>
                                {isRegisterOpen ? (
                                    <select name="instNo" value={formData.instNo} onChange={(e) => handleInputChange(e, setFormData)}>
                                        <option value="">선택</option>
                                        {instructors.map(inst => (
                                            <option key={inst.instNo} value={inst.instNo}>{inst.instNm}</option>
                                        ))}
                                    </select>
                                ) : (<input type="text" readOnly value={selectedLecture?.instNm || ''} />)}
                                {isRegisterOpen && errors.instNo && <div className={styles.error}>{errors.instNo}</div>}
                            </div>

                            <div className={styles.formRow}><label>강의명</label>
                                <input name="lectNm" value={isRegisterOpen ? formData.lectNm : selectedLecture?.lectNm || ''} onChange={(e) => handleInputChange(e, setFormData)} readOnly={!isRegisterOpen} />
                                {isRegisterOpen && errors.lectNm && <div className={styles.error}>{errors.lectNm}</div>}
                            </div>
                            <div className={styles.formRow}><label>강의 금액</label>
                                <input type="number" name="lectPrice" value={isRegisterOpen ? formData.lectPrice : selectedLecture?.lectPrice || ''} onChange={(e) => handleInputChange(e, setFormData)} readOnly={!isRegisterOpen} />
                                {isRegisterOpen && errors.lectPrice && <div className={styles.error}>{errors.lectPrice}</div>}
                            </div>
                            <div className={styles.formRow}><label>계획서</label>
                                <input name="lectDesc" value={isRegisterOpen ? formData.lectDesc : selectedLecture?.lectDesc || ''} onChange={(e) => handleInputChange(e, setFormData)} readOnly={!isRegisterOpen} />
                            </div>
                            <div className={styles.formRow}><label>개강일</label>
                                <input type="date" name="lectStart" value={isRegisterOpen ? formData.lectStart : formatDate(selectedLecture?.lectStart)} onChange={handleStartChange} />
                                {isRegisterOpen && errors.lectStart && <div className={styles.error}>{errors.lectStart}</div>}
                            </div>
                            <div className={styles.formRow}><label>수료일</label>
                                <input type="date" name="lectSubmit" value={isRegisterOpen ? formData.lectSubmit : formatDate(selectedLecture?.lectSubmit)} onChange={(e) => handleInputChange(e, setFormData)} readOnly={!isRegisterOpen} />
                                {isRegisterOpen && errors.lectSubmit && <div className={styles.error}>{errors.lectSubmit}</div>}
                            </div>
                            <div className={styles.formRow}><label>학원 위치</label>
                                <input name="lectLoc" value={isRegisterOpen ? formData.lectLoc : selectedLecture?.lectLoc || ''} onChange={(e) => handleInputChange(e, setFormData)} readOnly={!isRegisterOpen} />
                            </div>
                            <div className={styles.formRow}><label>수강제한 인원</label>
                                <input type="number" name="studtLimit" value={isRegisterOpen ? formData.studtLimit : selectedLecture?.studtLimit || ''} onChange={(e) => handleInputChange(e, setFormData)} readOnly={!isRegisterOpen} />
                            </div>
                            <div className={styles.buttonRow}>
                                {isRegisterOpen && <button type="submit" className={styles.submitButton}>등록</button>}
                                <button type="button" onClick={() => handleClose(setSelectedLecture, setIsRegisterOpen)} className={styles.closeButton}>닫기</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
