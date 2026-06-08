import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Home, Users, DollarSign, FileText } from "lucide-react";

export default function LandlordDashboard() {
  const { user } = useAuth();
  const { data: listings } = trpc.landlord.listings.list.useQuery();
  const { data: applications } = trpc.landlord.applications.list.useQuery();
  const { data: transactions } = trpc.landlord.billing.getTransactions.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.name}</h1>
          <p className="text-slate-600">Manage your properties and review renter applications</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Listings</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{listings?.filter(l => l.status === 'active').length || 0}</p>
              </div>
              <Home className="w-10 h-10 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Applications</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{applications?.length || 0}</p>
              </div>
              <Users className="w-10 h-10 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Review</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{applications?.filter(a => a.status === 'pending').length || 0}</p>
              </div>
              <FileText className="w-10 h-10 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  ${(transactions?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create New Listing
            </Button>
            <Button variant="outline">
              View All Applications
            </Button>
            <Button variant="outline">
              Billing & Invoices
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
                  <div>
                    <p className="font-medium text-slate-900">Application #{app.id}</p>
                    <p className="text-sm text-slate-600">Listing {app.listingId}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium capitalize text-slate-700">{app.status}</span>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">No applications yet. Create listings to receive applications!</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
