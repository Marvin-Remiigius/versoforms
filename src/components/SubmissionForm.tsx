import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  description: string;
  locationCity: string;
  locationState: string;
  latitude: number | null;
  longitude: number | null;
}

export function SubmissionForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    locationCity: "",
    locationState: "",
    latitude: null,
    longitude: null,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG or PNG image.",
          variant: "destructive",
        });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Please enter your location manually.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));

        // Try to get city/state from reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.address) {
            setFormData((prev) => ({
              ...prev,
              locationCity: data.address.city || data.address.town || data.address.village || "",
              locationState: data.address.state || "",
            }));
          }
        } catch (error) {
          console.log("Reverse geocoding failed, using coordinates only");
        }

        setIsLocating(false);
        toast({
          title: "Location captured",
          description: "Your location has been detected automatically.",
        });
      },
      (error) => {
        setIsLocating(false);
        toast({
          title: "Location access denied",
          description: "Please enter your location manually.",
          variant: "destructive",
        });
      }
    );
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    if (formData.name.length > 100) {
      setErrorMessage("Name must be less than 100 characters");
      return false;
    }
    if (!formData.description.trim()) {
      setErrorMessage("Description is required");
      return false;
    }
    if (formData.description.length > 2000) {
      setErrorMessage("Description must be less than 2000 characters");
      return false;
    }
    if (!photo) {
      setErrorMessage("Photo is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitStatus("idle");

    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    setIsLoading(true);

    try {
      // Upload photo to storage
      const fileExt = photo!.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("submissions")
        .upload(fileName, photo!);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("submissions")
        .getPublicUrl(fileName);

      // Insert submission record
      const { error: insertError } = await supabase.from("submissions").insert({
        name: formData.name.trim(),
        description: formData.description.trim(),
        photo_url: urlData.publicUrl,
        location_city: formData.locationCity.trim() || null,
        location_state: formData.locationState.trim() || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      if (insertError) throw insertError;

      setSubmitStatus("success");
      toast({
        title: "Submission successful!",
        description: "Your entry has been submitted for review.",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        locationCity: "",
        locationState: "",
        latitude: null,
        longitude: null,
      });
      setPhoto(null);
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setErrorMessage(error.message || "Failed to submit. Please try again.");
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Submit Your Entry</CardTitle>
        <CardDescription>
          Fill out the form below to submit your entry for review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              maxLength={100}
              disabled={isLoading}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your submission..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              maxLength={2000}
              disabled={isLoading}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.description.length}/2000
            </p>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photo * (JPG/PNG, max 5MB)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${photoPreview ? "border-primary" : "border-muted-foreground/25 hover:border-primary/50"}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <div className="space-y-3">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-md object-cover"
                  />
                  <p className="text-sm text-muted-foreground">
                    Click to change photo
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Location Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Location</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={getLocation}
                disabled={isLocating || isLoading}
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4 mr-2" />
                )}
                {isLocating ? "Detecting..." : "Detect Location"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm text-muted-foreground">
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={formData.locationCity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, locationCity: e.target.value }))
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm text-muted-foreground">
                  State
                </Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="State"
                  value={formData.locationState}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, locationState: e.target.value }))
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
            {formData.latitude && formData.longitude && (
              <p className="text-xs text-muted-foreground">
                📍 Coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            )}
          </div>

          {/* Error Message */}
          {submitStatus === "error" && errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Success Message */}
          {submitStatus === "success" && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-primary/10 text-primary">
              <CheckCircle className="w-4 h-4" />
              <p className="text-sm">Submission successful! Thank you.</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Entry"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
