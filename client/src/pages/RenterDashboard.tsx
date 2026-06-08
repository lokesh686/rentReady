import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Clock, X, FileText, Plus } from "lucide-react";

export default function RenterDashboard() {
  const { user } = useAuth();
  const { data: profile } = trpc.renter.profile.get.useQuery();
  const { data: subscription } = trpc.renter.subscription.get.useQuery();
  const { data: applications } = trpc.renter.applications.list.useQuery();

  const navItems = [
    { label: "Dashboard", href: "/renter/dashboard" },
    { label: "My Profile", href: "/renter/profile" },
    { label: "Applications", href: "/renter/applications" },
    { label: "Browse Listings", href: "/renter/listings" },
    { label: "Subscription", href: "/renter/subscription" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.name}</h1>
          <p className="text-slate-600">Manage your verified profile and rental applications</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Profile Status</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {profile?.profileComplete ? "Complete" : "Incomplete"}
                </p>
              </div>
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Subscription</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {subscription?.status === 'active' ? 'Active' : 'Inactive'}
                </p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Applications</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{applications?.length || 0}</p>
              </div>
              <FileText className="w-10 h-10 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {!profile?.profileComplete && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                Complete Profile
              </Button>
            )}
            {subscription?.status !== 'active' && (
              <Button className="bg-green-600 hover:bg-green-700">
                Upgrade Subscription
              </Button>
            )}
            <Button variant="outline">
              Browse Listings
            </Button>
          </div>
        </Card>

        {/* Recent Applications */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Applications</h2>
          {applications && applications.length > 0 ? (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {app.status === 'approve' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {app.status === 'reject' && <X className="w-5 h-5 text-red-600" />}
                    {app.status === 'pending' && <Clock className="w-5 h-5 text-yellow-600" />}
                    <div>
                      <p className="font-medium text-slate-900">Application #{app.id}</p>
                      <p className="text-sm text-slate-600">Listing {app.listingId}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium capitalize text-slate-700">{app.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">No applications yet. Start by browsing listings!</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
