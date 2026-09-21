// ============================================================
// Dhruv Track — Database Type Definitions
// ============================================================

// ---- Enums ----

export type DivisionType = 'RETAIL' | 'LPG_DISTRIBUTION' | 'TRANSPORT' | 'OTHER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'EXITED';

export type EmploymentType = 'PERMANENT' | 'CONTRACTUAL' | 'TEMPORARY' | 'TRAINEE';

export type TrainingCategory =
  | 'SAFETY'
  | 'BEHAVIORAL'
  | 'SOP'
  | 'EMERGENCY'
  | 'DRIVING'
  | 'TANKER'
  | 'RETAIL'
  | 'LPG'
  | 'REFRESHER';

export type TrainingStatus = 'TRAINED' | 'PENDING' | 'OVERDUE' | 'EXPIRED' | 'NOT_REQUIRED';

export type VisitPurpose =
  | 'SAFETY_INSPECTION'
  | 'TRAINING_VERIFICATION'
  | 'BEHAVIORAL_OBSERVATION'
  | 'FOLLOW_UP'
  | 'AUDIT'
  | 'CORRECTIVE_ACTION_VERIFICATION';

export type VisitStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type ChecklistResult = 'PASS' | 'FAIL' | 'NA';

export type InspectionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type ObservationCategory =
  | 'UNSAFE_ACT'
  | 'UNSAFE_CONDITION'
  | 'NEAR_MISS'
  | 'GOOD_PRACTICE';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type BehaviorResult = 'OBSERVED' | 'NOT_OBSERVED' | 'NON_COMPLIANT' | 'GOOD_PRACTICE';

export type ActionStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PENDING_VERIFICATION'
  | 'CLOSED'
  | 'REOPENED';

export type ActionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ActionSourceType = 'INSPECTION' | 'OBSERVATION' | 'BEHAVIORAL' | 'MANUAL';

export type CertificateStatus = 'VALID' | 'EXPIRED' | 'REVOKED';

export type VehicleType = 'TANKER' | 'TRUCK' | 'LPG_DELIVERY' | 'OTHER';

export type VehicleStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE' | 'DECOMMISSIONED';

export type NotificationType =
  | 'TRAINING_OVERDUE'
  | 'CERTIFICATE_EXPIRING'
  | 'CRITICAL_OBSERVATION'
  | 'ACTION_ASSIGNED'
  | 'ACTION_OVERDUE'
  | 'ACTION_PENDING_VERIFICATION'
  | 'VISIT_SCHEDULED'
  | 'GENERAL';

export type AuditAction =
  | 'LOGIN'
  | 'TRAINING_STATUS_CHANGE'
  | 'FIELD_VISIT'
  | 'INSPECTION'
  | 'OBSERVATION'
  | 'ACTION_CREATED'
  | 'ACTION_ASSIGNED'
  | 'ACTION_UPDATED'
  | 'EVIDENCE_UPLOADED'
  | 'VERIFICATION'
  | 'CLOSURE'
  | 'REOPENED'
  | 'USER_ROLE_CHANGE'
  | 'EMPLOYEE_CREATED'
  | 'EMPLOYEE_UPDATED';

export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';

export type LocationType = 'RETAIL_OUTLET' | 'LPG_DISTRIBUTOR' | 'DEPOT' | 'TERMINAL' | 'OFFICE' | 'OTHER';

// ---- Role System ----

export const ROLES = [
  'SUPER_ADMIN',
  'CLIENT_ADMIN',
  'REGIONAL_MANAGER',
  'AREA_MANAGER',
  'FIELD_OFFICER',
  'SAFETY_SUPERVISOR',
  'TRAINER',
  'RO_MANAGER',
  'SUPERVISOR',
  'EMPLOYEE',
  'CUSTOMER_ATTENDANT',
  'CONTRACTOR',
  'DRIVER',
  'LPG_DELIVERY_PERSONNEL',
  'AUDITOR',
] as const;

export type RoleName = (typeof ROLES)[number];

// ---- Database Row Types ----

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Division {
  id: string;
  organization_id: string;
  name: string;
  type: DivisionType;
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: string;
  organization_id: string;
  division_id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface Area {
  id: string;
  organization_id: string;
  region_id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  organization_id: string;
  area_id: string;
  name: string;
  code: string;
  type: LocationType;
  qr_code: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  contact_person: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  organization_id: string;
  employee_id: string;
  name: string;
  email: string;
  mobile: string | null;
  avatar_url: string | null;
  division_id: string | null;
  region_id: string | null;
  area_id: string | null;
  location_id: string | null;
  manager_id: string | null;
  supervisor_id: string | null;
  employment_type: EmploymentType;
  contractor_id: string | null;
  joining_date: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  organization_id: string;
  name: RoleName;
  display_name: string;
  permissions: string[];
  is_system: boolean;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  organization_id: string;
  created_at: string;
}

export interface Contractor {
  id: string;
  organization_id: string;
  name: string;
  contact_person: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  license_number: string | null;
  license_expiry: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  organization_id: string;
  vehicle_number: string;
  vehicle_type: VehicleType;
  driver_id: string | null;
  contractor_id: string | null;
  fitness_expiry: string | null;
  insurance_expiry: string | null;
  permit_expiry: string | null;
  last_inspection: string | null;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
}

export interface TrainingCourse {
  id: string;
  organization_id: string;
  name: string;
  category: TrainingCategory;
  description: string | null;
  duration_hours: number | null;
  validity_months: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainingRecord {
  id: string;
  organization_id: string;
  course_id: string;
  employee_id: string;
  trainer_id: string | null;
  location_id: string | null;
  training_date: string;
  attendance: boolean;
  completion: boolean;
  score: number | null;
  pass_fail: boolean | null;
  certificate_url: string | null;
  expiry_date: string | null;
  status: TrainingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  organization_id: string;
  employee_id: string;
  course_id: string | null;
  name: string;
  issued_date: string;
  expiry_date: string | null;
  certificate_url: string | null;
  status: CertificateStatus;
  created_at: string;
  updated_at: string;
}

export interface FieldVisit {
  id: string;
  organization_id: string;
  officer_id: string;
  location_id: string;
  visit_date: string;
  visit_time: string | null;
  purpose: VisitPurpose;
  gps_latitude: number | null;
  gps_longitude: number | null;
  gps_accuracy: number | null;
  notes: string | null;
  status: VisitStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InspectionTemplate {
  id: string;
  organization_id: string;
  name: string;
  category: string;
  division_type: DivisionType | null;
  questions: InspectionQuestion[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InspectionQuestion {
  key: string;
  text: string;
  category: string;
  required: boolean;
  allow_photo: boolean;
  allow_comment: boolean;
  order: number;
}

export interface Inspection {
  id: string;
  organization_id: string;
  visit_id: string;
  template_id: string;
  inspector_id: string;
  location_id: string;
  started_at: string;
  completed_at: string | null;
  status: InspectionStatus;
  overall_result: ChecklistResult | null;
  pass_count: number;
  fail_count: number;
  na_count: number;
  created_at: string;
  updated_at: string;
}

export interface InspectionResponse {
  id: string;
  inspection_id: string;
  question_key: string;
  result: ChecklistResult;
  photo_url: string | null;
  comment: string | null;
  severity: Severity | null;
  created_at: string;
}

export interface SafetyObservation {
  id: string;
  organization_id: string;
  location_id: string;
  observer_id: string;
  person_id: string | null;
  visit_id: string | null;
  category: ObservationCategory;
  description: string;
  severity: Severity;
  photo_url: string | null;
  gps_latitude: number | null;
  gps_longitude: number | null;
  status: 'OPEN' | 'ACTION_CREATED' | 'RESOLVED';
  created_at: string;
  updated_at: string;
}

export interface BehavioralObservation {
  id: string;
  organization_id: string;
  location_id: string;
  observer_id: string;
  employee_id: string;
  behavior_type: string;
  result: BehaviorResult;
  notes: string | null;
  visit_id: string | null;
  created_at: string;
}

export interface CorrectiveAction {
  id: string;
  organization_id: string;
  action_number: string;
  source_type: ActionSourceType;
  source_id: string | null;
  location_id: string;
  issue: string;
  description: string | null;
  responsible_id: string | null;
  supervisor_id: string | null;
  priority: ActionPriority;
  due_date: string | null;
  status: ActionStatus;
  verification_notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
  closed_at: string | null;
  reopened_at: string | null;
  reopen_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActionEvidence {
  id: string;
  action_id: string;
  uploaded_by: string;
  file_url: string;
  file_type: string;
  description: string | null;
  uploaded_at: string;
}

export interface Notification {
  id: string;
  organization_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string;
  action: AuditAction;
  entity_type: string;
  entity_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface OrganizationConfig {
  id: string;
  organization_id: string;
  branding: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    favicon_url?: string;
  };
  enabled_roles: RoleName[];
  enabled_divisions: DivisionType[];
  notification_rules: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ---- Joined / View Types ----

export interface ProfileWithRole extends Profile {
  roles: Role[];
  location?: Location;
  manager?: Pick<Profile, 'id' | 'name' | 'email'>;
  supervisor?: Pick<Profile, 'id' | 'name' | 'email'>;
}

export interface FieldVisitWithDetails extends FieldVisit {
  officer: Pick<Profile, 'id' | 'name' | 'email'>;
  location: Pick<Location, 'id' | 'name' | 'code' | 'type'>;
  inspections: Inspection[];
  observations: SafetyObservation[];
  actions_created: CorrectiveAction[];
}

export interface CorrectiveActionWithDetails extends CorrectiveAction {
  responsible: Pick<Profile, 'id' | 'name' | 'email'> | null;
  supervisor: Pick<Profile, 'id' | 'name' | 'email'> | null;
  location: Pick<Location, 'id' | 'name' | 'code'>;
  evidence: ActionEvidence[];
  verifier: Pick<Profile, 'id' | 'name' | 'email'> | null;
}

export interface TrainingRecordWithDetails extends TrainingRecord {
  course: TrainingCourse;
  employee: Pick<Profile, 'id' | 'name' | 'email'>;
  trainer: Pick<Profile, 'id' | 'name' | 'email'> | null;
  location: Pick<Location, 'id' | 'name' | 'code'> | null;
}

export interface LocationWithStats extends Location {
  area?: Area;
  employee_count: number;
  trained_count: number;
  pending_training_count: number;
  open_observations: number;
  open_actions: number;
  overdue_actions: number;
  last_visit_date: string | null;
}

// ---- Dashboard Types ----

export interface DashboardStats {
  workforce: {
    total: number;
    active: number;
    inactive: number;
    by_role: Record<string, number>;
  };
  training: {
    trained: number;
    pending: number;
    expired: number;
    overdue: number;
  };
  visits: {
    completed: number;
    pending: number;
    this_week: number;
    this_month: number;
  };
  safety: {
    total_observations: number;
    unsafe_acts: number;
    unsafe_conditions: number;
    near_misses: number;
    critical_issues: number;
    good_practices: number;
  };
  actions: {
    open: number;
    overdue: number;
    pending_verification: number;
    closed: number;
    total: number;
  };
}

export interface ComplianceData {
  name: string;
  id: string;
  total_checks: number;
  passed: number;
  failed: number;
  compliance_rate: number;
}

// ---- Filter Types ----

export interface DashboardFilters {
  organization_id?: string;
  division_id?: string;
  region_id?: string;
  area_id?: string;
  location_id?: string;
  role?: RoleName;
  employee_id?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
}
