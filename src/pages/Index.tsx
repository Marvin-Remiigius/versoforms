import { Link } from "react-router-dom";
import { SubmissionForm } from "@/components/SubmissionForm";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="SubmitFlow" className="w-8 h-8 rounded-lg" />
            <span className="font-semibold text-lg">VersoForms</span>
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Admin Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Submit Your Entry</h1>
          <p className="text-muted-foreground">
            Fill out the form below to submit your entry. All submissions will be reviewed by our team.
          </p>
        </div>
        
        <SubmissionForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} VersoForms. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
