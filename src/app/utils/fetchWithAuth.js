export const fetchWithAuth = (url, options = {}) => {
    const token = localStorage.getItem("accessToken");


    // 로그인 상태 확인: 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/admins/login";
        return Promise.reject("No token");
    }

    // 기본 옵션 설정
    const defaultOptions = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        ...options,
    };

    // body가 있을 경우 JSON으로 변환
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        defaultOptions.body = JSON.stringify(options.body);
    }

    // fetch 요청 보내기
    return fetch(url, defaultOptions)
        .then(res => {
            // 403 Forbidden: 세션 만료 시 처리
            if (res.status === 403) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.removeItem("accessToken");
                window.location.href = "/admins/login";
                return Promise.reject("Unauthorized");
            }
            return res;
        });
};

