INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsors', 'sponsors', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view sponsor images" ON storage.objects;
CREATE POLICY "Public can view sponsor images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'sponsors');

DROP POLICY IF EXISTS "Authenticated users can upload sponsor images" ON storage.objects;
CREATE POLICY "Authenticated users can upload sponsor images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sponsors');

DROP POLICY IF EXISTS "Authenticated users can update sponsor images" ON storage.objects;
CREATE POLICY "Authenticated users can update sponsor images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'sponsors')
WITH CHECK (bucket_id = 'sponsors');

DROP POLICY IF EXISTS "Authenticated users can delete sponsor images" ON storage.objects;
CREATE POLICY "Authenticated users can delete sponsor images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'sponsors');
