import { fetchWithAuth } from './fetchWithAuth';
import Swal from 'sweetalert2';

export const initialCourseFormData = {
    courNm: '',
    courYear: '',
    courDept: '',
    courWeek: '',
    weekTime: '',
    fullTime: '',
};

// 전체 리스트 불러오기
export const fetchCourseList = (search, page, setCourseData, setTotalPages, setTotalElements) => {
    const apiUrl = `http://localhost:8080/api/admins/coulec/coulist?page=${page}${search ? `&search=${search}` : ''}`;
    fetchWithAuth(apiUrl)
        .then(res => res.json())
        .then(data => {
            setCourseData(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        })
        .catch(console.error);
};

// 상세 정보 불러오기
export const fetchCourseDetail = (courNo, callback) => {
    fetchWithAuth(`http://localhost:8080/api/admins/coulec/detail/${courNo}`)
        .then(res => res.json())
        .then(detail => {
            callback({
                ...detail,
                courseName: detail.courNm,
                year: detail.courYear,
                department: detail.courDept,
                weeks: detail.courWeek,
                hoursPerWeek: detail.weekTime,
                totalHours: detail.fullTime,
            });
        })
        .catch(console.error);
};

// 등록용 서브밋 핸들러
export const handleCourseSubmit = async (
    e, formRef, setErrors, fetchCourseList,
    setIsCourseOpen, page, search, setCourseData, setTotalPages, setTotalElements
) => {
    e.preventDefault();
    if (!formRef?.current) return;

    const formData = new FormData(formRef.current);
    const values = Object.fromEntries(formData.entries());

    const formErrors = validateCourseForm(values);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
        const res = await fetchWithAuth('http://localhost:8080/api/admins/coulec/register', {
            method: 'POST',
            body: values,
        });

        if (res.ok) {
            Swal.fire({
                title: '성공!',
                text: '과정이 등록되었습니다!',
                icon: 'success',
                confirmButtonText: '확인'
            });
            formRef.current.reset();
            setIsCourseOpen(false);
            fetchCourseList(search, page, setCourseData, setTotalPages, setTotalElements);
        } else {
            const msg = await res.text();
            Swal.fire({
                title: '실패!',
                text: msg || '등록 실패',
                icon: 'error',
                confirmButtonText: '확인'
            });
        }
    } catch (error) {
        console.error('등록 오류:', error);
        Swal.fire({
            title: '서버 오류',
            text: '서버에서 오류가 발생했습니다.',
            icon: 'error',
            confirmButtonText: '확인'
        });
    }
};

// 삭제용 핸들러
export const handleDeleteCourse = async (
    courNo, fetchCourseList, setSelectedCourse, setIsCourseOpen,
    page, search, setCourseData, setTotalPages, setTotalElements
) => {
    if (!courNo) return;

    const result = await Swal.fire({
        title: '정말로 삭제하시겠습니까?',
        text: '삭제된 과정은 복구할 수 없습니다!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
        try {
            const res = await fetchWithAuth(`http://localhost:8080/api/admins/coulec/delete/${courNo}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                Swal.fire({
                    title: '삭제 완료',
                    text: '과정이 삭제되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                });
                setSelectedCourse(null);
                setIsCourseOpen(false);
                fetchCourseList(search, page, setCourseData, setTotalPages, setTotalElements);
            } else {
                const msg = await res.text();
                Swal.fire({
                    title: '삭제 실패',
                    text: msg || '삭제 실패',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            }
        } catch (error) {
            console.error('삭제 오류:', error);
            Swal.fire({
                title: '서버 오류',
                text: '서버에서 오류가 발생했습니다.',
                icon: 'error',
                confirmButtonText: '확인'
            });
        }
    }
};

// 폼 입력 핸들러
export const handleInputChange = (e, setFormData) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
};

// 상세 클릭 핸들러
export const handleRowClick = (course, setSelectedCourse, setIsCourseOpen) => {
    fetchCourseDetail(course.courNo, setSelectedCourse);
    setIsCourseOpen(false);
};

// 등록 버튼 클릭 핸들러
export const handleCourseClick = (setFormData, setIsCourseOpen, setSelectedCourse) => {
    setFormData(initialCourseFormData);
    setIsCourseOpen(true);
    setSelectedCourse(null);
};

// 닫기 버튼 핸들러
export const handleClose = (setSelectedCourse, setIsCourseOpen) => {
    setSelectedCourse(null);
    setIsCourseOpen(false);
};

// 검색 핸들러
export const handleCourseSearch = (e, router) => {
    if (e.key === 'Enter') {
        const keyword = e.target.value.trim();
        router.push(`/admins/course/list?page=0${keyword ? `&search=${keyword}` : ''}`);
    }
};

// 유효성 검사
export const validateCourseForm = (values) => {
    const errors = {};

    if (!values.courNm?.trim()) errors.courNm = '과정명을 입력하세요.';
    if (!values.courYear?.trim()) errors.courYear = '년도 입력 필요';
    if (!values.courDept?.trim()) errors.courDept = '과목구분 입력 필요';
    if (!values.courWeek?.trim()) errors.courWeek = '강의 주차 입력 필요';
    if (!values.weekTime?.trim()) errors.weekTime = '주당 수업시간 입력 필요';
    if (!values.fullTime?.trim()) errors.fullTime = '총 수업시간 입력 필요';

    return errors;
};
