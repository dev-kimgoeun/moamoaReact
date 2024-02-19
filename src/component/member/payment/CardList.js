import React, { useState, useEffect } from "react";
import PaymentHeader from "./PaymentHeader";
import BootPath from "./../../../BootPath";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../../CardList.css";
function CardList() {
  const { bootpath } = useContext(BootPath);
  const [payment, setPayment] = useState([]);
  const member_no = sessionStorage.getItem("no");
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    //전송할 데이터, 여기에서는 선택한 no만 전송해서 삭제요청. no는 payment테이블의 no임
    no: 0,
    memberno: member_no,
  });

  useEffect(() => {
    const fetchPaymentList = async () => {
      try {
        // Axios를 사용하여 API 호출
        const response = await axios.get(
          `${bootpath}/member/payment/list?member_no=${member_no}`
        );

        // 응답이 성공하면 데이터를 상태에 저장
        setPayment(response.data);
      } catch (error) {
        console.error("결제수단을 가져오던 중 에러 발생:", error);
      }
    };

    // 데이터 가져오기 함수 호출
    fetchPaymentList();
  }, [member_no]);

  useEffect(() => {
    if (formData.no !== 0) {
      // formData.no가 0이 아닌 경우에만 CardDel을 호출
      console.log(formData.no);
      CardDel();
    }
  }, [formData.no]);

  const CardNo = (no) => {
    console.log("어카운트까진 넘어온 " + no);
    setFormData({
      ...formData,
      no: no,
    });
    console.log(formData); // 여기선 아직 no가 0인 상태
  };

  const CardDel = async () => {
    console.log(formData); // 여기선 no가 잘 찍힘

    try {
      const response = await axios.post(
        `${bootpath}/member/payment/delete`,
        formData
      );

      console.log("서버 응답:", response.data);

      if (response.data.result === "del_success") {
        alert("카드정보 삭제 성공");
        // 삭제 Success인 경우, 마이페이지 새로고침해서 변경내역 반영
        window.location.reload();
      } else if (response.data.result === "del_fail") {
        alert("카드정보 삭제 실패");
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <>
      <div className="sub">
        <div className="size">
          <h3 className="sub_title" />
          <div class="card_container">
            {member_no ? (
              <>
                {payment.filter((payment) => payment.paymenttype === 1).length >
                0 ? (
                  <ul className="rounded-square">
                    {payment
                      .filter((payment) => payment.paymenttype === 1) // 카드만 필터
                      .map((payment) => (
                        <li key={payment.no}>
                          <table>
                            <tbody>
                              <tr>
                                <td className="table_font">
                                  은행명: {payment.company}
                                </td>
                                <td className="table_button">
                                  <button className="card_modify">
                                    <Link
                                      to={`/member/payment/card/modify/${payment.no}`}
                                    >
                                      카드 수정
                                    </Link>
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td className="table_font">
                                  카드번호: {payment.account}
                                </td>
                                <td className="table_button">
                                  <button
                                    className="card_delete"
                                    onClick={() => CardNo(payment.no)}
                                  >
                                    카드 삭제
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p>카드가 없습니다.</p>
                )}

                <Link to={`/member/payment/card/add`}>카드 추가</Link>
              </>
            ) : (
              <p>
                <Link to="/">로그인 해주세요.</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CardList;
