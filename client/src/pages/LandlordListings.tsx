import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";


export default function LandlordListings() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    rentAmount: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
  });

  const { data: listings, refetch } = trpc.landlord.listings.list.useQuery();
  const createListing = trpc.landlord.listings.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createListing.mutateAsync({
        title: formData.title,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        rentAmount: formData.rentAmount,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms,
        squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : undefined,
      } as any);
      setFormData({
        title: "",
        description: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        rentAmount: "",
        bedrooms: "",
        bathrooms: "",
        squareFeet: "",
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Listings</h1>
            <p className="text-slate-600">Manage your rental properties</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Listing
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Listing</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-slate-900">Property Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Beautiful 2BR Apartment"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rent" className="text-sm font-medium text-slate-900">Monthly Rent</Label>
                  <Input
                    id="rent"
                    type="number"
                    placeholder="2500"
                    value={formData.rentAmount}
                    onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-slate-900">Address</Label>
                  <Input
                    id="address"
                    placeholder="Street address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-slate-900">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="state" className="text-sm font-medium text-slate-900">State</Label>
                  <Input
                    id="state"
                    placeholder="TX"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="zip" className="text-sm font-medium text-slate-900">Zip Code</Label>
                  <Input
                    id="zip"
                    placeholder="78701"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="sqft" className="text-sm font-medium text-slate-900">Sq Ft</Label>
                  <Input
                    id="sqft"
                    type="number"
                    placeholder="1200"
                    value={formData.squareFeet}
                    onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="beds" className="text-sm font-medium text-slate-900">Bedrooms</Label>
                  <Input
                    id="beds"
                    type="number"
                    placeholder="2"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="baths" className="text-sm font-medium text-slate-900">Bathrooms</Label>
                  <Input
                    id="baths"
                    type="text"
                    placeholder="1.5"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createListing.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Listing
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Listings Table */}
        <div className="grid gap-6">
          {listings && listings.length > 0 ? (
            listings.map((listing) => (
              <Card key={listing.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{listing.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{listing.address}, {listing.city}, {listing.state} {listing.zipCode}</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
                    <div className="flex gap-6 text-sm">
                      <span className="text-slate-900 font-medium">${listing.rentAmount}/mo</span>
                      {listing.bedrooms && <span className="text-slate-600">{listing.bedrooms} BD</span>}
                      {listing.bathrooms && <span className="text-slate-600">{listing.bathrooms} BA</span>}
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium capitalize">
                        {listing.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="text-slate-600 mb-4">No listings yet</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Listing
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
