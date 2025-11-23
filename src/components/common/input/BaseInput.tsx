export interface BaseInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e) => void; // 상태 제어
  error?: string;
  helperText?: string; // (선택)
  required?: boolean; // 필수 여부 (UI 표시용)
  maxLength?: number; // 입력 자릿수 제한
  disabled?: boolean; // 비활성화 input 필요할 때
  isValid?: boolean;
}

export default function BaseInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required,
  maxLength,
  disabled = false,
}: BaseInputProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">
        {label}
        {required && <span className="text-error">*</span>}
      </legend>
      <input
        type={type}
        className={`input w-full ${
          value.trim() === "" ? "" : error ? "input-error" : "input-success"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        disabled={disabled}
      />

      {value.trim() !== "" && error ? (
        <p className="label text-error text-xs">{error}</p>
      ) : value.trim() === "" && helperText ? (
        <p className="label text-xs">{helperText}</p>
      ) : null}
    </fieldset>
  );
}
