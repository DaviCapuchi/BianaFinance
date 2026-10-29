export interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  avatarUrl?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpCredentials {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agreeTerms: boolean;
}

export interface PasswordStrength {
  score: number;
  label: string;
  advice: string;
  bars: boolean[];
}
