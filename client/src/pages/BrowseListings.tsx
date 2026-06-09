import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { MapPin, Bed, Bath, DollarSign, Send, Lock } from "lucide-react";

export default function BrowseListings() {
  const { user } = useAuth();
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const { data: listings } = trpc.listings.list.useQuery();
  const { data: subscription } = trpc.renter.subscription.get.useQuery();
  const createApplication = trpc.renter.applications.create.useMutation();

  const handleApply = async (listingId: number, landlordId: number) => {
    if (!subscription || subscription.status !== 'active') {
      alert("Please upgrade your subscription to apply");
      return;
    }

    try {
      await createApplication.mutateAsync({
        listingId,
        landlordId,
      });
      alert("Application sent successfully!");
      setSelectedListing(null);
    } catch (error) {
      alert("Error sending application");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Listings</h1>
          <p className="text-slate-600">Find your perfect rental home</p>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="City or neighborhood" />
            <Input placeholder="Min rent" type="number" />
            <Input placeholder="Max rent" type="number" />
          </div>
        </Card>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {listings && listings.length > 0 ? (
            listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image Placeholder */}
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-48 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-blue-600" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{listing.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{listing.description}</p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.city}, {listing.state} {listing.zipCode}</span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-y border-slate-200">
                    {listing.bedrooms && (
                      <div className="text-center">
                        <Bed className="w-4 h-4 mx-auto mb-1 text-slate-600" />
                        <p className="text-sm font-semibold text-slate-900">{listing.bedrooms}</p>
                        <p className="text-xs text-slate-600">Beds</p>
                      </div>
                    )}
                    {listing.bathrooms && (
                      <div className="text-center">
                        <Bath className="w-4 h-4 mx-auto mb-1 text-slate-600" />
                        <p className="text-sm font-semibold text-slate-900">{listing.bathrooms}</p>
                        <p className="text-xs text-slate-600">Baths</p>
                      </div>
                    )}
                    {listing.squareFeet && (
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-900">{listing.squareFeet}</p>
                        <p className="text-xs text-slate-600">Sq Ft</p>
                      </div>
                    )}
                  </div>

                  {/* Rent */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-slate-600">Monthly Rent</p>
                      <p className="text-2xl font-bold text-slate-900">${listing.rentAmount}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600 opacity-20" />
                  </div>

                  {/* Apply Button */}
                  {subscription?.status === 'active' ? (
                    <Button
                      onClick={() => handleApply(listing.id, listing.landlordId)}
                      disabled={createApplication.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Upgrade to Apply
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600">No listings available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
