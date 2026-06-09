import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, AlertCircle, CreditCard } from "lucide-react";

export default function RenterSubscription() {
  const { user } = useAuth();
  const { data: subscription } = trpc.renter.subscription.get.useQuery();
  const createCheckout = trpc.renter.subscription.createCheckout.useMutation();

  const handleUpgrade = async () => {
    try {
      const result = await createCheckout.mutateAsync();
      if (result && result.clientSecret) {
        // In production, redirect to Stripe checkout
        alert("Stripe checkout would open here. Client Secret: " + result.clientSecret);
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Subscription</h1>
          <p className="text-slate-600">Manage your RentReady subscription</p>
        </div>

        {/* Current Status */}
        {subscription && subscription.status === 'active' ? (
          <Card className="p-8 mb-8 border-l-4 border-l-green-600">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Premium Plan Active</h2>
                </div>
                <p className="text-slate-600 mb-4">You have unlimited access to all RentReady features.</p>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600"><strong>Renewal Date:</strong> {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}</p>
                  <p className="text-sm text-slate-600"><strong>Amount:</strong> $49.00 per year</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-green-600">$49</p>
                <p className="text-slate-600">/year</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 mb-8 border-l-4 border-l-yellow-600">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Free Plan</h2>
                </div>
                <p className="text-slate-600 mb-4">Upgrade to Premium to unlock unlimited applications and verified profile features.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Features Comparison */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Free Plan</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  View listings
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  Browse landlords
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  <span className="line-through">Create verified profile</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  <span className="line-through">Apply to listings</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  <span className="line-through">Track applications</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Premium Plan - $49/year</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-900">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Everything in Free
                </li>
                <li className="flex items-center gap-3 text-slate-900">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Create verified profile
                </li>
                <li className="flex items-center gap-3 text-slate-900">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Unlimited applications
                </li>
                <li className="flex items-center gap-3 text-slate-900">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Track application status
                </li>
                <li className="flex items-center gap-3 text-slate-900">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Share profile with landlords
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        {subscription?.status !== 'active' && (
          <Card className="p-8 bg-blue-50 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to apply to rentals?</h3>
                <p className="text-slate-600">Upgrade to Premium for just $49/year</p>
              </div>
              <Button
                onClick={handleUpgrade}
                disabled={createCheckout.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </Card>
        )}

        {/* Billing Info */}
        <Card className="p-8 mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Billing Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-200">
              <span className="text-slate-600">Payment Method</span>
              <span className="font-medium text-slate-900">Stripe</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-200">
              <span className="text-slate-600">Billing Cycle</span>
              <span className="font-medium text-slate-900">Annual</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-slate-600">Status</span>
              <span className="font-medium text-slate-900 capitalize">{subscription?.status || 'Inactive'}</span>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        <Card className="p-8 mt-8 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-600">Yes, you can cancel your subscription at any time. No questions asked.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Is there a free trial?</h3>
              <p className="text-slate-600">Currently, we offer a free plan with limited features. Upgrade to Premium to unlock full functionality.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-slate-600">We accept all major credit cards through Stripe, including Visa, Mastercard, American Express, and Discover.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
