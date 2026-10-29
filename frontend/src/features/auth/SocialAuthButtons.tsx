import React from 'react';

export interface SocialAuthButtonsProps {
  onGoogleAuth?: () => void;
  onAppleAuth?: () => void;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onGoogleAuth,
  onAppleAuth,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onGoogleAuth}
          className="h-11 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-2.5 border border-[rgba(44,24,16,0.06)] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={onAppleAuth}
          className="h-11 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-2.5 border border-[rgba(44,24,16,0.06)] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.99-5.99-9.13-10.83-19.53-14.53-31.21-3.7-11.68-5.55-22.77-5.55-33.27 0-14.13 3.59-25.54 10.76-34.22 7.18-8.68 16.14-13.12 26.89-13.33 4.9.11 10.45 1.34 16.65 3.69 6.2 2.36 10.27 3.59 12.21 3.69 1.58 0 5.8-1.29 12.65-3.86 6.86-2.58 12.39-3.76 16.6-3.56 12.64.65 22.84 5.38 30.61 14.19-11.09 6.74-16.53 15.98-16.32 27.72.22 9.13 3.7 16.85 10.44 23.16 6.74 6.3 14.89 9.89 24.46 10.76-2.28 6.74-4.89 13.15-7.83 19.24zM119.22 31.84c0-7.39 2.61-14.24 7.83-20.55 5.22-6.3 11.74-10.43 19.57-12.39.22 1.3.33 2.5.33 3.59 0 7.39-2.72 14.46-8.15 21.2-5.43 6.74-12.06 10.76-19.89 12.06-.11-1.09-.11-2.4-.11-3.91z" />
          </svg>
          <span>Apple</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[rgba(44,24,16,0.08)]" />
        </div>
        <div className="relative bg-surface-container-lowest px-4 text-xs text-outline font-medium">
          ou continue com e-mail
        </div>
      </div>
    </div>
  );
};
