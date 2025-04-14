import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import Swal from "sweetalert2";

export const fetchAdminList = (search, page, setAdminData, setTotalPages) => {
    const apiUrl = `http://localhost:8080/api/admins/admin/list?page=${page}${search ? `&search=${search}` : ''}`;

    fetchWithAuth(apiUrl)
        .then(res => res.json())
        .then(data => {
            setAdminData(data.content || []);
            setTotalPages(data.totalPages || 0);
        })
        .catch(console.error);
};

export const fetchAdminDetail = (adminNo, setSelectedAdmin) => {
    fetchWithAuth(`http://localhost:8080/api/admins/admin/detail/${adminNo}`)
        .then(res => res.json())
        .then(data => setSelectedAdmin(data))
        .catch(console.error);
};

export const handleSearch = (e, router) => {
    if (e.key === 'Enter') {
        const keyword = e.target.value.trim();
        router.push(`/admins/admin/list?page=0${keyword ? `&search=${keyword}` : ''}`);
    }
};

export const handleReset = (formRef, setErrors) => {
    if (formRef?.current) {
        formRef.current.reset();
    }
    setErrors({});
};

export const handleSubmit = async (
    e, formRef, setErrors, fetchAdminList,
    setIsRegisterOpen, page, search, setAdminData, setTotalPages
) => {
    e.preventDefault();
    if (!formRef?.current) return;

    const formData = new FormData(formRef.current);
    const formValues = Object.fromEntries(formData.entries());
    console.log(">> join ", formValues["g-recaptcha-response"]);

    const formErrors = validateForm(formValues);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
        return;
    }

    try {
        const res = await fetchWithAuth('http://localhost:8080/api/admins/admin/create', {
            method: 'POST',
            body: formValues,
        });

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: '등록 성공!',
                text: '관리자 등록이 완료되었습니다.',
                timer: 1500,
                showConfirmButton: false
            });
            setIsRegisterOpen(false);
            formRef.current.reset();
            setErrors({});
            fetchAdminList(search, page, setAdminData, setTotalPages);
        } else if (res.status === 400) {
            const errorMessage = await res.text();
            Swal.fire({
                icon: 'warning',
                title: '등록 실패',
                text: errorMessage || '입력값을 다시 확인해주세요.'
            });
            grecaptcha.reset();
        } else {
            Swal.fire({
                icon: 'error',
                title: '등록 실패',
                text: '등록 실패! 다시 시도해 주세요.'
            });
            grecaptcha.reset();
        }
    } catch (error) {
        console.error('register error:', error);
        Swal.fire({
            icon: 'error',
            title: '서버 오류',
            text: '서버와 통신 중 문제가 발생했습니다.'
        });
        grecaptcha.reset();
    }
};

export const validateForm = (values) => {
    const errors = {};
    if (!values.loginId || values.loginId.length < 6) errors.loginId = '아이디는 4자 이상 입력하세요.';
    if (!values.pswd || values.pswd.length < 12) errors.pswd = '비밀번호는 12자 이상 입력하세요.';
    if (!values.adminNm) errors.adminNm = '이름을 입력하세요.';
    if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) errors.email = '유효한 이메일을 입력하세요.';
    if (!values.hpNo) errors.hpNo = '연락처를 입력하세요.';
    if (!values["g-recaptcha-response"]) {
        errors.recaptcha = "자동가입방지를 확인하세요!!";
    }

    return errors;
};

export const getRecaptchaSiteKey = () => {
    return process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
};