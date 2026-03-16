INSERT INTO storage.buckets (id, name, public)
VALUES ('past-highlights', 'past-highlights', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view past highlight images" ON storage.objects;
CREATE POLICY "Public can view past highlight images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'past-highlights');

DROP POLICY IF EXISTS "Authenticated users can upload past highlight images" ON storage.objects;
CREATE POLICY "Authenticated users can upload past highlight images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'past-highlights');

DROP POLICY IF EXISTS "Authenticated users can update past highlight images" ON storage.objects;
CREATE POLICY "Authenticated users can update past highlight images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'past-highlights')
WITH CHECK (bucket_id = 'past-highlights');

DROP POLICY IF EXISTS "Authenticated users can delete past highlight images" ON storage.objects;
CREATE POLICY "Authenticated users can delete past highlight images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'past-highlights');
