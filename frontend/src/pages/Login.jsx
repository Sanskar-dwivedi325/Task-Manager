import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/errorMessage.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: 'admin@projectworkspace.dev', password: 'password123' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      toast.success('Welcome back');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Sign in" subtitle="Use your workspace credentials to continue.">
      <ErrorBanner message={error} />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            className="input mt-1"
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            className="input mt-1"
            id="password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            minLength={8}
            required
          />
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        New here? <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/signup">Create an account</Link>
      </p>
    </AuthCard>
  );
}
