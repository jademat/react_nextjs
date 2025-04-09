export const fetchWithAuth = (url, options = {}) => {
    // 로컬스토리지에서 accessToken 가져오기
    const token = localStorage.getItem("accessToken");

    // 기본 옵션 설정 (기본적으로 GET 요청)
    const defaultOptions = {
        method: "GET", // 기본 메서드는 GET
        headers: {
            "Authorization": `Bearer ${token}`, // 인증 토큰
            "Content-Type": "application/json", // JSON 데이터 요청
        },
        ...options, // 외부에서 전달된 옵션을 병합
    };

    // body가 필요한 요청(POST, PUT 등)일 경우 처리
    if (options.body) {
        defaultOptions.body = JSON.stringify(options.body);
    }

    // fetch 요청 보내기
    return fetch(url, defaultOptions);
};