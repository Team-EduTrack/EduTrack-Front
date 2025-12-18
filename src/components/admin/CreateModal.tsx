import { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { usePrincipalSignup } from "../../api/generated/edutrack";
import { useConfirm } from "../../hooks/useConfirm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

const INITIAL_FORM = {
  name: "",
  userId: "",
  password: "",
  passwordConfirm: "",
  phone: "",
  email: "",
  schoolName: ""
};

export default function CreateModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  const { mutate: principalSignup, isPending } = usePrincipalSignup();
  const { confirm } = useConfirm();

  const hasInput = Object.values(formData).some((value) => value.trim() !== "");

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setError("");
  };

  const handleClose = async () => {
    if (hasInput) {
      const confirmed = await confirm({
        title: "작성 취소",
        message: "입력한 내용이 모두 사라집니다.\n정말 닫으시겠습니까?",
        confirmText: "닫기",
        cancelText: "계속 작성",
      });
      if (confirmed) {
        resetForm();
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    principalSignup(
      {
        data: {
          principalName: formData.name,
          loginId: formData.userId,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          phone: formData.phone,
          email: formData.email,
          academyName: formData.schoolName,
        },
      },
      {
        onSuccess: ({ data }) => {
          onSuccess(data.academyCode ?? "");
          resetForm();
        },
        onError: (err) => {
          const errorMessage = (err.response?.data as { message?: string })?.message ?? "계정 생성에 실패했습니다.";
          setError(errorMessage);
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h3 className="font-bold text-xl mb-6 text-center text-gray-900">원장 계정 생성</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="이름" name="name" placeholder="이름을 입력하세요" value={formData.name} onChange={handleChange} required />
        <Input label="휴대전화" type="tel" name="phone" placeholder="숫자만 입력" value={formData.phone} onChange={handleChange} required />
        <Input label="이메일" type="email" name="email" placeholder="이메일을 입력하세요" value={formData.email} onChange={handleChange} required />
        <Input label="아이디" name="userId" placeholder="영문/숫자 5~15자" value={formData.userId} onChange={handleChange} required />
        <Input label="비밀번호" type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
        <Input label="비밀번호 확인" type="password" name="passwordConfirm" placeholder="비밀번호 확인" value={formData.passwordConfirm} onChange={handleChange} required />
        <Input label="학원 이름" name="schoolName" placeholder="학원 이름" value={formData.schoolName} onChange={handleChange} required />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex justify-center pt-2">
          <Button type="submit" className="px-8" disabled={isPending}>
            {isPending ? "생성 중..." : "계정 생성"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
