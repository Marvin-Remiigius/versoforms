-- Create submissions table
CREATE TABLE public.submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    location_city TEXT,
    location_state TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert submissions (public form)
CREATE POLICY "Anyone can create submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view submissions (for admin dashboard - we'll add auth later if needed)
CREATE POLICY "Anyone can view submissions" 
ON public.submissions 
FOR SELECT 
USING (true);

-- Create storage bucket for submission photos
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', true);

-- Allow anyone to upload to submissions bucket
CREATE POLICY "Anyone can upload submission photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'submissions');

-- Allow anyone to view submission photos
CREATE POLICY "Anyone can view submission photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'submissions');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();