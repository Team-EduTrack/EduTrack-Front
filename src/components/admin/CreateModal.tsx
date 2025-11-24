import { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

interface User {
  id: number;
  name: string;
  role: string;
  userId: string;
  phone: string;
  schoolName: string;
  code: string;
  createdAt: Date;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string, newUser: User) => void;
  existingUsers: { userId: string; phone: string }[];
}

export default function CreateModal({ isOpen, onClose, onSuccess, existingUsers }: Props) {
  const [formData, setFormData] = useState({ name: "", userId: "", password: "", passwordConfirm: "", phone: "", schoolName: "" });
  const [errors, setErrors] = useState({ userId: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "userId" || name === "phone") setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const checkDuplicates = () => {
    const newErrors = { userId: "", phone: "" };
    if (existingUsers.some((user) => user.userId === formData.userId)) newErrors.userId = "중복된 아이디입니다.";
    if (existingUsers.some((user) => user.phone === formData.phone)) newErrors.phone = "중복된 휴대전화 번호입니다.";
    setErrors(newErrors);
    return !newErrors.userId && !newErrors.phone;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) return alert("비밀번호가 일치하지 않습니다.");
    if (!checkDuplicates()) return;
    const code = `EDU-${Math.floor(1000 + Math.random() * 9000)}`;
    onSuccess(code, { id: Date.now(), name: formData.name, role: "원장", userId: formData.userId, phone: formData.phone, schoolName: formData.schoolName, code, createdAt: new Date() });
    setFormData({ name: "", userId: "", password: "", passwordConfirm: "", phone: "", schoolName: "" });
    setErrors({ userId: "", phone: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="font-bold text-xl mb-6 text-center text-gray-900">원장 계정 생성</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="이름" name="name" placeholder="이름을 입력하세요" value={formData.name} onChange={handleChange} required />
        <Input label="아이디" name="userId" placeholder="영문/숫자 5~15자" value={formData.userId} onChange={handleChange} error={errors.userId} required />
        <Input label="비밀번호" type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
        <Input label="비밀번호 확인" type="password" name="passwordConfirm" placeholder="비밀번호 확인" value={formData.passwordConfirm} onChange={handleChange} required />
        <Input label="휴대전화" type="tel" name="phone" placeholder="숫자만 입력" value={formData.phone} onChange={handleChange} error={errors.phone} required />
        <Input label="학원 이름" name="schoolName" placeholder="학원 이름" value={formData.schoolName} onChange={handleChange} required />
        <div className="flex justify-center pt-2">
          <Button type="submit" className="px-8">계정 생성</Button>
        </div>
      </form>
    </Modal>
  );
}
