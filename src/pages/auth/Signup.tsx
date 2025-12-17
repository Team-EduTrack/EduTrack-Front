import { useMemo, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import BaseInput from "../../components/common/input/BaseInput";
import PasswordInput from "../../components/common/input/PasswordInput";
import type { SignupErrors, SignupForm } from "../../types/signup";
import { validateField } from "../../utils/validationField";

import {
  useCompleteSignup,
  useSendEmailVerification,
  useSignupRequest,
  useVerifyAcademy,
  useVerifyEmail,
} from "../../api/generated/edutrack";

type Step = "REQUEST" | "EMAIL" | "ACADEMY" | "COMPLETE";

type SignupRequestBody = {
  signupToken?: string;
  [key: string]: any;
};

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("REQUEST");
  const [requestDone, setRequestDone] = useState(false);

  const [emailCode, setEmailCode] = useState("");
  const [academyVerified, setAcademyVerified] = useState(false);

  const [signupToken, setSignupToken] = useState<string>(
    sessionStorage.getItem("signupToken") ?? ""
  );

  const [form, setForm] = useState<SignupForm>({
    name: "",
    loginId: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    academyCode: "",
    emailVerified: false,
  });

  const [errors, setErrors] = useState<SignupErrors>({
    name: "",
    loginId: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    academyCode: "",
    emailVerified: "",
  });

  const signupRequestMut = useSignupRequest();
  const sendEmailMut = useSendEmailVerification();
  const verifyEmailMut = useVerifyEmail();
  const verifyAcademyMut = useVerifyAcademy();
  const completeSignupMut = useCompleteSignup();

  const busy =
    signupRequestMut.isPending ||
    sendEmailMut.isPending ||
    verifyEmailMut.isPending ||
    verifyAcademyMut.isPending ||
    completeSignupMut.isPending;

  // ⚠️ 백엔드가 받는 헤더 이름에 맞게 수정
  const SIGNUP_TOKEN_HEADER = "Signup-Token";

  // 가입 플로우 API에 signupToken 헤더 자동 부착
  const withSignupToken = () => {
    const token = signupToken || sessionStorage.getItem("signupToken");
    return token
      ? { axios: { headers: { [SIGNUP_TOKEN_HEADER]: token } } }
      : undefined;
  };

  const handleChange =
    (key: keyof SignupForm) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setForm((prev) => {
        const next = { ...prev, [key]: value };

        if (key === "email") next.emailVerified = false;

        if (key === "academyCode") setAcademyVerified(false);

        return next;
      });

      setErrors((prev) => ({
        ...prev,
        [key]: validateField(key, value, { ...form, [key]: value }),
      }));
    };

  // =========================
  // 1) 1차 가입요청 (/api/auth/signup/request)
  // 이름+아이디+비번+전화+이메일
  // =========================
  const canRequest = useMemo(() => {
    return (
      form.name.trim() !== "" &&
      form.loginId.trim() !== "" &&
      form.password.trim() !== "" &&
      form.confirmPassword.trim() !== "" &&
      form.phone.trim() !== "" &&
      form.email.trim() !== "" &&
      errors.name === "" &&
      errors.loginId === "" &&
      errors.password === "" &&
      errors.confirmPassword === "" &&
      errors.phone === "" &&
      errors.email === "" &&
      form.password === form.confirmPassword
    );
  }, [form, errors]);

  const handleSignupRequest = async () => {
    const payload = {
      name: form.name,
      loginId: form.loginId,
      password: form.password,
      phone: form.phone,
      email: form.email,
    };

    try {
      const res = await signupRequestMut.mutateAsync({ data: payload });

      const token =
        typeof res.data === "string"
          ? res.data
          : (res.data as any)?.signupToken;

      if (token) {
        setSignupToken(token);
        sessionStorage.setItem("signupToken", token);
      }

      setRequestDone(true);
      setStep("EMAIL");
      alert("가입요청 완료! 이메일 인증을 진행해주세요.");
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setRequestDone(true);
        setStep("EMAIL");
        alert("이미 가입요청이 존재합니다. 이메일 인증을 진행해주세요.");
        return;
      }
      alert(err?.response?.data?.message ?? "가입요청 실패");
    }
  };

  // =========================
  // 2) 이메일 인증 코드 발송 (/api/auth/send-email-verification)
  // requestDone 이후에만 가능
  // =========================
  const handleSendEmailVerification = async () => {
    if (!requestDone) {
      alert("먼저 가입요청(1차)을 완료해주세요.");
      return;
    }
    if (errors.email) {
      alert("이메일 형식을 확인해주세요.");
      return;
    }

    const token = signupToken || sessionStorage.getItem("signupToken");
    if (!token) {
      alert("가입 토큰을 찾을 수 없습니다. 다시 가입요청을 해주세요.");
      return;
    }

    await sendEmailMut.mutateAsync(
      { data: { signupToken: token } as any },
      withSignupToken()
    );

    alert("이메일 인증번호를 발송했습니다.");
  };

  // =========================
  // 3) 이메일 인증 확인 (/api/auth/verify-email)
  // =========================
  const canVerifyEmail = useMemo(() => {
    return requestDone && form.email.trim() !== "" && emailCode.trim() !== "";
  }, [requestDone, form.email, emailCode]);

  const handleVerifyEmail = async () => {
    if (!canVerifyEmail) return;

    const token = signupToken || sessionStorage.getItem("signupToken");
    if (!token) {
      alert("가입 토큰을 찾을 수 없습니다. 다시 가입요청을 해주세요.");
      return;
    }

    await verifyEmailMut.mutateAsync(
      {
        data: {
          signupToken: token,
          inputCode: emailCode,
        } as any,
      },
      withSignupToken()
    );

    setForm((prev) => ({ ...prev, emailVerified: true }));
    setStep("ACADEMY");
    alert("이메일 인증 완료!");
  };

  // =========================
  // 4) 학원코드 인증 (/api/auth/academy-verify)
  // =========================
  const canVerifyAcademy = useMemo(() => {
    return (
      form.emailVerified &&
      form.academyCode.trim() !== "" &&
      errors.academyCode === ""
    );
  }, [form.emailVerified, form.academyCode, errors.academyCode]);

  const handleVerifyAcademy = async () => {
    if (!canVerifyAcademy) return;

    const token = signupToken || sessionStorage.getItem("signupToken");
    if (!token) {
      alert("가입 토큰을 찾을 수 없습니다. 다시 가입요청을 해주세요.");
      return;
    }

    await verifyAcademyMut.mutateAsync(
      { data: { signupToken: token, academyCode: form.academyCode } as any },
      withSignupToken()
    );

    setAcademyVerified(true);
    setStep("COMPLETE");
    alert("학원코드 인증 완료!");
  };

  // =========================
  // 5) 최종 회원가입 완료 (/api/auth/signup/complete)
  // =========================
  const canComplete = useMemo(() => {
    return (
      requestDone &&
      form.emailVerified &&
      academyVerified &&
      form.academyCode.trim() !== "" &&
      errors.academyCode === ""
    );
  }, [
    requestDone,
    form.emailVerified,
    academyVerified,
    form.academyCode,
    errors.academyCode,
  ]);

  const handleCompleteSignup = async () => {
    if (!canComplete) return;

    const token = signupToken || sessionStorage.getItem("signupToken");
    if (!token) {
      alert("가입 토큰을 찾을 수 없습니다. 다시 가입요청을 해주세요.");
      return;
    }

    await completeSignupMut.mutateAsync(
      {
        data: { signupToken: token } as any,
      },
      withSignupToken()
    );

    // ✅ 가입 완료 후 signupToken 정리
    sessionStorage.removeItem("signupToken");
    setSignupToken("");

    alert("회원가입 성공!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full p-6 max-w-lg bg-white shadow-lg rounded-lg space-y-4">
        <h1 className="text-4xl font-bold text-center">
          <Link to="/">EduTrack</Link>
        </h1>

        {/* 1차 가입요청 */}
        <div className="space-y-3">
          <BaseInput
            label="이름"
            placeholder="한글로 공백없이 입력해주세요"
            value={form.name}
            onChange={handleChange("name")}
            error={errors.name}
            required
            disabled={requestDone}
          />

          <BaseInput
            label="아이디"
            placeholder="영문/숫자 5~15자로 입력해주세요"
            value={form.loginId}
            onChange={handleChange("loginId")}
            error={errors.loginId}
            required
            disabled={requestDone}
          />

          <PasswordInput
            label="비밀번호"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="비밀번호를 입력해주세요"
            error={errors.password}
            required
            disabled={requestDone}
          />

          <PasswordInput
            label="비밀번호 확인"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="비밀번호를 다시 입력해주세요"
            error={errors.confirmPassword}
            required
            disabled={requestDone}
          />

          <BaseInput
            label="휴대전화"
            placeholder="- 없이 숫자만 입력해주세요"
            value={form.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
            required
            maxLength={11}
            disabled={requestDone}
          />

          <BaseInput
            label="이메일"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
            required
            disabled={requestDone}
          />

          <button
            className="btn btn-primary w-full"
            type="button"
            disabled={!canRequest || requestDone || busy}
            onClick={handleSignupRequest}
          >
            가입요청
          </button>
        </div>

        <hr />

        {/* 이메일 인증 */}
        <div className="space-y-2">
          <button
            className="btn btn-primary w-full"
            type="button"
            disabled={!requestDone || busy}
            onClick={handleSendEmailVerification}
          >
            이메일 인증코드 발송
          </button>

          <BaseInput
            label="이메일 인증코드"
            placeholder="메일로 받은 인증번호 입력"
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
            error=""
            required
            disabled={!requestDone || form.emailVerified}
          />

          <button
            className="btn btn-primary w-full"
            type="button"
            disabled={!canVerifyEmail || form.emailVerified || busy}
            onClick={handleVerifyEmail}
          >
            이메일 인증 확인
          </button>
        </div>

        <hr />

        {/* 학원코드 인증 */}
        <div className="space-y-2">
          <BaseInput
            label="학원코드"
            placeholder="이메일 인증 후 입력"
            value={form.academyCode}
            onChange={handleChange("academyCode")}
            error={errors.academyCode}
            required
            disabled={!form.emailVerified}
          />

          <button
            className="btn btn-primary w-full"
            type="button"
            disabled={!canVerifyAcademy || academyVerified || busy}
            onClick={handleVerifyAcademy}
          >
            학원코드 인증
          </button>

          <button
            className="btn btn-primary w-full"
            type="button"
            disabled={!canComplete || busy}
            onClick={handleCompleteSignup}
          >
            최종 회원가입 완료
          </button>
        </div>
      </div>
    </div>
  );
}
