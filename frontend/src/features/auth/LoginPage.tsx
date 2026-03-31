import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, LogIn, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button, Input } from '@/components/ui';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { authApi } from '@/services/auth.api';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Dispatch straight to redux with token and user
      dispatch(login({ user: data.user, token: data.accessToken }));
      navigate('/pos');
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu'
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent
                          flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Coffee size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">NZT Coffee & Tea</h1>
          <p className="text-text-muted text-sm mt-1">Đăng nhập vào hệ thống POS</p>
        </div>

        {/* Login Form */}
        <div className="bg-surface-raised border border-border rounded-2xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tên đăng nhập"
              placeholder="admin hoặc staff"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="flex items-center gap-2 text-sm text-danger bg-danger/10
                              border border-danger/20 rounded-lg px-3 py-2 animate-fade-in">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={loginMutation.isPending}
              icon={<LogIn size={18} />}
            >
              Đăng nhập
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-[11px] text-text-muted text-center mb-2 uppercase tracking-wider font-semibold">
              Tài khoản demo
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-surface-overlay rounded-lg px-3 py-2 text-center">
                <p className="font-medium text-text">Admin</p>
                <p className="text-text-muted">admin / admin123</p>
              </div>
              <div className="bg-surface-overlay rounded-lg px-3 py-2 text-center">
                <p className="font-medium text-text">Staff</p>
                <p className="text-text-muted">staff / staff123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
