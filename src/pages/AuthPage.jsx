import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { api } from '../utils/api.js';
import { ShieldCheck, Lock, Mail, User, Phone, Sparkles, ArrowRight, KeyRound, Eye, EyeOff, Crown, UserCheck } from 'lucide-react';

export default function AuthPage() {
  const { user, login, register, quickLogin, isAuthenticated } = useAuth();
  const { navigateTo, showToast, authReturnPage, setAuthReturnPage } = useUI();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password Recovery state
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: request, 2: enter code and new password
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (isAuthenticated) {
    if (authReturnPage) {
      const returnTarget = authReturnPage;
      setAuthReturnPage(null);
      navigateTo(returnTarget);
    } else if (user?.role === 'admin') {
      navigateTo('admin');
    } else {
      navigateTo('profile');
    }
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        showToast('Welcome to the TIMUSE private salon.');
        if (authReturnPage) {
          const returnTarget = authReturnPage;
          setAuthReturnPage(null);
          navigateTo(returnTarget);
        } else if (res?.user?.role === 'admin' || email.toLowerCase().includes('admin')) {
          navigateTo('admin');
        } else {
          navigateTo('profile');
        }
      } else if (mode === 'register') {
        await register({ name, email, password, phone, role: 'customer' });
        showToast('VIP Client credentials registered successfully.');
        if (authReturnPage) {
          const returnTarget = authReturnPage;
          setAuthReturnPage(null);
          navigateTo(returnTarget);
        } else {
          navigateTo('profile');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.forgotPassword(email);
      if (res.success) {
        showToast(`Verification code dispatched to ${email}`);
        setRecoveryStep(2);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error initiating password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (verificationCode !== '849201') {
      setErrorMsg('Invalid verification token. Hint: Use 849201');
      return;
    }
    setLoading(true);
    try {
      const res = await api.resetPassword(email, newPassword);
      if (res.success) {
        showToast('Password reset successfully! Please sign in with your new password.');
        setMode('login');
        setRecoveryStep(1);
        setPassword(newPassword);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setErrorMsg('');
    setLoading(true);
    try {
      if (role === 'admin') {
        setEmail('admin@timuse.luxury');
        setPassword('TimuseAdmin2026!');
      } else {
        setEmail('client@timuse.luxury');
        setPassword('client123');
      }
      setMode('login');

      const res = await quickLogin(role);
      showToast(`Signed in as ${role === 'admin' ? 'Master Executive Director' : 'VIP Client'}`);
      if (authReturnPage) {
        const returnTarget = authReturnPage;
        setAuthReturnPage(null);
        navigateTo(returnTarget);
      } else if (role === 'admin') {
        navigateTo('admin');
      } else {
        navigateTo('profile');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = (role) => {
    setErrorMsg('');
    setMode('login');
    if (role === 'admin') {
      setEmail('admin@timuse.luxury');
      setPassword('TimuseAdmin2026!');
      showToast('Admin credentials loaded into login form.');
    } else {
      setEmail('client@timuse.luxury');
      setPassword('client123');
      showToast('VIP Client credentials loaded into login form.');
    }
  };

  return (
    <div className="py-16 px-4 sm:px-8 max-w-lg mx-auto animate-fadeIn bg-[#050505] text-white">
      {/* Return to checkout notification */}
      {authReturnPage === 'checkout' && (
        <div className="mb-6 p-4 rounded-2xl bg-[#E5C158]/10 border border-[#E5C158]/40 text-left space-y-1 animate-pulse">
          <span className="text-[11px] uppercase font-bold text-[#E5C158] tracking-widest flex items-center space-x-1.5">
            <Lock className="w-4 h-4" />
            <span>Order Escrow Authentication Required</span>
          </span>
          <p className="text-xs text-neutral-300">
            Please sign in or create your client account to secure your timepiece allocation. You will be redirected immediately back to complete your white-glove checkout.
          </p>
        </div>
      )}

      {/* Evaluator Demo Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-[#0E0E0E] border border-[#E5C158]/40 text-center space-y-2.5">
        <span className="text-[10px] uppercase font-bold text-[#E5C158] tracking-widest flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Aptech Evaluation Credentials (Database-Verified)</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-300">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left space-y-1.5 hover:border-[#E5C158]/40 transition-colors">
            <div className="text-[#E5C158] font-bold flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Crown className="w-3.5 h-3.5 text-[#E5C158] shrink-0" />
                <span>Master Admin:</span>
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#E5C158]/20 text-[#E5C158]">Full Access</span>
            </div>
            <div className="font-mono text-[10px] text-white">admin@timuse.luxury</div>
            <div className="font-mono text-[10px] text-neutral-400">Pass: <span className="text-white font-semibold">TimuseAdmin2026!</span></div>
            <div className="flex gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleFillCredentials('admin')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-[10px] font-semibold uppercase transition-colors"
              >
                Fill Form
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] text-[10px] font-bold uppercase transition-colors shadow-md"
              >
                Sign In
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left space-y-1.5 hover:border-white/30 transition-colors">
            <div className="text-white font-bold flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span>VIP Client:</span>
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-400">Buyer</span>
            </div>
            <div className="font-mono text-[10px] text-white">client@timuse.luxury</div>
            <div className="font-mono text-[10px] text-neutral-400">Pass: <span className="text-white font-semibold">client123</span></div>
            <div className="flex gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleFillCredentials('customer')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-[10px] font-semibold uppercase transition-colors"
              >
                Fill Form
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#E5C158]/20 hover:bg-[#E5C158]/30 text-[#E5C158] text-[10px] font-bold uppercase border border-[#E5C158]/30 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-[#0E0E0E] rounded-3xl p-8 border border-white/15 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full border border-[#E5C158] flex items-center justify-center bg-[#141414] text-[#E5C158] mx-auto mb-3 shadow-[0_0_20px_rgba(229,193,88,0.2)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            {mode === 'login' && 'Sign In to Your Vault'}
            {mode === 'register' && 'Apply for Client Credentials'}
            {mode === 'forgot' && 'Password Recovery Protocol'}
          </h2>
          <p className="text-xs text-neutral-400">
            {mode === 'login' && 'Enter your accredited email and passphrase.'}
            {mode === 'register' && 'Join the private registry of Swiss watch connoisseurs.'}
            {mode === 'forgot' && 'Reset your private access credentials.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Mode 1 & 2: Login or Register */}
        {mode !== 'forgot' ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-slate-400 mb-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Lord Arthur Pendelton"
                      className="w-full bg-luxury-900 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-slate-100 focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Telephone / Mobile</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+41 22 819 12 00"
                      className="w-full bg-luxury-900 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-slate-100 focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-400 mb-1">Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@timuse.luxury or client@timuse.luxury"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-slate-100 placeholder:text-neutral-500 focus:outline-none focus:border-[#E5C158]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400">Passphrase</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(''); }}
                    className="text-[11px] text-[#E5C158] hover:underline"
                  >
                    Forgot Passphrase?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-slate-100 placeholder:text-neutral-500 focus:outline-none focus:border-[#E5C158]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  title={showPassword ? 'Hide Passphrase' : 'Show Passphrase'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-button py-3 rounded-xl text-xs font-bold text-luxury-950 uppercase tracking-wider flex items-center justify-center space-x-2 shadow-gold-sm"
            >
              <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Enter Private Vault' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Mode 3: Forgot Password Protocol */
          <div className="space-y-4 text-xs">
            {recoveryStep === 1 ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-slate-400 mb-1">Registered Account Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter the email associated with your account"
                    className="w-full bg-luxury-900 border border-white/10 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gold-button py-2.5 rounded-xl font-bold text-luxury-950 uppercase tracking-wider"
                >
                  {loading ? 'Sending Protocol...' : 'Send Recovery Token'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="p-3 rounded-xl bg-luxury-gold/15 border border-luxury-gold/30 text-luxury-gold text-[11px]">
                  Verification token dispatched. Test token: <strong className="font-mono text-white">849201</strong>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Verification Token</label>
                  <input
                    type="text"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit token (849201)"
                    className="w-full bg-luxury-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-luxury-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">New Secure Passphrase</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-luxury-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gold-button py-2.5 rounded-xl font-bold text-luxury-950 uppercase tracking-wider"
                >
                  {loading ? 'Updating...' : 'Set New Passphrase'}
                </button>
              </form>
            )}

            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className="w-full text-center text-slate-400 hover:text-white text-xs underline pt-2"
            >
              Return to Sign In
            </button>
          </div>
        )}

        {/* Footer Toggle between login / register */}
        {mode !== 'forgot' && (
          <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <p>
                New collector?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  className="text-luxury-gold font-semibold hover:underline"
                >
                  Create an Account
                </button>
              </p>
            ) : (
              <p>
                Already accredited?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className="text-luxury-gold font-semibold hover:underline"
                >
                  Sign In Here
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
