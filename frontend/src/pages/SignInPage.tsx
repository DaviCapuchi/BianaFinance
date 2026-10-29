import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../features/auth/AuthLayout';
import { SocialAuthButtons } from '../features/auth/SocialAuthButtons';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';

export interface SignInPageProps {
  onNavigateToSignUp: () => void;
  onLoginSuccess: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onNavigateToSignUp,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Preencha seu e-mail e senha');
      return;
    }

    setIsLoading(false);
    onLoginSuccess();
  };

  return (
    <AuthLayout
      title="Bem-vindo de volta!"
      subtitle="Acesse sua conta para gerenciar suas finanças com tranquilidade."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Social logins */}
        <SocialAuthButtons />

        {/* Email */}
        <Input
          id="signin-email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          required
        />

        {/* Password */}
        <Input
          id="signin-password"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="Sua senha secreta"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          rightIcon={
            <button
              type="button"
              aria-label="Exibir ou ocultar senha"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 hover:text-on-surface transition-colors cursor-pointer text-outline"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
          required
        />

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <Checkbox
            id="signin-remember"
            checked={rememberMe}
            onChange={setRememberMe}
            label="Lembrar deste dispositivo"
          />
          <a
            href="#esqueci-senha"
            className="text-primary hover:text-primary-container font-semibold transition-colors"
          >
            Esqueceu a senha?
          </a>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full mt-2"
        >
          Entrar na conta
        </Button>

        {/* Switch to SignUp */}
        <div className="text-center pt-4 border-t border-[rgba(44,24,16,0.06)] text-xs text-outline">
          <span>Ainda não tem conta? </span>
          <button
            type="button"
            onClick={onNavigateToSignUp}
            className="font-bold text-primary hover:text-primary-container transition-colors cursor-pointer"
          >
            Criar conta gratuita
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
