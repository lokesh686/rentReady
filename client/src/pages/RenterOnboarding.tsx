import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, ChevronRight, Upload } from "lucide-react";
import { useLocation } from "wouter";

export default function RenterOnboarding() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    dateOfBirth: "",
    ssn: "",
    annualIncome: "",
    incomeSource: "",
    employer: "",
    jobTitle: "",
    employmentStatus: "employed" as const,
  });

  const updateProfile = trpc.renter.profile.update.useMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Submit final step
      try {
        await updateProfile.mutateAsync({
          ...formData,
          profileComplete: true,
        });
        navigate("/renter/dashboard");
      } catch (error) {
        console.error("Error completing profile:", error);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const steps = [
    {
      title: "Personal Information",
      description: "Let's start with your basic details",
      fields: ["phoneNumber", "dateOfBirth", "ssn"],
    },
    {
      title: "Income Details",
      description: "Tell us about your income",
      fields: ["annualIncome", "incomeSource"],
    },
    {
      title: "Employment",
      description: "Share your employment information",
      fields: ["employer", "jobTitle", "employmentStatus"],
    },
    {
      title: "Upload Documents",
      description: "Upload your ID and income verification",
      fields: [],
    },
    {
      title: "References",
      description: "Add personal references",
      fields: [],
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  idx + 1 <= step 
                    ? "bg-blue-600 text-white" 
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {idx + 1 < step ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${idx + 1 < step ? "bg-blue-600" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{currentStep.title}</h1>
            <p className="text-slate-600">{currentStep.description}</p>
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8 mb-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-slate-900">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="dob" className="text-sm font-medium text-slate-900">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="ssn" className="text-sm font-medium text-slate-900">Social Security Number</Label>
                <Input
                  id="ssn"
                  type="password"
                  placeholder="XXX-XX-XXXX"
                  value={formData.ssn}
                  onChange={(e) => handleInputChange("ssn", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="income" className="text-sm font-medium text-slate-900">Annual Income</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="75000"
                  value={formData.annualIncome}
                  onChange={(e) => handleInputChange("annualIncome", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="source" className="text-sm font-medium text-slate-900">Income Source</Label>
                <Input
                  id="source"
                  placeholder="e.g., W-2 Employment, Self-Employment"
                  value={formData.incomeSource}
                  onChange={(e) => handleInputChange("incomeSource", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="employer" className="text-sm font-medium text-slate-900">Employer</Label>
                <Input
                  id="employer"
                  placeholder="Company name"
                  value={formData.employer}
                  onChange={(e) => handleInputChange("employer", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-slate-900">Job Title</Label>
                <Input
                  id="title"
                  placeholder="Your position"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-slate-900">Employment Status</Label>
                <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange("employmentStatus", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="font-medium text-slate-900 mb-1">Upload ID Document</p>
                <p className="text-sm text-slate-600">Driver's License or Passport</p>
              </div>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="font-medium text-slate-900 mb-1">Upload Income Verification</p>
                <p className="text-sm text-slate-600">Pay stub, tax return, or bank statement</p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-sm text-slate-700">
                  Add up to 3 personal or professional references. Landlords may contact them to verify your rental history.
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg p-6">
                <p className="text-sm font-medium text-slate-900 mb-4">Reference 1 (Optional)</p>
                <div className="space-y-3">
                  <Input placeholder="Name" />
                  <Input placeholder="Phone" type="tel" />
                  <Input placeholder="Relationship" />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={updateProfile.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {step === 5 ? "Complete Profile" : "Next"}
            {step < 5 && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Step Indicator */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Step {step} of {steps.length}
        </p>
      </div>
    </div>
  );
}
