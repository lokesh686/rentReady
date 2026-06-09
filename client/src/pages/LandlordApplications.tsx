import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, X, Clock, Eye, FileText } from "lucide-react";

export default function LandlordApplications() {
  const { user } = useAuth();
  const [selectedApp, setSelectedApp] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const { data: applications, refetch } = trpc.landlord.applications.list.useQuery();
  const updateStatus = trpc.landlord.applications.updateStatus.useMutation();

  const handleStatusUpdate = async (appId: number, status: "approve" | "reject" | "pending") => {
    try {
      await updateStatus.mutateAsync({
        id: appId,
        status,
        notes,
      });
      setSelectedApp(null);
      setNotes("");
      refetch();
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const getStatusBadge = (status: string | undefined | null) => {
    switch (status) {
      case "approve":
        return <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"><CheckCircle2 className="w-4 h-4" /> Approved</div>;
      case "reject":
        return <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"><X className="w-4 h-4" /> Rejected</div>;
      default:
        return <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"><Clock className="w-4 h-4" /> Pending</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Applications</h1>
          <p className="text-slate-600">Review and manage renter applications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">All Applications</h2>
              <div className="space-y-3">
                {applications && applications.length > 0 ? (
                  applications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app.id as number)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedApp === app.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-slate-900">App #{app.id}</p>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-sm text-slate-600">Listing {app.listingId}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-slate-600 text-center py-8">No applications yet</p>
                )}
              </div>
            </Card>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-2">
            {selectedApp && applications ? (
              (() => {
                const app = applications.find(a => a.id === (selectedApp as number));
                return app ? (
                  <Card className="p-8">
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">Application #{app.id}</h2>
                          <p className="text-slate-600">Listing {app.listingId}</p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>

                      {/* Renter Profile Summary */}
                      <div className="mb-8 pb-8 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Renter Profile</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Credit Score</p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">750</p>
                            <p className="text-sm text-slate-600">Simulated Score</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Annual Income</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">$75,000</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Employment</p>
                            <p className="text-slate-900 font-medium mt-1">Employed</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Employer</p>
                            <p className="text-slate-900 font-medium mt-1">Tech Corp</p>
                          </div>
                        </div>
                      </div>

                      {/* Verification Badges */}
                      <div className="mb-8 pb-8 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Verification Status</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">ID Verified</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Income Verified</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Employment Verified</span>
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Documents</h3>
                        <div className="space-y-3">
                          <button className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div className="text-left">
                              <p className="font-medium text-slate-900">ID Document</p>
                              <p className="text-sm text-slate-600">Driver's License</p>
                            </div>
                          </button>
                          <button className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div className="text-left">
                              <p className="font-medium text-slate-900">Income Verification</p>
                              <p className="text-sm text-slate-600">Pay Stub</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mb-8">
                        <label className="text-sm font-medium text-slate-900 block mb-2">Your Notes</label>
                        <Textarea
                          placeholder="Add notes about this application..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={4}
                          className="border border-slate-300 rounded-lg p-3"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleStatusUpdate(app.id, "approve")}
                          disabled={updateStatus.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(app.id, "pending")}
                          disabled={updateStatus.isPending}
                          variant="outline"
                          className="flex-1"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Mark Pending
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(app.id, "reject")}
                          disabled={updateStatus.isPending}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : null;
              })()
            ) : (
              <Card className="p-12 text-center">
                <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Select an application to view details</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
