import { useState, type ChangeEvent } from "react";
import BaseInput from "../../components/common/input/BaseInput";
import { validateField } from "../../utils/validationField";
import type { SignupForm, SignupErrors } from "../../types/signup";
import PasswordInput from "../../components/common/input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import EmailInput from "../../components/common/input/EmailInput";
import axiosInstance from "../../api/axiosInstance";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupForm>({
    name: "",
    loginId: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    academyCode: "EDU-1234",
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

  const isFormValid =
    form.name.trim() !== "" &&
    form.loginId.trim() !== "" &&
    form.password.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.academyCode.trim() !== "" &&
    errors.name === "" &&
    errors.loginId === "" &&
    errors.password === "" &&
    errors.email === "" &&
    errors.phone === "" &&
    errors.academyCode === "" &&
    form.emailVerified === true; // 이메일 인증 완료

  const handleChange =
    (key: keyof SignupForm) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      //form값 업데이트
      setForm({
        ...form,
        [key]: value,
      });

      //오류 검사
      setErrors((prev) => ({
        ...prev,
        [key]: validateField(key, value, { ...form, [key]: value }),
      }));
    };

  const handleSignup = async () => {
    try {
      const res = await axiosInstance.post("/users/signup", {
        academyCode: form.academyCode,
        loginId: form.loginId,
        password: form.password,
        name: form.name,
        phone: form.phone,
        email: form.email,
      });

      alert("회원가입 성공!");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full p-6 max-w-lg bg-white shadow-lg rounded-lg space-y-4">
        <h1 className="text-4xl font-bold text-center">
          <Link to={"http://localhost:5173"}>EduTrack</Link>
        </h1>
        <div>
          <BaseInput
            label="이름"
            placeholder="한글로 공백없이 입력해주세요"
            value={form.name}
            onChange={handleChange("name")}
            error={errors.name}
            required={true}
          />
          <BaseInput
            label="아이디"
            placeholder="영문/숫자 5~15자로 입력해주세요"
            value={form.loginId}
            onChange={handleChange("loginId")}
            error={errors.loginId}
            required={true}
          />
          <PasswordInput
            label="비밀번호"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="비밀번호를 입력해주세요"
            error={errors.password}
            required={true}
          />
          {!errors.password && form.password.trim() !== "" && (
            <PasswordInput
              label="비밀번호 확인"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="비밀번호를 다시 입력해주세요"
              error={errors.confirmPassword}
              disabled={!form.password || errors.password !== ""}
              required
            />
          )}
          <BaseInput
            label="휴대전화"
            placeholder="- 없이 숫자만 입력해주세요"
            value={form.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
            required
            maxLength={11}
          />
          <EmailInput
            value={form.email}
            onChange={(email) => setForm({ ...form, email })}
            error={errors.email}
            onVerified={() => setForm({ ...form, emailVerified: true })}
          />
          <BaseInput
            label="학원코드"
            placeholder="학원코드를 입력해주세요"
            value={form.academyCode}
            onChange={handleChange("academyCode")}
            error={errors.academyCode}
            required={true}
          />
          <button
            className="btn btn-primary w-full mt-4"
            disabled={!isFormValid}
            onClick={handleSignup}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
