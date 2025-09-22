-- =============================================
-- LOCATION SCHEMA MIGRATION SCRIPT
-- =============================================
-- Run this script if you already have the cities table
-- and need to update it to the new schema

-- Step 1: Drop existing foreign key constraint if it exists
ALTER TABLE public.cities DROP CONSTRAINT IF EXISTS fk_cities_country;

-- Step 2: Add new columns
ALTER TABLE public.cities 
ADD COLUMN IF NOT EXISTS country_code TEXT,
ADD COLUMN IF NOT EXISTS country_name TEXT;

-- Step 3: Update existing data (assuming existing 'country' column contains country names)
UPDATE public.cities 
SET 
  country_name = country,
  country_code = CASE 
    WHEN country = 'India' THEN 'IN'
    WHEN country = 'United States' THEN 'US'
    WHEN country = 'United Kingdom' THEN 'GB'
    WHEN country = 'Australia' THEN 'AU'
    WHEN country = 'Canada' THEN 'CA'
    WHEN country = 'Germany' THEN 'DE'
    WHEN country = 'France' THEN 'FR'
    WHEN country = 'Italy' THEN 'IT'
    WHEN country = 'Spain' THEN 'ES'
    WHEN country = 'Japan' THEN 'JP'
    WHEN country = 'China' THEN 'CN'
    WHEN country = 'Brazil' THEN 'BR'
    WHEN country = 'Mexico' THEN 'MX'
    WHEN country = 'Russia' THEN 'RU'
    WHEN country = 'South Africa' THEN 'ZA'
    ELSE 'IN' -- Default to India
  END
WHERE country_code IS NULL;

-- Step 4: Make new columns NOT NULL
ALTER TABLE public.cities 
ALTER COLUMN country_code SET NOT NULL,
ALTER COLUMN country_name SET NOT NULL;

-- Step 5: Add foreign key constraint
ALTER TABLE public.cities ADD CONSTRAINT fk_cities_country 
  FOREIGN KEY (country_code) REFERENCES public.countries(code);

-- Step 6: Update indexes
DROP INDEX IF EXISTS idx_cities_country;
CREATE INDEX idx_cities_country_code ON public.cities(country_code);
CREATE INDEX idx_cities_country_name ON public.cities(country_name);

-- Step 7: Update search function
CREATE OR REPLACE FUNCTION public.search_cities(
  search_query TEXT,
  country_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  country TEXT,
  state TEXT,
  coordinates JSONB,
  population INTEGER,
  is_popular BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.country_name as country,
    c.state,
    c.coordinates,
    c.population,
    c.is_popular
  FROM public.cities c
  WHERE 
    c.is_active = true
    AND (
      search_query IS NULL 
      OR c.name ILIKE '%' || search_query || '%'
      OR c.state ILIKE '%' || search_query || '%'
      OR to_tsvector('english', c.name || ' ' || COALESCE(c.state, '') || ' ' || c.country_name) 
         @@ plainto_tsquery('english', search_query)
    )
    AND (country_filter IS NULL OR c.country_name = country_filter OR c.country_code = country_filter)
  ORDER BY 
    c.is_popular DESC,
    c.population DESC NULLS LAST,
    c.name ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Update popular cities function
CREATE OR REPLACE FUNCTION public.get_popular_cities(
  country_filter TEXT DEFAULT 'India',
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  country TEXT,
  state TEXT,
  coordinates JSONB,
  population INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.country_name as country,
    c.state,
    c.coordinates,
    c.population
  FROM public.cities c
  WHERE 
    c.is_active = true
    AND c.is_popular = true
    AND (c.country_name = country_filter OR c.country_code = country_filter)
  ORDER BY 
    c.population DESC NULLS LAST,
    c.name ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Update full-text search index
DROP INDEX IF EXISTS idx_cities_search;
CREATE INDEX idx_cities_search ON public.cities USING gin(to_tsvector('english', name || ' ' || COALESCE(state, '') || ' ' || country_name));

-- Step 10: Optional - Drop old country column if you want to clean up
-- ALTER TABLE public.cities DROP COLUMN IF EXISTS country;

-- Migration complete!
-- Your location system is now ready to use with the new schema.

