BEGIN;
CREATE TABLE IF NOT EXISTS rooms (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  max_guests integer NOT NULL CHECK (max_guests BETWEEN 1 AND 12),
  bed_type text NOT NULL,
  view_type text NOT NULL,
  amenities text[] NOT NULL DEFAULT '{}',
  image_name text NOT NULL,
  inventory integer NOT NULL CHECK (inventory >= 0),
  currency char(3) NOT NULL DEFAULT 'USD',
  nightly_rate_cents integer NOT NULL CHECK (nightly_rate_cents >= 0),
  display_order integer NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS bookings (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id text NOT NULL REFERENCES rooms(id),
  check_in date NOT NULL,
  check_out date NOT NULL CHECK (check_out > check_in),
  room_count integer NOT NULL CHECK (room_count > 0)
);
INSERT INTO rooms (id,name,description,max_guests,bed_type,view_type,amenities,image_name,inventory,currency,nightly_rate_cents,display_order) VALUES
('deluxe-garden','Deluxe Garden','King-size bed and private terrace framed by tropical garden views',2,'King-size bed','Tropical garden',ARRAY['Private terrace','Walk-in shower'],'ARKAI_Deluxe_Garden.png',4,'USD',14500,1),
('ocean-view-suite','Ocean View Suite','Panoramic ocean views, a private terrace, lounge area and bathtub',2,'King-size bed','Panoramic ocean',ARRAY['Private terrace','Lounge area','Bathtub'],'ARKAI_Ocean_View_Suite.png',3,'USD',21000,2),
('family-residence','Family Residence','Two bedrooms and a separate living area with garden and pool views',4,'Two bedrooms','Garden and pool',ARRAY['Separate living area','Private terrace'],'ARKAI_Family_Residence.png',2,'USD',32000,3)
ON CONFLICT (id) DO NOTHING;
COMMIT;
