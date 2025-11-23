import { validators } from "./validations";
import type { SignupForm } from "../types/signup";


export const validateField = (
  key: keyof SignupForm,
  value: string,
  form: SignupForm
) => {

  if (key === "password") {
    return validators.password.validate(value)
      ? ""
      : validators.password.message;
  }

  if (key === "confirmPassword") {
    if (form.password !== value) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return "";
  }

  const validator = validators[key];
  if (!validator) return "";
  return validator.validate(value) ? "" : validator.message;
};

