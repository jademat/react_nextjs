import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
export const fetchAdminList = (search, page, setAdminData, setTotalPages) => {
    const apiUrl = `http://localhost:8080/api/admins/admin/list?page=${page}${search ? `&search=${search}` : ''}`;

    // fetchWithAuth 사용하여 Authorization 헤더 추가
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

// 검색 기능
export const handleSearch = (e, router) => {
    if (e.key === 'Enter') {
        const keyword = e.target.value.trim();
        router.push(`/admins/admin/list?page=0${keyword ? `&search=${keyword}` : ''}`);
    }
};

// 폼 리셋
export const handleReset = (formRef, setErrors) => {
    if (formRef?.current) {
        formRef.current.reset();
    }
    setErrors({});
};

// 관리자 등록 기능 (POST 요청 시 fetchWithAuth 사용)
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
        // fetchWithAuth 사용하여 POST 요청에 Authorization 헤더 포함
        const res = await fetchWithAuth('http://localhost:8080/api/admins/admin/create', {
            method: 'POST',
            body: formValues, // formValues를 그대로 전송
        });

        if (res.ok) {
            alert('관리자 등록이 완료되었습니다!!');
            setIsRegisterOpen(false);
            formRef.current.reset();
            setErrors({});
            fetchAdminList(search, page, setAdminData, setTotalPages);
        } else if (res.status === 400) {
            const errorMessage = await res.text();
            alert(errorMessage);
            grecaptcha.reset(); // 실패 시 리캡챠 초기화
        } else {
            alert('등록 실패! 다시 시도해 주세요.');
            grecaptcha.reset(); // 실패 시 리캡챠 초기화
        }
    } catch (error) {
        console.error('register error:', error);
        alert('서버 오류 발생! 관리자에게 문의하세요.');
        grecaptcha.reset(); // 실패 시 리캡챠 초기화
    }
};

// 폼 검증
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

// 리캡챠 사이트 키 (환경 변수에서 읽어오기)
export const getRecaptchaSiteKey = () => {
    return process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
};