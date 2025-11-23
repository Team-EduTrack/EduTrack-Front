
export interface SignupForm {
    name: string;
    loginId: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
    academyCode: string;
    emailVerified: boolean;
  }
  
  export type SignupErrors = {
    [K in keyof SignupForm]: string;
  };
  