import { useContext, useEffect, useState } from "react";
import BootPathContext from "./../../BootPath";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Prev } from "react-bootstrap/esm/PageItem";

function FundingComment() {
  const bootPath = useContext(BootPathContext);
  const [params, setParams] = useSearchParams();
  const [totalElement, setTotalElement] = useState(0);
  const [data, setData] = useState([]);
  const [param, setParam] = useState({});
  const [writer, setWriter] = useState("");
  const [no, setNo] = useState("");
  const [newReply, setNewReply] = useState({ contents: "" });
  const [editingCommentId, setEditingCommentId] = useState(null);

  let funding_no = params.get("no");

  const getReplyApi = async () => {
    axios
      .get(`${bootPath.bootpath}/funding/comment/list?fundingno=${funding_no}`)
      .then((res) => {
        setData(res.data);
        setTotalElement(res.data.length);
        console.log(res.data);
      })
      .catch((error) => {
        console.log("funding_no값이 없습니다. ", error);
      });
  };

  useEffect(() => {
    getReplyApi();
  }, []);

  useEffect(() => {
    const name = sessionStorage.getItem("name");
    const no = sessionStorage.getItem("no");
    setWriter(name || "");
    setNo(Number(no) || "");
  }, []);

  //로그인정보
  const getApi = () => {
    console.log(param);
    axios.post(bootPath + "/member/devlogin", param).then((res) => {
      console.log(res);
      if (res.data.result === "success") {
        sessionStorage.setItem("no", res.data.no);
        sessionStorage.setItem("name", res.data.name);
        setWriter(res.data.name);
        setNo(res.data.no);
      }
    });
  };

  //댓글등록
  const input = (e) => {
    setNewReply({ contents: e.target.value });
  };

  const commentSubmit = async () => {
    try {
      const response = await axios.post(
        `${bootPath.bootpath}/funding/comment/add`,
        {
          name: writer,
          contents: newReply.contents,
          photo: "",
          fundingno: funding_no,
        }
      );
      setData((prevData) => [...prevData, response.data]);
      setTotalElement((prevTotal) => prevTotal + 1);
      setNewReply({ contents: "" });
    } catch (error) {
      console.log("에러발생", error);
    }
  };
  //댓글수정
  const editComment = async (commentId, updatedContents) => {
    try {
      await axios.put(
        `${bootPath.bootpath}/funding/comment/update?no=${commentId}`,
        {
          contents: updatedContents,
        }
      );

      const updatedComments = data.map((comment) =>
        comment.no === commentId
          ? { ...comment, contents: updatedContents }
          : comment
      );
      setData(updatedComments);
      setEditingCommentId(null);
    } catch (error) {
      console.log("댓글 수정 중 에러가 발생했습니다.", error);
    }
  };

  const editClick = (commentId) => {
    setEditingCommentId(commentId);
  };

  const saveEditedComment = (commentId) => {
    const updatedContents = newReply.contents;

    if (updatedContents.trim() === "") {
      setNewReply({
        contents: data.find((item) => item.no === commentId).contents,
      });
      return;
    }

    editComment(commentId, updatedContents);
  };

  //댓글삭제
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${bootPath.bootpath}/funding/comment/delete?no=${commentId}`
      );

      const resultComments = data.filter((item) => item.no !== commentId);
      setData(resultComments);
      setTotalElement((prevTotal) => prevTotal - 1);
    } catch (error) {
      console.log("댓글 삭제 중 에러가 발생했습니다.", error);
    }
  };

  const deleteClick = (commentId) => {
    deleteComment(commentId);
  };

  return (
    <>
      <div>{writer}</div>
      <div>
        <textarea
          value={newReply.contents}
          placeholder="댓글을 입력하세요."
          onChange={input}
        ></textarea>{" "}
        <br />
        <button onClick={commentSubmit}>댓글 저장</button>
      </div>
      <p>--------댓글목록----------</p>
      <p>총 댓글 수 : {totalElement} </p>
      {data &&
        data.map((item) => (
          <div key={item.no}>
            {item.name}{" "}
            {editingCommentId === item.no ? (
              <>
                <textarea value={newReply.contents} onChange={input}></textarea>{" "}
                <button onClick={() => saveEditedComment(item.no)}>
                  수정 저장
                </button>
              </>
            ) : (
              <>
                {item.contents}
                <button onClick={() => editClick(item.no)}>
                  댓글 수정
                </button>{" "}
              </>
            )}
            <button onClick={() => deleteClick(item.no)}>댓글 삭제</button>
          </div>
        ))}
    </>
  );
}

export default FundingComment;
