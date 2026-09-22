import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Link as LinkIcon, BarChart3, QrCode, Palette, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-primary-500 selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">SmartLink Hub</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:text-primary-600 transition-colors">Log in</Link>
                <Link to="/register">
                  <Button>Sign Up Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-medium border border-primary-100 dark:border-primary-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            SmartLink Hub 2.0 is Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            One link to rule <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">your entire digital life.</span>
          </h1>
          
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Create a beautiful, highly-converting portfolio and link-in-bio page in seconds. Track analytics, generate QR codes, and share your brand with the world.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to={user ? "/dashboard" : "/register"}>
              <Button className="w-full sm:w-auto px-8 py-4 text-lg rounded-2xl gap-2 shadow-lg shadow-primary-500/25">
                Get Started for Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">No credit card required.</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to grow</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              SmartLink Hub provides enterprise-grade tools wrapped in a beautiful, easy-to-use interface.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Palette className="w-6 h-6 text-pink-500" />}
              title="Beautiful Themes"
              desc="Choose from a variety of professionally designed themes. Developer, Creator, Corporate, or Student—there's a style for everyone."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-primary-500" />}
              title="Deep Analytics"
              desc="Track clicks, views, and QR scans in real-time. Understand where your audience is coming from and what they click the most."
            />
            <FeatureCard 
              icon={<QrCode className="w-6 h-6 text-purple-500" />}
              title="QR Center"
              desc="Generate high-resolution QR codes instantly. Print them on business cards or share them digitally to boost your connections."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800 text-center">
        <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center gap-2">
          <LinkIcon className="w-4 h-4" /> SmartLink Hub &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
