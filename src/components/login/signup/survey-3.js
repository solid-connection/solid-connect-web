import { useState, useRef } from "react";
import styles from "./survey.module.css";
import EditFilled from "@/components/ui/icon/EditFilled";
import BlockBtn from "@/components/ui/block-btn";

export default function Survey3(props) {
  const { preparation, setPreparation, submitSurvey, nickname, setNickname, profileImageUrl, setProfileImageUrl, gender, setGender, birth, setBirth } = props;

  // 닉네임
  const handleNicknameChange = () => {
    const newNickname = prompt("새 닉네임을 입력해주세요.", nickname); // 기본값으로 현재 닉네임을 제공
    if (newNickname) {
      setNickname(newNickname);
    }
  };
  // 생년월일
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태
  const inputRef = useRef(null); // input 요소에 대한 참조 생성

  // 생년월일 편집 모드 활성화 및 input 포커싱
  const handleBirthClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 0); // 다음 이벤트 루프에서 focus 실행
  };
  // 생년월일 변경 처리
  const handleBirthChange = (e) => {
    setBirth(e.target.value);
    setIsEditing(false); // 편집 모드 종료
  };

  // 성별
  const handleGenderChange = () => {
    const genderChoice = prompt("성별을 선택해주세요. (남성, 여성, 비공개)");
    const validChoices = ["남성", "여성", "비공개"];
    if (validChoices.includes(genderChoice)) {
      setGender(genderChoice);
    } else {
      alert("올바른 값을 입력해주세요. (남성, 여성, 비공개)");
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.survey3}>
        <div className={styles.profile}>
          <img src={profileImageUrl} className={styles.profileImage}></img>
          <div className={styles.nicknameWrapper} onClick={handleNicknameChange}>
            <div className={styles.nickname}>{nickname}</div>
            <EditFilled />
          </div>
          <div className={styles.info}>
            <div className={styles.birth} onClick={handleBirthClick}>
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="date"
                  value={birth}
                  onBlur={handleBirthChange} // 입력 필드가 포커스를 잃었을 때 업데이트
                  onChange={handleBirthChange} // 날짜가 변경되었을 때 업데이트
                />
              ) : (
                birth
              )}
            </div>
            <div className={styles.gender} onClick={handleGenderChange}>
              성별: {gender}
            </div>
          </div>
        </div>
        <div className={styles.choiceZone}>
          <div className={styles.choiceDesc}>현재 나의 준비 단계를 선택해주세요</div>
          <div className={styles.choices}>
            <div
              className={preparation === "CONSIDERING" ? styles.selectedChoice : ""}
              onClick={() => {
                setPreparation("CONSIDERING");
              }}
            >
              1단계 : 교환학생 지원 고민 상태
            </div>
            <div
              className={preparation === "PREPARING_FOR_DEPARTURE" ? styles.selectedChoice : ""}
              onClick={() => {
                setPreparation("PREPARING_FOR_DEPARTURE");
              }}
            >
              2단계 : 교환학생 합격 후 파견 준비 상태
            </div>
            <div
              className={preparation === "STUDYING_ABROAD" ? styles.selectedChoice : ""}
              onClick={() => {
                setPreparation("STUDYING_ABROAD");
              }}
            >
              3단계 : 해외 학교에서 공부중인 상태
            </div>
          </div>
        </div>
      </div>
      <div style={{ margin: "0 30px 24px 30px" }}>
        <BlockBtn onClick={submitSurvey}>다음으로</BlockBtn>
      </div>
    </div>
  );
}
