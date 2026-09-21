-- ============================================================
-- Dhruv Track — Row Level Security Policies
-- ============================================================
-- Every table is org-scoped. Users can only access data
-- within their own organization.
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrective_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT TO authenticated
  USING (id = public.current_org_id());

CREATE POLICY "Super admins can insert organizations"
  ON organizations FOR INSERT TO authenticated
  WITH CHECK (public.check_user_has_role('SUPER_ADMIN'));

CREATE POLICY "Super admins can update organizations"
  ON organizations FOR UPDATE TO authenticated
  USING (id = public.current_org_id() AND public.check_user_has_role('SUPER_ADMIN'))
  WITH CHECK (id = public.current_org_id());

-- ============================================================
-- ORGANIZATION CONFIG
-- ============================================================
CREATE POLICY "Users can view their org config"
  ON organization_config FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Admins can manage org config"
  ON organization_config FOR ALL TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')))
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- DIVISIONS
-- ============================================================
CREATE POLICY "Users can view org divisions"
  ON divisions FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Admins can insert divisions"
  ON divisions FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

CREATE POLICY "Admins can update divisions"
  ON divisions FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')))
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Admins can delete divisions"
  ON divisions FOR DELETE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

-- ============================================================
-- REGIONS
-- ============================================================
CREATE POLICY "Users can view org regions"
  ON regions FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Admins can insert regions"
  ON regions FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

CREATE POLICY "Admins can update regions"
  ON regions FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')))
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Admins can delete regions"
  ON regions FOR DELETE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

-- ============================================================
-- AREAS
-- ============================================================
CREATE POLICY "Users can view org areas"
  ON areas FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Admins can insert areas"
  ON areas FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

CREATE POLICY "Admins can update areas"
  ON areas FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')))
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Admins can delete areas"
  ON areas FOR DELETE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

-- ============================================================
-- LOCATIONS
-- ============================================================
CREATE POLICY "Users can view org locations"
  ON locations FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Admins and managers can insert locations"
  ON locations FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN') OR public.check_user_has_role('REGIONAL_MANAGER')));

CREATE POLICY "Admins and managers can update locations"
  ON locations FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN') OR public.check_user_has_role('REGIONAL_MANAGER')))
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Admins can delete locations"
  ON locations FOR DELETE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

-- ============================================================
-- ROLES
-- ============================================================
CREATE POLICY "Users can view org roles"
  ON roles FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Admins can manage roles"
  ON roles FOR ALL TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')))
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "Users can view org profiles"
  ON profiles FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND organization_id = public.current_org_id());

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')))
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- USER ROLES
-- ============================================================
CREATE POLICY "Users can view org user_roles"
  ON user_roles FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Admins can manage user_roles"
  ON user_roles FOR ALL TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')))
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- CONTRACTORS
-- ============================================================
CREATE POLICY "Users can view org contractors"
  ON contractors FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Admins can manage contractors"
  ON contractors FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

CREATE POLICY "Admins can update contractors"
  ON contractors FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')))
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Admins can delete contractors"
  ON contractors FOR DELETE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

-- ============================================================
-- VEHICLES
-- ============================================================
CREATE POLICY "Users can view org vehicles"
  ON vehicles FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Authorized users can insert vehicles"
  ON vehicles FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Authorized users can update vehicles"
  ON vehicles FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id())
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Admins can delete vehicles"
  ON vehicles FOR DELETE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

-- ============================================================
-- TRAINING COURSES
-- ============================================================
CREATE POLICY "Users can view org courses"
  ON training_courses FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Trainers and admins can insert courses"
  ON training_courses FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN') OR public.check_user_has_role('TRAINER')));

CREATE POLICY "Trainers and admins can update courses"
  ON training_courses FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN') OR public.check_user_has_role('TRAINER')))
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Admins can delete courses"
  ON training_courses FOR DELETE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')));

-- ============================================================
-- TRAINING RECORDS
-- ============================================================
CREATE POLICY "Users can view org training records"
  ON training_records FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Authorized users can insert training records"
  ON training_records FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Authorized users can update training records"
  ON training_records FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id())
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- CERTIFICATES
-- ============================================================
CREATE POLICY "Users can view org certificates"
  ON certificates FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Authorized users can insert certificates"
  ON certificates FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Authorized users can update certificates"
  ON certificates FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id())
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- FIELD VISITS
-- ============================================================
CREATE POLICY "Users can view org field visits"
  ON field_visits FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Field users can insert visits"
  ON field_visits FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Field users can update own visits"
  ON field_visits FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND (officer_id = auth.uid() OR public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')))
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- INSPECTION TEMPLATES
-- ============================================================
CREATE POLICY "Users can view org templates"
  ON inspection_templates FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Admins can manage templates"
  ON inspection_templates FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN') OR public.check_user_has_role('SAFETY_SUPERVISOR')));

CREATE POLICY "Admins can update templates"
  ON inspection_templates FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND (public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN') OR public.check_user_has_role('SAFETY_SUPERVISOR')))
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- INSPECTIONS
-- ============================================================
CREATE POLICY "Users can view org inspections"
  ON inspections FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Field users can insert inspections"
  ON inspections FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Field users can update own inspections"
  ON inspections FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND (inspector_id = auth.uid() OR public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN')))
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- INSPECTION RESPONSES
-- ============================================================
CREATE POLICY "Users can view inspection responses"
  ON inspection_responses FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections i
      WHERE i.id = inspection_responses.inspection_id
      AND i.organization_id = public.current_org_id()
    )
  );

CREATE POLICY "Field users can insert responses"
  ON inspection_responses FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspections i
      WHERE i.id = inspection_responses.inspection_id
      AND i.organization_id = public.current_org_id()
    )
  );

CREATE POLICY "Field users can update responses"
  ON inspection_responses FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections i
      WHERE i.id = inspection_responses.inspection_id
      AND i.organization_id = public.current_org_id()
    )
  );

-- ============================================================
-- SAFETY OBSERVATIONS
-- ============================================================
CREATE POLICY "Users can view org observations"
  ON safety_observations FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Field users can insert observations"
  ON safety_observations FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Field users can update observations"
  ON safety_observations FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND (observer_id = auth.uid() OR public.check_user_has_role('SUPER_ADMIN') OR public.check_user_has_role('CLIENT_ADMIN') OR public.check_user_has_role('SAFETY_SUPERVISOR')))
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- BEHAVIORAL OBSERVATIONS
-- ============================================================
CREATE POLICY "Users can view org behavioral observations"
  ON behavioral_observations FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Field users can insert behavioral observations"
  ON behavioral_observations FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- CORRECTIVE ACTIONS
-- ============================================================
CREATE POLICY "Users can view org actions"
  ON corrective_actions FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id());

CREATE POLICY "Field users can insert actions"
  ON corrective_actions FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Authorized users can update actions"
  ON corrective_actions FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id())
  WITH CHECK (organization_id = public.current_org_id());

-- ============================================================
-- ACTION EVIDENCE
-- ============================================================
CREATE POLICY "Users can view org action evidence"
  ON action_evidence FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM corrective_actions ca
      WHERE ca.id = action_evidence.action_id
      AND ca.organization_id = public.current_org_id()
    )
  );

CREATE POLICY "Authorized users can insert evidence"
  ON action_evidence FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM corrective_actions ca
      WHERE ca.id = action_evidence.action_id
      AND ca.organization_id = public.current_org_id()
    )
  );

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Users can update own notifications (mark read)"
  ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- AUDIT LOGS (immutable for non-admins)
-- ============================================================
CREATE POLICY "Authorized users can view audit logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (
    organization_id = public.current_org_id()
    AND (
      public.check_user_has_role('SUPER_ADMIN')
      OR public.check_user_has_role('CLIENT_ADMIN')
      OR public.check_user_has_role('AUDITOR')
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id());

-- No UPDATE or DELETE policies for audit_logs — they are immutable

-- ============================================================
-- STORAGE POLICIES
-- ============================================================
-- Run these after creating buckets in Supabase Dashboard:
-- Buckets: evidence, certificates, photos, documents

-- INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies (apply per bucket):
-- CREATE POLICY "Authenticated users can upload" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id IN ('evidence', 'certificates', 'photos', 'documents'));

-- CREATE POLICY "Authenticated users can view own org files" ON storage.objects
--   FOR SELECT TO authenticated
--   USING (bucket_id IN ('evidence', 'certificates', 'photos', 'documents'));
