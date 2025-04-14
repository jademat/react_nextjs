// ✅ 수정된 lectureUtils.js (InstNoDTO 대응)
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import Swal from 'sweetalert2';

export const initialLectureForm = {
    courNo: '',
    instNo: '',
    lectNm: '',
    lectPrice: '',
    lectDesc: '',
    lectStart: '',
    lectSubmit: '',
    lectLoc: '',
    studtLimit: '',
};

export const validateLectureForm = (values, instructors, lectureData) => {
    const errors = {};
    if (!values.courNo) errors.courNo = '과정을 선택하세요';
    if (!values.instNo) errors.instNo = '강사를 선택하세요';
    if (!values.lectNm) errors.lectNm = '강의명을 입력하세요';
    if (!values.lectPrice || isNaN(values.lectPrice)) errors.lectPrice = '강의 금액을 숫자로 입력하세요';
    if (!values.lectStart) errors.lectStart = '개강일을 입력하세요';
    if (!values.lectSubmit) errors.lectSubmit = '수료일을 입력하세요';
    if (!values.lectLoc) errors.lectLoc = '강의 위치를 입력하세요';
    if (!values.studtLimit || isNaN(values.studtLimit)) errors.studtLimit = '수강 제한 인원을 숫자로 입력하세요';

    const isDuplicateInstructor = instructors.find(inst => inst.instNo === parseInt(values.instNo)) === undefined;
    const isDuplicateLecture = lectureData.some(lect => lect.lectNm === values.lectNm);

    if (isDuplicateInstructor) errors.instNo = '이미 다른 강의에 배정된 강사입니다';
    if (isDuplicateLecture) errors.lectNm = '이미 존재하는 강의명입니다';

    return errors;
};

export const fetchInstructors = async (setInstructors) => {
    try {
        const res = await fetchWithAuth('http://localhost:8080/api/admins/inst/list-all'); // InstNoDTO 리스트
        const data = await res.json();

        const assignedRes = await fetchWithAuth('http://localhost:8080/api/admins/lect/assigned-inst'); // 이미 배정된 강사들
        const assigned = await assignedRes.json();
        const assignedSet = new Set(assigned.map(i => i.instNo)); // 중복 제거

        const filtered = data.filter(inst => !assignedSet.has(inst.instNo));
        setInstructors(filtered);
    } catch (error) {
        console.error('강사 목록 불러오기 실패:', error);
        setInstructors([]);
    }
};
export const handleLectureSubmit = async (
    e, formRef, setFormData, setIsRegisterOpen, setErrors,
    fetchLectureList, search, page, setLectureData, setTotalPages, setTotalElements,
    instructors, lectureData, setInstructors
) => {
    e.preventDefault();
    if (!formRef?.current) return;

    const formData = new FormData(formRef.current);
    const values = Object.fromEntries(formData.entries());
    const isNameValid = await checkLectureNameUnique(values.lectNm);

    values.courNo = Number(values.courNo);
    values.instNo = Number(values.instNo);
    values.lectPrice = Number(values.lectPrice);
    values.studtLimit = Number(values.studtLimit);

    const errors = validateLectureForm(values, instructors, lectureData);
    if (!isNameValid) {
        errors.lectNm = '이미 존재하는 강의명입니다';
    }
    if (Object.keys(errors).length > 0) {
        setErrors(errors);
        Swal.fire({ icon: 'warning', title: '입력 오류', text: '모든 필수 입력값을 확인해주세요.' });
        return;
    }

    try {
        const res = await fetchWithAuth('http://localhost:8080/api/admins/lect/register', {
            method: 'POST',
            body: values,
        });

        if (res.ok) {
            Swal.fire({ title: '성공!', text: '강의가 등록되었습니다!', icon: 'success' });
            setFormData(initialLectureForm);
            setIsRegisterOpen(false);
            fetchLectureList(search, page, setLectureData, setTotalPages, setTotalElements);
            fetchInstructors(setInstructors);
        } else {
            const msg = await res.text();
            Swal.fire({ title: '실패', text: msg || '등록 실패', icon: 'error' });
        }
    } catch (error) {
        console.error('등록 오류:', error);
        Swal.fire({ title: '서버 오류', text: '서버에서 오류가 발생했습니다.', icon: 'error' });
    }
};

export const fetchLectureList = async (search, page, setLectureData, setTotalPages, setTotalElements) => {
    try {
        const url = `http://localhost:8080/api/admins/lect/lectlist?page=${page}${search ? `&search=${search}` : ''}`;
        const res = await fetchWithAuth(url);
        const data = await res.json();
        setLectureData(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
    } catch (error) {
        console.error('강의 목록 불러오기 실패:', error);
        setLectureData([]);
    }
};

export const fetchCourses = async (setCourses) => {
    try {
        const res = await fetchWithAuth('http://localhost:8080/api/admins/coulec/list-all');
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error('과정 목록 불러오기 실패:', error);
        setCourses([]);
    }
};

export const fetchLectureDetail = async (lectNo) => {
    try {
        const res = await fetchWithAuth(`http://localhost:8080/api/admins/lect/detail/${lectNo}`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("강의 상세 조회 실패:", err);
        return null;
    }
};

export const handleLectureClick = (setFormData, setIsRegisterOpen, setSelectedLecture) => {
    setFormData(initialLectureForm);
    setIsRegisterOpen(true);
    setSelectedLecture(null);
};

export const handleLectureSearch = (e, router) => {
    if (e.key === 'Enter') {
        const keyword = e.target.value.trim();
        router.push(`/admins/lecture/list?page=0${keyword ? `&search=${keyword}` : ''}`);
    }
};

export const handleInputChange = (e, setFormData) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

export const handleRowClick = (lecture, setSelectedLecture, setIsRegisterOpen) => {
    fetchLectureDetail(lecture.lectNo, setSelectedLecture);
    setIsRegisterOpen(false);
};

export const handleClose = (setSelectedLecture, setIsRegisterOpen) => {
    setSelectedLecture(null);
    setIsRegisterOpen(false);
};

export const formatDate = (date) => {
    if (!date) return '';
    try {
        return new Date(date).toISOString().slice(0, 10);
    } catch (e) {
        console.error("날짜 변환 실패:", e);
        return '';
    }
};

export const calculateEndDate = (startDate, totalHours, weeklyHours) => {
    if (!startDate || !totalHours || !weeklyHours) return '';
    const weeks = Math.ceil(totalHours / weeklyHours);
    const resultDate = new Date(startDate);
    resultDate.setDate(resultDate.getDate() + weeks * 7);
    return resultDate.toISOString().split('T')[0];
};

export const checkLectureNameUnique = async (name) => {
    try {
        const res = await fetchWithAuth(`http://localhost:8080/api/admins/lect/check-name?name=${encodeURIComponent(name)}`);
        return await res.json();
    } catch (e) {
        console.error('강의명 중복 검사 실패', e);
        return false;
    }
};