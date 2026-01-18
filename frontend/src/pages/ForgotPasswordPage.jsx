import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { showSuccess, showError } from '../utils/toast';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      showSuccess('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/verify-otp', { email, otp });
      showSuccess('OTP verified! Now set your new password');
      setStep(3);
    } catch (error) {
      showError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', { email, otp, password });
      showSuccess('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-gray-600 text-center mb-6">
          {step === 1 && 'Enter your email to receive OTP'}
          {step === 2 && 'Enter the OTP sent to your email'}
          {step === 3 && 'Set your new password'}
        </p>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700">
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                pattern="[0-9]{6}"
                className="input-field text-center text-2xl tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
              />
              <p className="text-xs text-gray-500 mt-2">Check your email ({email})</p>
            </div>

            <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary w-full"
            >
              Change Email
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
