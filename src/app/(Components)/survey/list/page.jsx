'use client';

import { useState } from 'react';
import styles from '@/app/(Components)/css/SurveyForm.module.css';

export default function SurveyList() {
    const [surveys, setSurveys] = useState([
        {
            id: 1,
            title: 'K-디지털 JAVA 과정 설문',
            type: '강의 평가',
            questions: ['수업은 체계적으로 진행되었나요?', '과정에 만족하셨나요?']
        },
        {
            id: 2,
            title: 'C언어 과정 설문',
            type: '강사 평가',
            questions: ['강사는 친절하게 응대했나요?', '설명은 이해하기 쉬웠나요?']
        }
    ]);

    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: '강의 평가',
        question: ''
    });
    const [questionList, setQuestionList] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddQuestion = () => {
        if (formData.question.trim()) {
            setQuestionList(prev => [...prev, formData.question]);
            setFormData(prev => ({ ...prev, question: '' }));
        }
    };

    const handleSubmit = () => {
        if (!formData.title || questionList.length === 0) return;
        const newSurvey = {
            id: Date.now(),
            title: formData.title,
            type: formData.type,
            questions: questionList
        };
        setSurveys(prev => [...prev, newSurvey]);
        setIsModalOpen(false);
        setFormData({ title: '', type: '강의 평가', question: '' });
        setQuestionList([]);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>설문 등록/조회</h1>

            <div className={styles.toolbar}>
                <button className={styles.registerBtn} onClick={() => setIsModalOpen(true)}>설문 등록</button>
            </div>

            <div className={styles.wrapper}>
                <div className={styles.tableWrapper}>
                    <table className={styles.surveyTable}>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>설문 제목</th>
                            <th>평가 구분</th>
                        </tr>
                        </thead>
                        <tbody>
                        {surveys.map((survey, idx) => (
                            <tr key={survey.id}
                                onClick={() => setSelectedSurvey(survey)}
                                className={styles.tableRow}>
                                <td>{idx + 1}</td>
                                <td>{survey.title}</td>
                                <td>{survey.type}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {selectedSurvey && (
                    <div className={styles.detailBox}>
                        <h2>설문 상세정보</h2>
                        <p><strong>제목:</strong> {selectedSurvey.title}</p>
                        <p><strong>평가 구분:</strong> {selectedSurvey.type}</p>
                        <div className={styles.questionList}>
                            {selectedSurvey.questions.map((q, i) => (
                                <p key={i}>{i + 1}. {q}</p>
                            ))}
                        </div>
                        <button className={styles.closeButton} onClick={() => setSelectedSurvey(null)}>닫기</button>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modal}>
                        <h2>설문 등록</h2>

                        <label>설문 제목</label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} />

                        <label>평가 구분</label>
                        <select name="type" value={formData.type} onChange={handleInputChange}>
                            <option value="강의 평가">강의 평가</option>
                            <option value="강사 평가">강사 평가</option>
                        </select>

                        <label>질문 내용</label>
                        <div className={styles.questionRow}>
                            <input
                                type="text"
                                name="question"
                                value={formData.question}
                                onChange={handleInputChange}
                                placeholder="질문을 입력하세요"
                            />
                            <button type="button" onClick={handleAddQuestion} className={styles.addBtn}>추가</button>
                        </div>

                        <ul className={styles.questionPreview}>
                            {questionList.map((q, i) => (
                                <li key={i}>{i + 1}. {q}</li>
                            ))}
                        </ul>

                        <div className={styles.modalButtons}>
                            <button onClick={handleSubmit} className={styles.registerBtn}>등록</button>
                            <button onClick={() => setIsModalOpen(false)} className={styles.closeButton}>닫기</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
