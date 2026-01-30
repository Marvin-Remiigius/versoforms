import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Navigation } from "lucide-react";
import { format } from "date-fns";

interface Submission {
  id: string;
  name: string;
  description: string;
  photo_url: string;
  location_city?: string | null;
  location_state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
}

interface SubmissionDetailProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmissionDetail({
  submission,
  open,
  onOpenChange,
}: SubmissionDetailProps) {
  if (!submission) return null;

  const locationText = [submission.location_city, submission.location_state]
    .filter(Boolean)
    .join(", ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{submission.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Photo */}
          <div className="rounded-lg overflow-hidden bg-muted">
            <img
              src={submission.photo_url}
              alt={submission.name}
              className="w-full max-h-[400px] object-contain"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
            <p className="text-foreground whitespace-pre-wrap">
              {submission.description}
            </p>
          </div>

          {/* Location Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Location</h4>
            <div className="flex flex-wrap gap-2">
              {locationText && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {locationText}
                </Badge>
              )}
              {submission.latitude && submission.longitude && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  {submission.latitude.toFixed(6)}, {submission.longitude.toFixed(6)}
                </Badge>
              )}
              {!locationText && !submission.latitude && (
                <span className="text-sm text-muted-foreground">No location provided</span>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Submitted on {format(new Date(submission.created_at), "MMMM d, yyyy 'at' h:mm a")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
