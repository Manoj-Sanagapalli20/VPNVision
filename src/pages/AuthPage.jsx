import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { VpnLogo } from '../components/common/VpnLogo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);

  // Form states
  const [loginEmail, setLoginEmail] = useState('admin@vpnvision.io');
  const [loginPassword, setLoginPassword] = useState('AdminSecret2026!');
  
  const [registerName, setRegisterName] = useState('');
  const [registerOrg, setRegisterOrg] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      showToast('Authentication successful. Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Authentication failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !registerName) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      await register(registerEmail, registerPassword, registerName, registerOrg);
      showToast('Account created successfully. Welcome to VPN Vision!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full flex flex-col items-center">
        {/* Header Branding Area */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#BFDBFE] dark:border-[#363A3F] shadow-md p-3 flex items-center justify-center">
            <VpnLogo className="w-10 h-10 text-[#2563eb] dark:text-[#E8EAED]" />
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17212B] dark:text-[#E8EAED] uppercase">
            See Beyond
          </h1>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa] mt-0.5">
            The VPN.
          </h2>

          <div className="flex items-center gap-2 mt-3 opacity-80">
            <span className="w-6 h-[1.5px] bg-[#2563eb] dark:bg-[#60a5fa]"></span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F6B76] dark:text-[#777E86] font-bold">Secure Enterprise Gateway</span>
            <span className="w-6 h-[1.5px] bg-[#2563eb] dark:bg-[#60a5fa]"></span>
          </div>
        </div>

        {/* Auth Form Card */}
        <div className="w-full bg-[#FFFFFF] dark:bg-[#232629] rounded-2xl shadow-[0_15px_35px_-5px_rgba(0,0,0,0.06)] border border-[#D9DEE5] dark:border-[#363A3F] overflow-hidden relative">
          {/* Top Tabs */}
          <div className="flex bg-[#F8FAFC] dark:bg-[#1D2023] border-b border-[#E2E8F0] dark:border-[#363A3F]">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                activeTab === 'login'
                  ? 'text-[#2563eb] dark:text-[#E8EAED] bg-[#FFFFFF] dark:bg-[#232629]'
                  : 'text-[#5F6B76] dark:text-[#777E86] bg-[#F8FAFC] dark:bg-[#1D2023] hover:text-[#17212B] dark:hover:text-[#E8EAED]'
              }`}
            >
              Sign In
              <div className={`absolute top-0 left-0 w-full h-[2.5px] bg-[#2563eb] dark:bg-[#E8EAED] transition-opacity duration-300 ${activeTab === 'login' ? 'opacity-100' : 'opacity-0'}`} />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                activeTab === 'register'
                  ? 'text-[#2563eb] dark:text-[#E8EAED] bg-[#FFFFFF] dark:bg-[#232629]'
                  : 'text-[#5F6B76] dark:text-[#777E86] bg-[#F8FAFC] dark:bg-[#1D2023] hover:text-[#17212B] dark:hover:text-[#E8EAED]'
              }`}
            >
              Create Account
              <div className={`absolute top-0 left-0 w-full h-[2.5px] bg-[#2563eb] dark:bg-[#E8EAED] transition-opacity duration-300 ${activeTab === 'register' ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-7">
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                {/* Email Field */}
                <div className="group relative flex flex-col bg-[#F8FAFC] dark:bg-[#202326] rounded-xl overflow-hidden border border-[#D9DEE5] dark:border-[#363A3F] focus-within:border-[#2563eb] dark:focus-within:border-[#3b82f6] focus-within:bg-[#FFFFFF] dark:focus-within:bg-[#1D2023] transition-colors">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[#2563eb] dark:bg-[#60a5fa] transition-all duration-300 group-focus-within:h-full"></div>
                  <label className="px-4 pt-2.5 font-mono text-[10px] font-bold text-[#5F6B76] dark:text-[#777E86] uppercase tracking-wider">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="sysadmin@enterprise.net"
                    className="w-full bg-transparent px-4 pb-2.5 pt-0.5 font-sans text-sm text-[#17212B] dark:text-[#E8EAED] outline-none placeholder:text-[#8A949E] dark:placeholder:text-[#777E86]"
                  />
                </div>

                {/* Password Field */}
                <div className="group relative flex flex-col bg-[#F8FAFC] dark:bg-[#202326] rounded-xl overflow-hidden border border-[#D9DEE5] dark:border-[#363A3F] focus-within:border-[#2563eb] dark:focus-within:border-[#3b82f6] focus-within:bg-[#FFFFFF] dark:focus-within:bg-[#1D2023] transition-colors">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[#2563eb] dark:bg-[#60a5fa] transition-all duration-300 group-focus-within:h-full"></div>
                  <label className="px-4 pt-2.5 font-mono text-[10px] font-bold text-[#5F6B76] dark:text-[#777E86] uppercase tracking-wider">
                    PASSWORD
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent px-4 pb-2.5 pt-0.5 font-mono text-sm text-[#17212B] dark:text-[#E8EAED] outline-none placeholder:text-[#8A949E] dark:placeholder:text-[#777E86] tracking-widest"
                  />
                </div>

                {/* Remember & Forgot Row */}
                <div className="flex justify-between items-center text-xs mt-1">
                  <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <div className="w-4 h-4 rounded bg-[#FFFFFF] dark:bg-[#1D2023] border border-[#CBD5E1] dark:border-[#363A3F] flex items-center justify-center relative overflow-hidden">
                      <input
                        type="checkbox"
                        checked={rememberSession}
                        onChange={(e) => setRememberSession(e.target.checked)}
                        className="peer absolute opacity-0 w-full h-full cursor-pointer"
                      />
                      <div className="absolute inset-0 bg-[#2563eb] dark:bg-[#E8EAED] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      <span className="material-symbols-outlined text-[12px] text-[#ffffff] dark:text-[#17191B] opacity-0 peer-checked:opacity-100 relative z-10 font-bold">
                        check
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#5F6B76] dark:text-[#A7ADB4] group-hover:text-[#17212B] dark:group-hover:text-[#E8EAED] transition-colors">
                      REMEMBER SESSION
                    </span>
                  </label>

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Password reset link dispatched to authorized endpoint.', 'info');
                    }}
                    className="font-mono text-[11px] text-[#2563eb] dark:text-[#60a5fa] hover:underline transition-all font-semibold"
                  >
                    FORGOT PASSWORD?
                  </a>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] dark:border dark:border-[#777E86]/30 shadow-md shadow-[#2563eb]/20 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
                  <span className="material-symbols-outlined text-sm font-bold">north_east</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5">
                {/* Full Name */}
                <div className="group relative flex flex-col bg-[#F8FAFC] dark:bg-[#202326] rounded-xl overflow-hidden border border-[#D9DEE5] dark:border-[#363A3F] focus-within:border-[#2563eb] dark:focus-within:border-[#3b82f6] focus-within:bg-[#FFFFFF] dark:focus-within:bg-[#1D2023] transition-colors">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[#2563eb] dark:bg-[#60a5fa] transition-all duration-300 group-focus-within:h-full"></div>
                  <label className="px-4 pt-2 font-mono text-[10px] font-bold text-[#5F6B76] dark:text-[#777E86] uppercase tracking-wider">
                    FULL NAME
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Alex Hunter"
                    className="w-full bg-transparent px-4 pb-2 pt-0.5 font-sans text-sm text-[#17212B] dark:text-[#E8EAED] outline-none placeholder:text-[#8A949E] dark:placeholder:text-[#777E86]"
                  />
                </div>

                {/* Organization */}
                <div className="group relative flex flex-col bg-[#F8FAFC] dark:bg-[#202326] rounded-xl overflow-hidden border border-[#D9DEE5] dark:border-[#363A3F] focus-within:border-[#2563eb] dark:focus-within:border-[#3b82f6] focus-within:bg-[#FFFFFF] dark:focus-within:bg-[#1D2023] transition-colors">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[#2563eb] dark:bg-[#60a5fa] transition-all duration-300 group-focus-within:h-full"></div>
                  <label className="px-4 pt-2 font-mono text-[10px] font-bold text-[#5F6B76] dark:text-[#777E86] uppercase tracking-wider">
                    ORGANIZATION
                  </label>
                  <input
                    id="register-org"
                    type="text"
                    required
                    value={registerOrg}
                    onChange={(e) => setRegisterOrg(e.target.value)}
                    placeholder="Cyber Command Center"
                    className="w-full bg-transparent px-4 pb-2 pt-0.5 font-sans text-sm text-[#17212B] dark:text-[#E8EAED] outline-none placeholder:text-[#8A949E] dark:placeholder:text-[#777E86]"
                  />
                </div>

                {/* Email */}
                <div className="group relative flex flex-col bg-[#F8FAFC] dark:bg-[#202326] rounded-xl overflow-hidden border border-[#D9DEE5] dark:border-[#363A3F] focus-within:border-[#2563eb] dark:focus-within:border-[#3b82f6] focus-within:bg-[#FFFFFF] dark:focus-within:bg-[#1D2023] transition-colors">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[#2563eb] dark:bg-[#60a5fa] transition-all duration-300 group-focus-within:h-full"></div>
                  <label className="px-4 pt-2 font-mono text-[10px] font-bold text-[#5F6B76] dark:text-[#777E86] uppercase tracking-wider">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="alex@enterprise.net"
                    className="w-full bg-transparent px-4 pb-2 pt-0.5 font-sans text-sm text-[#17212B] dark:text-[#E8EAED] outline-none placeholder:text-[#8A949E] dark:placeholder:text-[#777E86]"
                  />
                </div>

                {/* Password */}
                <div className="group relative flex flex-col bg-[#F8FAFC] dark:bg-[#202326] rounded-xl overflow-hidden border border-[#D9DEE5] dark:border-[#363A3F] focus-within:border-[#2563eb] dark:focus-within:border-[#3b82f6] focus-within:bg-[#FFFFFF] dark:focus-within:bg-[#1D2023] transition-colors">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[#2563eb] dark:bg-[#60a5fa] transition-all duration-300 group-focus-within:h-full"></div>
                  <label className="px-4 pt-2 font-mono text-[10px] font-bold text-[#5F6B76] dark:text-[#777E86] uppercase tracking-wider">
                    PASSWORD
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent px-4 pb-2 pt-0.5 font-mono text-sm text-[#17212B] dark:text-[#E8EAED] outline-none placeholder:text-[#8A949E] dark:placeholder:text-[#777E86] tracking-widest"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] dark:border dark:border-[#777E86]/30 shadow-md shadow-[#2563eb]/20 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
                  <span className="material-symbols-outlined text-sm font-bold">north_east</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default AuthPage;
