import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../features/auth/AuthLayout';
import { SocialAuthButtons } from '../features/auth/SocialAuthButtons';
import { PasswordStrengthMeter } from '../features/auth/PasswordStrengthMeter';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { usePasswordStrength } from '../hooks/usePasswordStrength';

export interface SignUpPageProps {
  onNavigateToSignIn: () => void;
  onRegisterSuccess: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onNavigateToSignIn,
  onRegisterSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = usePasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (password !== passwordConfirm) {
      setError('As senhas não coincidem');
      return;
    }

    if (!agreeTerms) {
      setError('Você precisa concordar com os termos para prosseguir');
      return;
    }

    setIsLoading(false);
    onRegisterSuccess();
  };

  return (
    <AuthLayout
      title="Crie sua conta gratuita"
      subtitle="Junte-se a mais de 50.000 famílias no caminho da serenidade financeira."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Social logins */}
        <SocialAuthButtons />

        {/* Full Name */}
        <Input
          id="signup-name"
          label="Nome completo"
          placeholder="Ex: Davi Silva"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (error) setError('');
          }}
          required
        />

        {/* Email */}
        <Input
          id="signup-email"
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
        <div>
          <Input
            id="signup-password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="Crie uma senha segura"
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
          {password && <PasswordStrengthMeter strength={passwordStrength} />}
        </div>

        {/* Password Confirmation */}
        <Input
          id="signup-confirm"
          label="Confirmar senha"
          type="password"
          placeholder="Repita sua senha"
          value={passwordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.target.value);
            if (error) setError('');
          }}
          required
        />

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        {/* Terms agreement checkbox */}
        <div className="pt-1">
          <Checkbox
            id="signup-terms"
            checked={agreeTerms}
            onChange={(val) => {
              setAgreeTerms(val);
              if (error) setError('');
            }}
            label={
              <span className="text-xs text-on-surface-variant">
                Concordo com os{' '}
                <a href="#termos" className="text-primary font-semibold hover:underline">
                  Termos de Serviço
                </a>{' '}
                e{' '}
                <a href="#privacidade" className="text-primary font-semibold hover:underline">
                  Política de Privacidade
                </a>
              </span>
            }
          />
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
          Criar minha conta
        </Button>

        {/* Switch to SignIn */}
        <div className="text-center pt-4 border-t border-[rgba(44,24,16,0.06)] text-xs text-outline">
          <span>Já tem uma conta? </span>
          <button
            type="button"
            onClick={onNavigateToSignIn}
            className="font-bold text-primary hover:text-primary-container transition-colors cursor-pointer"
          >
            Fazer login
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
