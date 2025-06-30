-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.audio_streams (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  stream_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  hive_id uuid NOT NULL,
  CONSTRAINT audio_streams_pkey PRIMARY KEY (id),
  CONSTRAINT audio_streams_hive_fk FOREIGN KEY (hive_id) REFERENCES public.hives(id)
);
CREATE TABLE public.camera_streams (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  stream_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  hive_id uuid NOT NULL,
  CONSTRAINT camera_streams_pkey PRIMARY KEY (id),
  CONSTRAINT camera_streams_hive_fk FOREIGN KEY (hive_id) REFERENCES public.hives(id)
);
CREATE TABLE public.hives (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  code text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT hives_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sensor_data (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  hive_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  temperature numeric,
  humidity numeric,
  weight numeric,
  CONSTRAINT sensor_data_pkey PRIMARY KEY (id),
  CONSTRAINT sensor_data_hive_id_fkey FOREIGN KEY (hive_id) REFERENCES public.hives(id)
);
CREATE TABLE public.user_hives (
  user_id uuid NOT NULL,
  hive_id uuid NOT NULL,
  connected_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_hives_pkey PRIMARY KEY (user_id, hive_id),
  CONSTRAINT user_hives_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_hives_hive_id_fkey FOREIGN KEY (hive_id) REFERENCES public.hives(id)
);