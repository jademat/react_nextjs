import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import Swal from "sweetalert2";

export const initialForm = {
    instId: '', passwd: '', instNm: '', genCd: '',
    birthDate: '', zipCd: '', addr: '', addrDtl: '', email: ''
};

export const validateInstructorForm = (values) => {
    const errors = {};
    if (!values.instId || values.instId.trim().length < 4) errors.instId = '아이디는 4자 이상';
    if (!values.passwd || values.passwd.trim().length < 6) errors.passwd = '비밀번호는 6자 이상';
    if (!values.instNm?.trim()) errors.instNm = '강사명을 입력하세요';
    return errors;
};

export const fetchInstructorList = (search, page, setInstructorData, setTotalPages, setTotalElements) => {
    const apiUrl = `http://localhost:8080/api/admins/inst/list?page=${page}${search ? `&search=${search}` : ''}`;

    fetchWithAuth(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data && data.content) {
                setInstructorData(data.content);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
            } else {
                setInstructorData([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        })
        .catch(error => {
            console.error("강사 목록 조회 오류:", error);
            setInstructorData([]);
        });
};
export const handleRegisterSubmit = async (
    e, formRef, registerData, setRegisterData, setErrors, setIsRegisterOpen,
    searchTerm, page, setInstructorData, setTotalPages, setTotalElements
) => {
    e.preventDefault();
    if (!formRef?.current) return;

    const formErrors = validateInstructorForm(registerData);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    const formData = new FormData(formRef.current);
    const formValues = Object.fromEntries(formData.entries());

    try {
        const res = await fetchWithAuth('http://localhost:8080/api/admins/inst/register', {
            method: 'POST',
            body: formValues,
        });

        if (res.ok) {
            Swal.fire({ title: '성공!', text: '강사가 등록되었습니다!', icon: 'success' });
            setRegisterData(initialForm);
            setIsRegisterOpen(false);
            fetchInstructorList(searchTerm, page, setInstructorData, setTotalPages, setTotalElements);
        } else {
            const msg = await res.text();
            Swal.fire({ title: '등록 실패', text: msg || '등록 실패', icon: 'error' });
        }
    } catch (error) {
        console.error('등록 오류:', error);
        Swal.fire({ title: '서버 오류', text: '서버에서 오류가 발생했습니다.', icon: 'error' });
    }
};
export const handlePageChange = (newPage, totalPages, setPage) => {
    if (newPage >= 0 && newPage < totalPages) {
        setPage(newPage);
    }
};

export const fetchInstructorLectures = async (instNo, setLectures) => {
    try {
        const res = await fetchWithAuth(`http://localhost:8080/api/admins/inst/inst/${instNo}/lectures`);
        if (res.ok) {
            const data = await res.json();
            setLectures(data);
        } else {
            setLectures([]);
        }
    } catch (err) {
        console.error("강사 강의 조회 실패:", err);
        setLectures([]);
    }
};