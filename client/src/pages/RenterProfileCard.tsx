import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, X, AlertCircle, Share2, Download } from "lucide-react";

export default function RenterProfileCard() {
  const { user } = useAuth();
  const { data: profile } = trpc.renter.profile.get.useQuery();

  const getVerificationBadge = (verified: boolean, label: string) => {
    if (verified) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">{label} Verified</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-medium text-yellow-900">{label} Pending</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Verified Profile</h1>
          <p className="text-slate-600">This is what landlords see when you apply</p>
        </div>

        {/* Profile Card */}
        <Card className="p-8 mb-8 border-2 border-slate-200 shadow-lg">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-slate-600">{user?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-2">Profile ID</p>
              <p className="font-mono text-sm font-semibold text-slate-900">{user?.id}</p>
            </div>
          </div>

          {/* Credit Score Section */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-600 mb-3">Simulated Credit Score</p>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-blue-600">{profile?.simulatedCreditScore || 750}</div>
              <div className="text-sm text-slate-600">
                <p className="font-medium text-slate-900">Excellent</p>
                <p>This is a simulated score for demonstration</p>
              </div>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-600 mb-4">Verification Status</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getVerificationBadge(profile?.idVerified || false, "ID")}
              {getVerificationBadge(profile?.incomeVerified || false, "Income")}
              {getVerificationBadge(profile?.employmentVerified || false, "Employment")}
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-600 mb-4">Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Phone</p>
                <p className="text-slate-900 font-medium">{profile?.phoneNumber || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Date of Birth</p>
                <p className="text-slate-900 font-medium">{profile?.dateOfBirth || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Income Information */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-600 mb-4">Income Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Annual Income</p>
                <p className="text-slate-900 font-medium">${profile?.annualIncome || "0"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Income Source</p>
                <p className="text-slate-900 font-medium">{profile?.incomeSource || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-600 mb-4">Employment Information</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Employer</p>
                <p className="text-slate-900 font-medium">{profile?.employer || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Job Title</p>
                <p className="text-slate-900 font-medium">{profile?.jobTitle || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
                <p className="text-slate-900 font-medium capitalize">{profile?.employmentStatus || "Not provided"}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-900">
            <strong>Privacy Note:</strong> Your verified profile is only shared with landlords when you apply to their listings. 
            Sensitive information like your SSN is never displayed—only verification status badges are shown.
          </p>
        </div>
      </div>
    </div>
  );
}
