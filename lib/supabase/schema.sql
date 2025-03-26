-- Create role enum type
CREATE TYPE user_role AS ENUM ('user', 'seller', 'admin');

-- Create user_roles table to store user roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Extend user_profiles table to include more user information
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create seller_profiles table for additional seller information
CREATE TABLE IF NOT EXISTS public.seller_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  company_name TEXT,
  company_description TEXT,
  company_logo TEXT,
  verified BOOLEAN DEFAULT false,
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  total_sales DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_profiles
  INSERT INTO public.user_profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  -- Insert into user_roles with default 'user' role
  INSERT INTO public.user_roles (id, role)
  VALUES (new.id, 'user');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Only admins can update user roles"
  ON public.user_roles FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for user_profiles
CREATE POLICY "Users can view any user profile"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for seller_profiles
CREATE POLICY "Anyone can view seller profiles"
  ON public.seller_profiles FOR SELECT
  USING (true);

CREATE POLICY "Sellers can update their own profile"
  ON public.seller_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Only admins can verify sellers"
  ON public.seller_profiles FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (auth.uid() != id); -- Admins can only update other sellers' verification status

-- Functions to check user roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE id = auth.uid() AND role = 'seller'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upgrade a user to seller
CREATE OR REPLACE FUNCTION public.upgrade_to_seller(user_id UUID, company TEXT)
RETURNS VOID AS $$
BEGIN
  -- Update user role
  UPDATE public.user_roles
  SET role = 'seller', updated_at = now()
  WHERE id = user_id;

  -- Create seller profile
  INSERT INTO public.seller_profiles (id, company_name, created_at, updated_at)
  VALUES (user_id, company, now(), now())
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to make a user an admin (can only be done by existing admins)
CREATE OR REPLACE FUNCTION public.make_admin(user_id UUID)
RETURNS VOID AS $$
BEGIN
  IF public.is_admin() THEN
    UPDATE public.user_roles
    SET role = 'admin', updated_at = now()
    WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Only admins can make other users admins';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
