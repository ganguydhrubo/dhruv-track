-- ============================================================
-- Dhruv Track — Database Schema Migration
-- ============================================================
-- Run this in Supabase SQL Editor or via supabase db push
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE division_type AS ENUM ('RETAIL', 'LPG_DISTRIBUTION', 'TRANSPORT', 'OTHER');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'TRANSFERRED', 'EXITED');
CREATE TYPE employment_type AS ENUM ('PERMANENT', 'CONTRACTUAL', 'TEMPORARY', 'TRAINEE');
CREATE TYPE training_category AS ENUM ('SAFETY', 'BEHAVIORAL', 'SOP', 'EMERGENCY', 'DRIVING', 'TANKER', 'RETAIL', 'LPG', 'REFRESHER');
CREATE TYPE training_status AS ENUM ('TRAINED', 'PENDING', 'OVERDUE', 'EXPIRED', 'NOT_REQUIRED');
CREATE TYPE visit_purpose AS ENUM ('SAFETY_INSPECTION', 'TRAINING_VERIFICATION', 'BEHAVIORAL_OBSERVATION', 'FOLLOW_UP', 'AUDIT', 'CORRECTIVE_ACTION_VERIFICATION');
CREATE TYPE visit_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE checklist_result AS ENUM ('PASS', 'FAIL', 'NA');
CREATE TYPE inspection_status AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE observation_category AS ENUM ('UNSAFE_ACT', 'UNSAFE_CONDITION', 'NEAR_MISS', 'GOOD_PRACTICE');
CREATE TYPE severity_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE behavior_result AS ENUM ('OBSERVED', 'NOT_OBSERVED', 'NON_COMPLIANT', 'GOOD_PRACTICE');
CREATE TYPE action_status AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_VERIFICATION', 'CLOSED', 'REOPENED');
CREATE TYPE action_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE action_source_type AS ENUM ('INSPECTION', 'OBSERVATION', 'BEHAVIORAL', 'MANUAL');
CREATE TYPE certificate_status AS ENUM ('VALID', 'EXPIRED', 'REVOKED');
CREATE TYPE vehicle_type AS ENUM ('TANKER', 'TRUCK', 'LPG_DELIVERY', 'OTHER');
CREATE TYPE vehicle_status AS ENUM ('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED');
CREATE TYPE location_type AS ENUM ('RETAIL_OUTLET', 'LPG_DISTRIBUTOR', 'DEPOT', 'TERMINAL', 'OFFICE', 'OTHER');
CREATE TYPE observation_status AS ENUM ('OPEN', 'ACTION_CREATED', 'RESOLVED');
CREATE TYPE notification_type AS ENUM ('TRAINING_OVERDUE', 'CERTIFICATE_EXPIRING', 'CRITICAL_OBSERVATION', 'ACTION_ASSIGNED', 'ACTION_OVERDUE', 'ACTION_PENDING_VERIFICATION', 'VISIT_SCHEDULED', 'GENERAL');
CREATE TYPE audit_action AS ENUM ('LOGIN', 'TRAINING_STATUS_CHANGE', 'FIELD_VISIT', 'INSPECTION', 'OBSERVATION', 'ACTION_CREATED', 'ACTION_ASSIGNED', 'ACTION_UPDATED', 'EVIDENCE_UPLOADED', 'VERIFICATION', 'CLOSURE', 'REOPENED', 'USER_ROLE_CHANGE', 'EMPLOYEE_CREATED', 'EMPLOYEE_UPDATED');

-- ============================================================
-- 1. ORGANIZATIONS
-- ============================================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1e40af',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. ORGANIZATION CONFIG
-- ============================================================
CREATE TABLE organization_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branding JSONB DEFAULT '{}',
  enabled_roles TEXT[] DEFAULT ARRAY['SUPER_ADMIN', 'CLIENT_ADMIN', 'FIELD_OFFICER', 'EMPLOYEE'],
  enabled_divisions division_type[] DEFAULT ARRAY['RETAIL'::division_type],
  notification_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

-- ============================================================
-- 3. DIVISIONS
-- ============================================================
CREATE TABLE divisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type division_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_divisions_org ON divisions(organization_id);

-- ============================================================
-- 4. REGIONS
-- ============================================================
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  division_id UUID NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_regions_org ON regions(organization_id);
CREATE INDEX idx_regions_division ON regions(division_id);

-- ============================================================
-- 5. AREAS
-- ============================================================
CREATE TABLE areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_areas_org ON areas(organization_id);
CREATE INDEX idx_areas_region ON areas(region_id);

-- ============================================================
-- 6. LOCATIONS
-- ============================================================
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  type location_type NOT NULL DEFAULT 'RETAIL_OUTLET',
  qr_code TEXT NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  contact_person TEXT,
  contact_phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_org ON locations(organization_id);
CREATE INDEX idx_locations_area ON locations(area_id);
CREATE UNIQUE INDEX idx_locations_qr ON locations(qr_code);
CREATE UNIQUE INDEX idx_locations_code_org ON locations(organization_id, code);

-- ============================================================
-- 7. ROLES
-- ============================================================
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_roles_org ON roles(organization_id);

-- ============================================================
-- 8. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  avatar_url TEXT,
  division_id UUID REFERENCES divisions(id),
  region_id UUID REFERENCES regions(id),
  area_id UUID REFERENCES areas(id),
  location_id UUID REFERENCES locations(id),
  manager_id UUID REFERENCES profiles(id),
  supervisor_id UUID REFERENCES profiles(id),
  employment_type employment_type DEFAULT 'PERMANENT',
  contractor_id UUID,
  joining_date DATE,
  status user_status DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_profiles_location ON profiles(location_id);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE UNIQUE INDEX idx_profiles_employee_id_org ON profiles(organization_id, employee_id);

-- ============================================================
-- 9. USER ROLES
-- ============================================================
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_org ON user_roles(organization_id);

-- ============================================================
-- 10. CONTRACTORS
-- ============================================================
CREATE TABLE contractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  license_number TEXT,
  license_expiry DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contractors_org ON contractors(organization_id);

-- Add FK to profiles now that contractors exists
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_contractor FOREIGN KEY (contractor_id) REFERENCES contractors(id);

-- ============================================================
-- 11. VEHICLES
-- ============================================================
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  vehicle_number TEXT NOT NULL,
  vehicle_type vehicle_type NOT NULL,
  driver_id UUID REFERENCES profiles(id),
  contractor_id UUID REFERENCES contractors(id),
  fitness_expiry DATE,
  insurance_expiry DATE,
  permit_expiry DATE,
  last_inspection DATE,
  status vehicle_status DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vehicles_org ON vehicles(organization_id);
CREATE UNIQUE INDEX idx_vehicles_number_org ON vehicles(organization_id, vehicle_number);

-- ============================================================
-- 12. TRAINING COURSES
-- ============================================================
CREATE TABLE training_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category training_category NOT NULL,
  description TEXT,
  duration_hours NUMERIC(5,1),
  validity_months INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_courses_org ON training_courses(organization_id);

-- ============================================================
-- 13. TRAINING RECORDS
-- ============================================================
CREATE TABLE training_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES training_courses(id),
  employee_id UUID NOT NULL REFERENCES profiles(id),
  trainer_id UUID REFERENCES profiles(id),
  location_id UUID REFERENCES locations(id),
  training_date DATE NOT NULL,
  attendance BOOLEAN DEFAULT TRUE,
  completion BOOLEAN DEFAULT FALSE,
  score NUMERIC(5,2),
  pass_fail BOOLEAN,
  certificate_url TEXT,
  expiry_date DATE,
  status training_status DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_records_org ON training_records(organization_id);
CREATE INDEX idx_training_records_employee ON training_records(employee_id);
CREATE INDEX idx_training_records_status ON training_records(status);

-- ============================================================
-- 14. CERTIFICATES
-- ============================================================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES profiles(id),
  course_id UUID REFERENCES training_courses(id),
  name TEXT NOT NULL,
  issued_date DATE NOT NULL,
  expiry_date DATE,
  certificate_url TEXT,
  status certificate_status DEFAULT 'VALID',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certificates_org ON certificates(organization_id);
CREATE INDEX idx_certificates_employee ON certificates(employee_id);

-- ============================================================
-- 15. FIELD VISITS
-- ============================================================
CREATE TABLE field_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  officer_id UUID NOT NULL REFERENCES profiles(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  visit_date DATE NOT NULL,
  visit_time TIME,
  purpose visit_purpose NOT NULL,
  gps_latitude DOUBLE PRECISION,
  gps_longitude DOUBLE PRECISION,
  gps_accuracy DOUBLE PRECISION,
  notes TEXT,
  status visit_status DEFAULT 'SCHEDULED',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_field_visits_org ON field_visits(organization_id);
CREATE INDEX idx_field_visits_officer ON field_visits(officer_id);
CREATE INDEX idx_field_visits_location ON field_visits(location_id);
CREATE INDEX idx_field_visits_date ON field_visits(visit_date);
CREATE INDEX idx_field_visits_status ON field_visits(status);

-- ============================================================
-- 16. INSPECTION TEMPLATES
-- ============================================================
CREATE TABLE inspection_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  division_type division_type,
  questions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inspection_templates_org ON inspection_templates(organization_id);

-- ============================================================
-- 17. INSPECTIONS
-- ============================================================
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  visit_id UUID NOT NULL REFERENCES field_visits(id),
  template_id UUID NOT NULL REFERENCES inspection_templates(id),
  inspector_id UUID NOT NULL REFERENCES profiles(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status inspection_status DEFAULT 'IN_PROGRESS',
  overall_result checklist_result,
  pass_count INTEGER DEFAULT 0,
  fail_count INTEGER DEFAULT 0,
  na_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inspections_org ON inspections(organization_id);
CREATE INDEX idx_inspections_visit ON inspections(visit_id);
CREATE INDEX idx_inspections_location ON inspections(location_id);

-- ============================================================
-- 18. INSPECTION RESPONSES
-- ============================================================
CREATE TABLE inspection_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  result checklist_result NOT NULL,
  photo_url TEXT,
  comment TEXT,
  severity severity_level,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inspection_responses_inspection ON inspection_responses(inspection_id);

-- ============================================================
-- 19. SAFETY OBSERVATIONS
-- ============================================================
CREATE TABLE safety_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id),
  observer_id UUID NOT NULL REFERENCES profiles(id),
  person_id UUID REFERENCES profiles(id),
  visit_id UUID REFERENCES field_visits(id),
  category observation_category NOT NULL,
  description TEXT NOT NULL,
  severity severity_level NOT NULL,
  photo_url TEXT,
  gps_latitude DOUBLE PRECISION,
  gps_longitude DOUBLE PRECISION,
  status observation_status DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_safety_observations_org ON safety_observations(organization_id);
CREATE INDEX idx_safety_observations_location ON safety_observations(location_id);
CREATE INDEX idx_safety_observations_severity ON safety_observations(severity);
CREATE INDEX idx_safety_observations_category ON safety_observations(category);

-- ============================================================
-- 20. BEHAVIORAL OBSERVATIONS
-- ============================================================
CREATE TABLE behavioral_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id),
  observer_id UUID NOT NULL REFERENCES profiles(id),
  employee_id UUID NOT NULL REFERENCES profiles(id),
  behavior_type TEXT NOT NULL,
  result behavior_result NOT NULL,
  notes TEXT,
  visit_id UUID REFERENCES field_visits(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_behavioral_observations_org ON behavioral_observations(organization_id);
CREATE INDEX idx_behavioral_observations_employee ON behavioral_observations(employee_id);

-- ============================================================
-- 21. CORRECTIVE ACTIONS
-- ============================================================
CREATE TABLE corrective_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  action_number TEXT NOT NULL,
  source_type action_source_type NOT NULL DEFAULT 'MANUAL',
  source_id UUID,
  location_id UUID NOT NULL REFERENCES locations(id),
  issue TEXT NOT NULL,
  description TEXT,
  responsible_id UUID REFERENCES profiles(id),
  supervisor_id UUID REFERENCES profiles(id),
  priority action_priority DEFAULT 'MEDIUM',
  due_date DATE,
  status action_status DEFAULT 'OPEN',
  verification_notes TEXT,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  reopened_at TIMESTAMPTZ,
  reopen_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_corrective_actions_org ON corrective_actions(organization_id);
CREATE INDEX idx_corrective_actions_location ON corrective_actions(location_id);
CREATE INDEX idx_corrective_actions_responsible ON corrective_actions(responsible_id);
CREATE INDEX idx_corrective_actions_status ON corrective_actions(status);
CREATE INDEX idx_corrective_actions_due ON corrective_actions(due_date);
CREATE UNIQUE INDEX idx_corrective_actions_number_org ON corrective_actions(organization_id, action_number);

-- ============================================================
-- 22. ACTION EVIDENCE
-- ============================================================
CREATE TABLE action_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_id UUID NOT NULL REFERENCES corrective_actions(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_action_evidence_action ON action_evidence(action_id);

-- ============================================================
-- 23. NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL DEFAULT 'GENERAL',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_org ON notifications(organization_id);

-- ============================================================
-- 24. AUDIT LOGS
-- ============================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  action audit_action NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================
-- AUTO-UPDATE TIMESTAMPS TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at'
    AND table_schema = 'public'
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW
       EXECUTE FUNCTION update_updated_at()',
      t, t
    );
  END LOOP;
END;
$$;

-- ============================================================
-- AUTO-GENERATE ACTION NUMBER
-- ============================================================
CREATE OR REPLACE FUNCTION generate_action_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(action_number FROM 'CA-([0-9]+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM corrective_actions
  WHERE organization_id = NEW.organization_id;

  NEW.action_number = 'CA-' || LPAD(next_num::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_corrective_actions_number
BEFORE INSERT ON corrective_actions
FOR EACH ROW
WHEN (NEW.action_number IS NULL OR NEW.action_number = '')
EXECUTE FUNCTION generate_action_number();

-- ============================================================
-- AUTO-GENERATE QR CODE FOR LOCATIONS
-- ============================================================
CREATE OR REPLACE FUNCTION generate_location_qr()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qr_code IS NULL OR NEW.qr_code = '' THEN
    NEW.qr_code = 'dhruvtrack://location/' || NEW.id || '/' || NEW.code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_locations_qr
BEFORE INSERT ON locations
FOR EACH ROW
EXECUTE FUNCTION generate_location_qr();

-- ============================================================
-- HELPER FUNCTION: Get user's organization_id from JWT or profile
-- ============================================================
CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS UUID AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'organization_id')::uuid,
    (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- HELPER FUNCTION: Get user's role
-- ============================================================
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT r.name
  FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- HELPER FUNCTION: Check if user has specific role
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_user_has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = role_name
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- HELPER: Check if user can verify/close actions
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_can_verify_actions()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name IN (
      'SUPER_ADMIN', 'CLIENT_ADMIN', 'REGIONAL_MANAGER',
      'AREA_MANAGER', 'SAFETY_SUPERVISOR', 'SUPERVISOR', 'RO_MANAGER'
    )
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
