import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '@/services/auth';
import { useAppStore } from '@/store/useAppStore';
import toast from 'react-hot-toast';

type Tab = 'login' | 'register';
interface FormData { username: string; password: string; }

export default function LoginPage() {
  const [tab, setTab]         = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();
  const setUsername           = useAppStore((s) => s.setUsername);

  const { register, handleSubmit, reset, formState: { errors, isSubmitted } } =
    useForm<FormData>({ mode: 'onSubmit', reValidateMode: 'onSubmit' });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = tab === 'login'
        ? await authService.login(data)
        : await authService.register(data);
      setUsername(res.username);
      toast.success(tab === 'login' ? 'Welcome back!' : 'Account created!');
      navigate('/meetings');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    reset({ username: '', password: '' });
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <svg width="44" height="44" viewBox="0 0 28 28" fill="none" aria-label="AutoMinutes" style={{ marginBottom: '0.75rem' }}>
            <rect width="28" height="28" rx="7" fill="var(--color-primary)" />
            <path d="M7 8h14M7 14h9M7 20h11" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="21" cy="20" r="3.5" fill="white" opacity="0.9" />
          </svg>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text)' }}>AutoMinutes</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>AI-powered meeting notes</p>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-divider)', marginBottom: '1.25rem' }}>
            {(['login', 'register'] as Tab[]).map((t) => (
              <button key={t} onClick={() => switchTab(t)} style={{
                flex: 1, padding: '0.5rem', fontSize: 'var(--text-sm)', fontWeight: 500,
                borderBottom: tab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: tab === t ? 'var(--color-primary)' : 'var(--color-text-muted)',
                background: 'none', cursor: 'pointer', textTransform: 'capitalize',
                transition: 'all 180ms', marginBottom: '-1px',
              }}>
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--color-text)' }}>Username</label>
              <input
                {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Min 3 characters' } })}
                autoComplete="username"
                style={{ width: '100%', padding: '0.625rem 0.75rem', fontSize: 'var(--text-sm)', border: `1px solid ${errors.username ? 'var(--color-error)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-2)', color: 'var(--color-text)', outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.username && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', marginTop: '0.25rem' }}>{errors.username.message}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--color-text)' }}>Password</label>
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                type="password"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                style={{ width: '100%', padding: '0.625rem 0.75rem', fontSize: 'var(--text-sm)', border: `1px solid ${errors.password ? 'var(--color-error)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-2)', color: 'var(--color-text)', outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.password && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', marginTop: '0.25rem' }}>{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.75rem', marginTop: '0.25rem',
              background: 'var(--color-primary)', color: 'white',
              border: 'none', borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'all 180ms',
            }}>
              {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}