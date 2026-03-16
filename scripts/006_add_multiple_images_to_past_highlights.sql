ALTER TABLE past_event_highlights
  ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT '{}';

UPDATE past_event_highlights
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL);
