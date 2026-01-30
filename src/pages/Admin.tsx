import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SubmissionCard } from "@/components/SubmissionCard";
import { SubmissionDetail } from "@/components/SubmissionDetail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Search, RefreshCw, Inbox, LogOut } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  description: string;
  photo_url: string;
  location_city: string | null;
  location_state: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export default function Admin() {
  const { signOut, user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
      setFilteredSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubmissions(submissions);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredSubmissions(
        submissions.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query) ||
            s.location_city?.toLowerCase().includes(query) ||
            s.location_state?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, submissions]);

  const handleCardClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Form
                </Button>
              </Link>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <h1 className="text-xl font-bold hidden sm:block">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchSubmissions}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredSubmissions.length === 0 && (
          <div className="text-center py-16">
            <Inbox className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {searchQuery ? "No matching submissions" : "No submissions yet"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search query"
                : "Submissions will appear here once users submit their entries"}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            )}
          </div>
        )}

        {/* Submissions Grid */}
        {!isLoading && filteredSubmissions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubmissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                id={submission.id}
                name={submission.name}
                description={submission.description}
                photoUrl={submission.photo_url}
                locationCity={submission.location_city}
                locationState={submission.location_state}
                createdAt={submission.created_at}
                onClick={() => handleCardClick(submission)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <SubmissionDetail
        submission={selectedSubmission}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
