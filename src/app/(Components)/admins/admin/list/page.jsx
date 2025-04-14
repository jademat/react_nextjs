"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '@/app/(Components)/css/CommonList.module.css';
import {fetchAdminList,fetchAdminDetail,handleSearch,handleSubmit,handleReset,getRecaptchaSiteKey } from '@/app/utils/adminUtils';

const AdminListPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [adminData, setAdminData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const formRef = useRef(null);
    const [errors, setErrors] = useState({});
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '0');
    const [sitekey, setSitekey] = useState(null);


    useEffect(() => {
        fetchAdminList(search, page, setAdminData, setTotalPages);
    }, [search, page]);

    const handleRegAdmin = () =>{
        // // recaptcha 모듈 적재
        // useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        const site_key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
        console.log("stie_key >> ",site_key);
        setSitekey(site_key);

        setIsRegisterOpen(true);
        setSelectedAdmin(null);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>관리자 목록</h1>

            <div className={styles.toolbar}>
                <div className={styles.searchArea}>
                    <input
                        type="text"
                        defaultValue={search}
                        onKeyDown={(e) => handleSearch(e, router)}
                        placeholder="이름, 아이디, 이메일 검색"
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.buttonArea}>
                    <button className={styles.registerButton} onClick={handleRegAdmin}>등록</button>
                </div>
            </div>

            <table className={styles.memberTable}>
                <thead>
                <tr>
                    <th>No</th>
                    <th>이름</th>
                    <th>아이디</th>
                    <th>이메일</th>
                    <th>연락처</th>
                    <th>주소</th>
                </tr>
                </thead>
                <tbody>
                {adminData.map((admin) => (
                    <tr key={admin.adminNo} onClick={() => {fetchAdminDetail(admin.adminNo, setSelectedAdmin); setIsRegisterOpen(false);}} className={styles.tableRow}>
                        <td>{admin.adminNo}</td>
                        <td>{admin.adminNm}</td>
                        <td>{admin.loginId}</td>
                        <td>{admin.email}</td>
                        <td>{admin.hpNo}</td>
                        <td>{admin.addr} {admin.addrDtl}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {adminData.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    검색 결과가 없습니다.
                </div>
            )}

            {totalPages > 0 && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => router.push(`/admins/admin/list?page=${Math.max(0, page - 1)}${search ? `&search=${search}` : ''}`)}
                        className={styles.pageBtn}
                        disabled={page === 0}
                    >◀ 이전</button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => router.push(`/admins/admin/list?page=${i}${search ? `&search=${search}` : ''}`)}
                            className={`${styles.pageBtn} ${i === page ? styles.activePageBtn : ''}`}
                        >{i + 1}</button>
                    ))}

                    <button
                        onClick={() => router.push(`/admins/admin/list?page=${Math.min(totalPages - 1, page + 1)}${search ? `&search=${search}` : ''}`)}
                        className={styles.pageBtn}
                        disabled={page === totalPages - 1}
                    >다음 ▶</button>
                </div>
            )}

            {isRegisterOpen && (
                <div className={styles.detailBox}>
                    <h2>관리자 등록</h2>
                    <form ref={formRef} onSubmit={(e) => handleSubmit(e, formRef, setErrors, fetchAdminList, setIsRegisterOpen, page, search, setAdminData, setTotalPages)}>
                        <input name="loginId" placeholder="아이디" className={`form-control mb-2 ${errors.loginId ? 'is-invalid' : ''}`} />
                        {errors.loginId && <div className="invalid-feedback">{errors.loginId}</div>}

                        <input name="pswd" type="password" placeholder="비밀번호" className={`form-control mb-2 ${errors.pswd ? 'is-invalid' : ''}`} />
                        {errors.pswd && <div className="invalid-feedback">{errors.pswd}</div>}

                        <input name="adminNm" placeholder="이름" className={`form-control mb-2 ${errors.adminNm ? 'is-invalid' : ''}`} />
                        {errors.adminNm && <div className="invalid-feedback">{errors.adminNm}</div>}

                        <input name="email" placeholder="이메일" className={`form-control mb-2 ${errors.email ? 'is-invalid' : ''}`} />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}

                        <input name="hpNo" placeholder="연락처" className={`form-control mb-2 ${errors.hpNo ? 'is-invalid' : ''}`} />
                        {errors.hpNo && <div className="invalid-feedback">{errors.hpNo}</div>}

                        <input name="addr" placeholder="주소" className="form-control mb-2" />
                        <input name="addrDtl" placeholder="상세주소" className="form-control mb-2" />
                        <input name="birthDate" placeholder="생년월일 (YYYYMMDD)" className="form-control mb-2" />

                        <select name="genCd" className="form-select mb-2">
                            <option value="">성별 선택</option>
                            <option value="M">남자</option>
                            <option value="F">여자</option>
                        </select>

                        <select name="role" className="form-select mb-2">
                            <option value="ADMIN">관리자</option>
                            <option value="SUPERADMIN">최고관리자</option>
                        </select>

                        {/*<div className="d-flex justify-content-center">*/}
                        {/*    <div className="g-recaptcha" data-sitekey={sitekey}></div>*/}
                        {/*</div>*/}
                        {/*{errors.recaptcha && <div className="alert alert-danger">{errors.recaptcha}</div>}*/}

                        <div className="d-flex justify-content-between mt-3">
                            <button type="submit" className="btn btn-primary">등록완료</button>
                            <button type="button" onClick={() => handleReset(formRef, setErrors)} className="btn btn-danger">다시입력</button>
                        </div>
                    </form>
                </div>
            )}

            {selectedAdmin && (
                <div className={styles.detailBox}>
                    <table className={styles.detailTable}>
                        <tbody>
                        <tr>
                            <th>아이디</th>
                            <td>{selectedAdmin.loginId}</td>
                            <th>이름</th>
                            <td>{selectedAdmin.adminNm}</td>
                        </tr>
                        <tr>
                            <th>이메일</th>
                            <td>{selectedAdmin.email}</td>
                            <th>연락처</th>
                            <td>{selectedAdmin.hpNo}</td>
                        </tr>
                        <tr>
                            <th>성별</th>
                            <td>{selectedAdmin.genCd || '-'}</td>
                            <th>생년월일</th>
                            <td>{selectedAdmin.birthDate || '-'}</td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td colSpan={3}>{selectedAdmin.addr} {selectedAdmin.addrDtl}</td>
                        </tr>
                        <tr>
                            <th>생성일</th>
                            <td colSpan={3}>{selectedAdmin.addrDate?.replace('T', ' ').substring(0, 16)}</td>
                        </tr>
                        <tr>
                            <th>등급</th>
                            <td colSpan={3}>{selectedAdmin.role}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className={styles.buttonRow}>
                        <button onClick={() => setSelectedAdmin(null)} className={styles.closeButton}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminListPage;
