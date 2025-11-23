export const validators = {

    name: {
        validate: (v:string) => v.length >= 2 && /^[가-힣]+$/.test(v),
        message: "이름은 한글 2자 이상으로 입력해주세요.",
      },
    loginId: {
        validate: (v:string) => /^[A-Za-z0-9]{5,15}$/.test(v),
        message: "아이디는 영문/숫자 5~15자입니다.",
      },
    password: {
        validate: (v: string) =>
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(v),
        message:
          "비밀번호는 영문+숫자+특수문자를 포함해 8자 이상이어야 합니다.",
      },
    email: {
        validate: (v:string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "바른 이메일 형식이 아닙니다.",
      },
    phone: {
        validate: (v:string) => /^010\d{7,8}$/.test(v.replace(/-/g, "")),
        message: "올바른 전화번호 형식이 아닙니다.",
      },
}
