import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { gsap } from 'gsap';
import { Eye, EyeOff, Lock, Mail, Database } from 'lucide-react';

const Login: React.FC = () => {
  const { setIsAuthenticated } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(containerRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
    
    tl.fromTo(formRef.current, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@tallyprime.com' && password === 'admin123') {
        setIsAuthenticated(true);
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-500/80 via-purple-600/80 to-purple-800/80 bg-[url('/src/assets/bg-1.svg')] bg-cover bg-center bg-no-repeat bg-blend-overlay p-4 xl:p-8"
    >
      <div className="flex items-center justify-center w-full max-w-7xl mx-auto px-4 xl:px-8">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 items-center justify-center">
          <div className="relative">
            <div className="w-80 h-80 xl:w-96 xl:h-96 2xl:w-[450px] 2xl:h-[450px] flex items-center justify-center">
              <div className="w-64 h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 bg-white/20 rounded-3xl backdrop-blur-sm flex items-center justify-center shadow-2xl">
                <div className="text-white/80 text-center">
                  <div className="w-16 h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 mx-auto mb-4 xl:mb-6 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Database className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" />
                  </div>
                  <p className="text-lg xl:text-xl 2xl:text-2xl font-semibold">Tally Prime Admin</p>
                  <p className="text-sm xl:text-base 2xl:text-lg opacity-80">Secure Admin Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 max-w-md xl:max-w-lg 2xl:max-w-xl mx-auto">
          <div 
            ref={formRef}
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 xl:p-10 2xl:p-12 border border-white/20 space-y-6 xl:space-y-8"
          >
          {/* Header */}
          <div className="text-center mb-6 xl:mb-8">
            <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-2 xl:mb-3">Tally Prime Admin</h2>
            <p className="text-white/80 text-sm xl:text-base 2xl:text-lg">Sign in to your admin dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6 xl:space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 xl:px-6 xl:py-4 rounded-xl text-sm xl:text-base">
                {error}
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 xl:left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 xl:w-6 xl:h-6" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 xl:pl-12 pr-4 xl:pr-6 py-3 xl:py-4 2xl:py-5 border-2 border-white/30 rounded-xl xl:rounded-2xl placeholder-white/70 text-white text-base xl:text-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 bg-white/10 backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 xl:left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 xl:w-6 xl:h-6" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 xl:pl-12 pr-12 xl:pr-14 py-3 xl:py-4 2xl:py-5 border-2 border-white/30 rounded-xl xl:rounded-2xl placeholder-white/70 text-white text-base xl:text-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 bg-white/10 backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 xl:right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 xl:w-6 xl:h-6" /> : <Eye className="w-5 h-5 xl:w-6 xl:h-6" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                title='Remember Password'
                type="checkbox"
                className="h-4 w-4 xl:h-5 xl:w-5 text-white focus:ring-white/50 border-white/30 rounded bg-white/10"
              />
              <label className="ml-3 text-sm xl:text-base text-white font-medium">
                Remember Password
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 xl:py-4 2xl:py-5 px-4 xl:px-6 border border-transparent rounded-xl xl:rounded-2xl shadow-lg text-base xl:text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 xl:h-6 xl:w-6 text-white">
                    <svg className="h-5 w-5 xl:h-6 xl:w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-white/10 rounded-xl xl:rounded-2xl p-4 xl:p-6 text-center border border-white/20">
            <p className="text-xs xl:text-sm text-white/80 mb-2 font-medium">Demo Credentials:</p>
            <p className="text-xs xl:text-sm text-white">Email: admin@tallyprime.com</p>
            <p className="text-xs xl:text-sm text-white">Password: admin123</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;