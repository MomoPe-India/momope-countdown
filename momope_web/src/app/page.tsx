
import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#131B26]">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-white">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-green-100 text-[#2CB78A] text-sm font-bold mb-8 shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Payments 2.0 is Live
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight text-[#131B26]">
                The <span className="text-gradient">Future</span> of <br className="hidden md:block" />
                Merchant Payments
              </h1>

              <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-xl mx-auto md:mx-0 font-medium">
                Accept payments with <span className="text-[#131B26] font-bold">0% hidden fees</span>. Turn your commission into real customer loyalty with our revolutionary Momo Coins.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="group relative bg-[#131B26] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="flex items-center gap-2">
                    Download for Android
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="bg-white/50 backdrop-blur-sm text-[#131B26] border border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:border-[#2CB78A] hover:text-[#2CB78A] transition-all shadow-sm hover:shadow-lg">
                  View Live Demo
                </button>
              </div>

              <div className="mt-12 flex items-center justify-center md:justify-start gap-8 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-green-100/50">
                    <Shield size={16} className="text-[#2CB78A]" />
                  </div>
                  <span>RBI Compliant</span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-blue-100/50">
                    <CheckCircle size={16} className="text-blue-500" />
                  </div>
                  <span>100% Secure via Razorpay</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 w-full relative perspective-1000">
              {/* Glass Card Container */}
              <div className="relative z-10 mx-auto w-[320px] h-[640px] bg-[#131B26] rounded-[48px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-[8px] border-[#2a303c] overflow-hidden transform hover:rotate-y-6 hover:rotate-x-6 transition-all duration-500 ease-out preserve-3d">
                <div className="w-full h-full bg-[#0F172A] relative">
                  {/* Screen Content Refined */}
                  <div className="absolute top-0 w-full h-full bg-gradient-to-b from-gray-900 to-black opacity-90" />
                  {/* Status Bar */}
                  <div className="absolute top-0 w-full h-8 flex justify-between px-6 items-center pt-2">
                    <span className="text-xs text-white font-medium">9:41</span>
                    <div className="flex gap-1.5">
                      <div className="w-4 h-2.5 bg-white rounded-sm"></div>
                      <div className="w-3 h-2.5 bg-white rounded-sm opacity-50"></div>
                    </div>
                  </div>
                  {/* App Content */}
                  <div className="relative z-20 p-6 pt-12">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-white text-xl font-bold">Hello, Mohan</h3>
                        <p className="text-emerald-400 text-xs font-medium tracking-wide uppercase">Priority Merchant</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 p-0.5">
                        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xs">M</div>
                      </div>
                    </div>

                    {/* Balance Card - Glossy */}
                    <div className="glass-dark rounded-3xl p-6 mb-8 relative overflow-hidden group">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl group-hover:bg-green-500/30 transition-all duration-500" />
                      <p className="text-gray-400 text-xs font-medium mb-1">Total Balance</p>
                      <h2 className="text-4xl font-bold text-white mb-4">₹12,450.00</h2>
                      <div className="flex gap-3">
                        <button className="flex-1 bg-green-500 hover:bg-green-400 text-black text-xs font-bold py-2.5 rounded-xl transition">Withdraw</button>
                        <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-xl transition">History</button>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="space-y-4">
                      <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Recent Activity</h4>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                              <ArrowRight size={14} className="-rotate-45" />
                            </div>
                            <div>
                              <p className="text-white text-sm font-bold">Received</p>
                              <p className="text-gray-500 text-xs">UPI • 2 min ago</p>
                            </div>
                          </div>
                          <p className="text-green-400 font-bold text-sm">+₹450</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements behind phone */}
              <div className="absolute top-20 -right-10 glass p-4 rounded-2xl animate-float hidden md:block z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-2xl">🎉</div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">You earned coins!</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Businesses choose MomoPe</h2>
            <p className="text-gray-500">We don't just process payments. We help you grow your customer base.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Settlements",
                desc: "Get your money when you need it. Flexible payout options tailored for your cash flow.",
                icon: "🚀"
              },
              {
                title: "Customer Loyalty",
                desc: "Every transaction earns your customers Momo Coins, bringing them back to your store.",
                icon: "💎"
              },
              {
                title: "Bank-Grade Security",
                desc: "PCI-DSS compliant infrastructure powered by Razorpay. Your money is always safe.",
                icon: "🔒"
              }
            ].map((f, i) => (
              <div key={i} className="glass p-8 rounded-3xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Merchants Section */}
      <section id="merchants" className="py-32 relative overflow-hidden">
        <div className="absolute top-40 -left-64 w-[600px] h-[600px] bg-[#2CB78A]/5 rounded-full blur-3xl -z-10" />
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2CB78A]/20 to-blue-500/20 rounded-[40px] transform rotate-3 blur-md" />
              <div className="glass p-8 rounded-[40px] relative z-10 overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Zap size={100} />
                </div>
                <img
                  src="/artifacts/merchant_app_dashboard.webp"
                  alt="MomoPe Merchant Dashboard"
                  className="w-full rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-widest mb-6 uppercase">
                FOR MERCHANTS
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-[#131B26] leading-tight">
                Scale Your Revenue with <span className="text-gradient">Intelligent Pricing</span>
              </h2>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed font-light">
                Break free from hidden charges. Our transparent commission model ensures you only pay when you succeed.
                <strong className="text-gray-900 block mt-4">Zero Setup Fees. Zero Maintenance. 100% Transparency.</strong>
              </p>

              <div className="space-y-6">
                {[
                  { title: "Dynamic Settlements", desc: "Capitalize on flexible payout schedules aligned with your business hours." },
                  { title: "Loyalty Engine", desc: "Momo Coins turn one-time shoppers into lifetime patrons automatically." },
                  { title: "Growth Analytics", desc: "Real-time insights to track revenue, customer retention, and peak hours." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mt-1 group-hover:border-[#2CB78A] transition-colors">
                      <CheckCircle size={20} className="text-[#2CB78A]" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1 text-lg group-hover:text-[#2CB78A] transition-colors">{item.title}</div>
                      <div className="text-gray-500 leading-normal">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-4">
                <button className="bg-[#2CB78A] text-white px-8 py-4 rounded-full font-bold hover:bg-[#249671] transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2">
                  Start Accepting Payments
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Customers Section */}
      <section id="customers" className="py-32 relative bg-[#131B26] overflow-hidden">
        {/* Dark Mode Gradient Mesh */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-40">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/50 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2CB78A]/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-purple-300 text-xs font-bold tracking-widest mb-6">
                FOR CUSTOMERS
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-white leading-tight">
                Every Payment is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Winning Moment</span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">
                Why just pay when you can earn? Experience the thrill of instant rewards with Momo Coins.
                Redeem for real cash, exclusive deals, and premium experiences.
              </p>

              <div className="glass-dark p-8 rounded-3xl mb-10 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2CB78A] to-[#249671] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-green-900/50">
                    💰
                  </div>
                  <div>
                    <div className="font-bold text-white text-xl">Accelerated Earnings</div>
                    <div className="text-gray-400 mt-1">Spend ₹100 → Get <span className="text-[#2CB78A] font-bold">50 Coins</span></div>
                  </div>
                </div>
                <div className="relative pt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider">
                    <span>Progress to Gold Tier</span>
                    <span>75%</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full w-3/4 bg-gradient-to-r from-[#2CB78A] to-[#249671] rounded-full shadow-[0_0_15px_rgba(44,183,138,0.5)]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: "Avg Cashback", val: "5%", sub: "Instant Credit" },
                  { label: "Merchants", val: "10K+", sub: "Pan India" },
                  { label: "User Savings", val: "₹5Cr+", sub: "Total Value" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl text-center border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="text-2xl font-bold text-white mb-1">{stat.val}</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-first md:order-last md:pl-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl rounded-full" />
                <img
                  src="/artifacts/customer_app_coins.webp"
                  alt="Momo Coins Rewards Interface"
                  className="relative w-full rounded-[2.5rem] shadow-2xl border-4 border-white/10 transform hover:scale-[1.02] hover:rotate-1 transition-all duration-500"
                />

                {/* Floating 3D Element */}
                <div className="absolute -bottom-10 -left-10 glass-dark p-6 rounded-3xl animate-float animation-delay-2000 hidden md:block border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center text-2xl">⚡</div>
                    <div>
                      <p className="font-bold text-white">Super Fast!</p>
                      <p className="text-xs text-gray-400">Claims processed in 2s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
