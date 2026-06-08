import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { CheckCircle2, Shield, Zap, TrendingUp, Users, FileCheck } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated && user) {
    if (user.role === 'renter') {
      navigate('/renter/dashboard');
    } else if (user.role === 'landlord') {
      navigate('/landlord/dashboard');
    }
    return null;
  }

  const handleRenterClick = () => {
    window.location.href = getLoginUrl();
  };

  const handleLandlordClick = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900">RentReady</div>
          <div className="flex gap-3">
            <button 
              onClick={handleRenterClick}
              className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-md hover:bg-slate-50 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Rental Applications Made Simple
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              RentReady streamlines the rental application process. Renters build verified profiles once, landlords review applications instantly. Trust, transparency, and efficiency in every transaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleRenterClick}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition text-lg"
              >
                I'm a Renter
              </button>
              <button 
                onClick={handleLandlordClick}
                className="px-6 py-3 border border-slate-300 text-slate-900 font-medium rounded-md hover:bg-slate-50 transition text-lg"
              >
                I'm a Landlord
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center">
              <FileCheck className="w-24 h-24 text-blue-600 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Verified Applications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-16 text-center">Why RentReady?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Profiles",
                description: "Renters build comprehensive, verified profiles with ID, income, and employment verification."
              },
              {
                icon: Zap,
                title: "One-Tap Apply",
                description: "Send verified applications to landlords instantly. No repeated paperwork, no delays."
              },
              {
                icon: TrendingUp,
                title: "Smart Screening",
                description: "Landlords review complete applicant packets with simulated credit scores and verification badges."
              },
              {
                icon: Users,
                title: "Renter Community",
                description: "Build your rental reputation. Track application status and landlord responses in real-time."
              },
              {
                icon: CheckCircle2,
                title: "Transparent Process",
                description: "Know exactly where your application stands. Clear communication at every step."
              },
              {
                icon: FileCheck,
                title: "Secure Documents",
                description: "Your sensitive documents are encrypted and stored securely. Only shared with landlords you choose."
              }
            ].map((feature, idx) => (
              <Card key={idx} className="bg-slate-800 border-slate-700 p-8">
                <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold mb-4 text-center text-slate-900">Simple, Transparent Pricing</h2>
        <p className="text-center text-slate-600 mb-16 text-lg">No hidden fees. No surprises.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Renter Pricing */}
          <Card className="border-2 border-slate-200 p-8 hover:border-blue-500 transition-colors">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">For Renters</h3>
            <p className="text-slate-600 mb-8">Unlimited applications with one verified profile</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-slate-900">$49</span>
              <span className="text-slate-600 ml-2">/year</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Verified profile with ID & income verification",
                "Unlimited one-tap applications",
                "Application status tracking",
                "Secure document storage",
                "Employment verification badges"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={handleRenterClick}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </Card>

          {/* Landlord Pricing */}
          <Card className="border-2 border-blue-500 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold">POPULAR</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">For Landlords</h3>
            <p className="text-slate-600 mb-8">Pay only for applications you review</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-slate-900">$10</span>
              <span className="text-slate-600 ml-2">/application</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Review verified renter profiles",
                "Access complete application packets",
                "Approve, reject, or mark pending",
                "Application notes & communication",
                "Billing history & invoices",
                "List unlimited properties"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={handleLandlordClick}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              List Properties
            </button>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Rental Experience?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of renters and landlords using RentReady.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleRenterClick}
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-slate-100 transition text-lg"
            >
              Start as Renter
            </button>
            <button 
              onClick={handleLandlordClick}
              className="px-6 py-3 border-2 border-white text-white font-medium rounded-md hover:bg-blue-700 transition text-lg"
            >
              Start as Landlord
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">RentReady</h4>
              <p className="text-sm">Simplifying rental applications for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            <p>&copy; 2026 RentReady. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
