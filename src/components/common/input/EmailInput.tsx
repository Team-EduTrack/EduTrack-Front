import { useState } from "react";
import axios from "axios";

interface EmailInputProps {
  value: string;
  onChange: (email: string) => void;
  onVerified: () => void;
  error?: string;
}

export default function EmailInput({
  value,
  onChange,
  onVerified,
  error,
}: EmailInputProps) {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [isAuthValid, setIsAuthValid] = useState(false);

  // 기본 이메일 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 이메일 입력 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    onChange(email);
    setIsEmailValid(emailRegex.test(email));
  };

  const handleSendCode = async () => {
    try {
      await axios.post("/api/auth/send-email-verification", {
        email: value,
      });
      setEmailSent(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "인증번호 발송 실패");
    }
  };

  const handleVerify = async () => {
    try {
      await axios.post("/api/auth/verify-email", {
        email: value,
        token: authCode,
      });

      setIsAuthValid(true);
      onVerified();
    } catch (err: any) {
      alert(err.response?.data?.message || "인증 실패");
    }
  };
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">
        이메일 <span className="text-error">*</span>
      </legend>

      {/* 이메일 인풋 & 버튼 */}
      <div className="flex items-center gap-2">
        <input
          type="email"
          className={`input flex-1 ${
            value.trim() === ""
              ? ""
              : isEmailValid
              ? "input-success"
              : "input-error"
          }`}
          placeholder="이메일을 입력해주세요"
          value={value}
          onChange={handleEmailChange}
          disabled={emailSent}
        />

        <button
          className="btn btn-primary whitespace-nowrap"
          disabled={!isEmailValid || emailSent}
          onClick={handleSendCode}
        >
          인증번호 발송
        </button>
      </div>

      {/* 이메일 에러 메시지 */}
      {value.trim() !== "" && !isEmailValid && (
        <p className="label text-error text-xs mt-1">
          올바른 이메일 형식이 아닙니다.
        </p>
      )}
      {emailSent && !isAuthValid && (
        <fieldset className="fieldset mt-3">
          <legend className="fieldset-legend">인증번호</legend>

          <div className="flex items-center gap-2">
            <input
              className="input flex-1"
              placeholder="인증번호 6자리"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              maxLength={6}
            />

            <button
              className="btn btn-primary"
              disabled={authCode.length !== 6}
              onClick={handleVerify}
            >
              인증하기
            </button>
          </div>
        </fieldset>
      )}
      {isAuthValid && (
        <p className="text-green-600 text-sm mt-2">
          ✓ 이메일 인증이 완료되었습니다.
        </p>
      )}
    </fieldset>
  );
}
