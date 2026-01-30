import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface SubmissionCardProps {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  locationCity?: string | null;
  locationState?: string | null;
  createdAt: string;
  onClick: () => void;
}

export function SubmissionCard({
  name,
  description,
  photoUrl,
  locationCity,
  locationState,
  createdAt,
  onClick,
}: SubmissionCardProps) {
  const locationText = [locationCity, locationState].filter(Boolean).join(", ");

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-lg truncate">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
          {locationText && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {locationText}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(createdAt), "MMM d, yyyy")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
