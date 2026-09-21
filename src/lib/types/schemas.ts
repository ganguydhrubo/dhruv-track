import { z } from 'zod';

// ---- Organization ----
export const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name is required').max(200),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  logo_url: z.string().url().nullable().optional(),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').default('#1e40af'),
});

// ---- Division ----
export const divisionSchema = z.object({
  name: z.string().min(2, 'Division name is required').max(100),
  type: z.enum(['RETAIL', 'LPG_DISTRIBUTION', 'TRANSPORT', 'OTHER']),
});

// ---- Region ----
export const regionSchema = z.object({
  division_id: z.string().uuid('Select a division'),
  name: z.string().min(2, 'Region name is required').max(100),
  code: z.string().min(1, 'Region code is required').max(20),
});

// ---- Area ----
export const areaSchema = z.object({
  region_id: z.string().uuid('Select a region'),
  name: z.string().min(2, 'Area name is required').max(100),
  code: z.string().min(1, 'Area code is required').max(20),
});

// ---- Location ----
export const locationSchema = z.object({
  area_id: z.string().uuid('Select an area'),
  name: z.string().min(2, 'Location name is required').max(200),
  code: z.string().min(1, 'Location code is required').max(30),
  type: z.enum(['RETAIL_OUTLET', 'LPG_DISTRIBUTOR', 'DEPOT', 'TERMINAL', 'OFFICE', 'OTHER']),
  address: z.string().max(500).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  contact_person: z.string().max(100).nullable().optional(),
  contact_phone: z.string().max(20).nullable().optional(),
  is_active: z.boolean().default(true),
});

// ---- Profile / Employee ----
export const profileSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required').max(30),
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  mobile: z.string().max(20).nullable().optional(),
  division_id: z.string().uuid().nullable().optional(),
  region_id: z.string().uuid().nullable().optional(),
  area_id: z.string().uuid().nullable().optional(),
  location_id: z.string().uuid().nullable().optional(),
  manager_id: z.string().uuid().nullable().optional(),
  supervisor_id: z.string().uuid().nullable().optional(),
  employment_type: z.enum(['PERMANENT', 'CONTRACTUAL', 'TEMPORARY', 'TRAINEE']).default('PERMANENT'),
  contractor_id: z.string().uuid().nullable().optional(),
  joining_date: z.string().nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'EXITED']).default('ACTIVE'),
});

// ---- Contractor ----
export const contractorSchema = z.object({
  name: z.string().min(2, 'Contractor name is required').max(200),
  contact_person: z.string().max(100).nullable().optional(),
  contact_phone: z.string().max(20).nullable().optional(),
  contact_email: z.string().email().nullable().optional(),
  license_number: z.string().max(50).nullable().optional(),
  license_expiry: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

// ---- Vehicle ----
export const vehicleSchema = z.object({
  vehicle_number: z.string().min(1, 'Vehicle number is required').max(20),
  vehicle_type: z.enum(['TANKER', 'TRUCK', 'LPG_DELIVERY', 'OTHER']),
  driver_id: z.string().uuid().nullable().optional(),
  contractor_id: z.string().uuid().nullable().optional(),
  fitness_expiry: z.string().nullable().optional(),
  insurance_expiry: z.string().nullable().optional(),
  permit_expiry: z.string().nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED']).default('ACTIVE'),
});

// ---- Training Course ----
export const trainingCourseSchema = z.object({
  name: z.string().min(2, 'Course name is required').max(200),
  category: z.enum(['SAFETY', 'BEHAVIORAL', 'SOP', 'EMERGENCY', 'DRIVING', 'TANKER', 'RETAIL', 'LPG', 'REFRESHER']),
  description: z.string().max(2000).nullable().optional(),
  duration_hours: z.number().min(0.5).max(1000).nullable().optional(),
  validity_months: z.number().min(1).max(120).nullable().optional(),
  is_active: z.boolean().default(true),
});

// ---- Training Record ----
export const trainingRecordSchema = z.object({
  course_id: z.string().uuid('Select a course'),
  employee_id: z.string().uuid('Select an employee'),
  trainer_id: z.string().uuid().nullable().optional(),
  location_id: z.string().uuid().nullable().optional(),
  training_date: z.string().min(1, 'Training date is required'),
  attendance: z.boolean().default(true),
  completion: z.boolean().default(false),
  score: z.number().min(0).max(100).nullable().optional(),
  pass_fail: z.boolean().nullable().optional(),
  certificate_url: z.string().url().nullable().optional(),
  expiry_date: z.string().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

// ---- Field Visit ----
export const fieldVisitSchema = z.object({
  location_id: z.string().uuid('Select a location'),
  visit_date: z.string().min(1, 'Visit date is required'),
  visit_time: z.string().nullable().optional(),
  purpose: z.enum([
    'SAFETY_INSPECTION',
    'TRAINING_VERIFICATION',
    'BEHAVIORAL_OBSERVATION',
    'FOLLOW_UP',
    'AUDIT',
    'CORRECTIVE_ACTION_VERIFICATION',
  ]),
  gps_latitude: z.number().min(-90).max(90).nullable().optional(),
  gps_longitude: z.number().min(-180).max(180).nullable().optional(),
  gps_accuracy: z.number().min(0).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

// ---- Inspection Template ----
export const inspectionQuestionSchema = z.object({
  key: z.string().min(1),
  text: z.string().min(1, 'Question text is required'),
  category: z.string().min(1, 'Category is required'),
  required: z.boolean().default(true),
  allow_photo: z.boolean().default(true),
  allow_comment: z.boolean().default(true),
  order: z.number().int().min(0),
});

export const inspectionTemplateSchema = z.object({
  name: z.string().min(2, 'Template name is required').max(200),
  category: z.string().min(1, 'Category is required').max(50),
  division_type: z.enum(['RETAIL', 'LPG_DISTRIBUTION', 'TRANSPORT', 'OTHER']).nullable().optional(),
  questions: z.array(inspectionQuestionSchema).min(1, 'At least one question is required'),
  is_active: z.boolean().default(true),
});

// ---- Inspection Response ----
export const inspectionResponseSchema = z.object({
  question_key: z.string().min(1),
  result: z.enum(['PASS', 'FAIL', 'NA']),
  photo_url: z.string().url().nullable().optional(),
  comment: z.string().max(1000).nullable().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).nullable().optional(),
});

// ---- Safety Observation ----
export const safetyObservationSchema = z.object({
  location_id: z.string().uuid('Select a location'),
  person_id: z.string().uuid().nullable().optional(),
  visit_id: z.string().uuid().nullable().optional(),
  category: z.enum(['UNSAFE_ACT', 'UNSAFE_CONDITION', 'NEAR_MISS', 'GOOD_PRACTICE']),
  description: z.string().min(5, 'Description is required').max(5000),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  photo_url: z.string().url().nullable().optional(),
  gps_latitude: z.number().min(-90).max(90).nullable().optional(),
  gps_longitude: z.number().min(-180).max(180).nullable().optional(),
});

// ---- Behavioral Observation ----
export const behavioralObservationSchema = z.object({
  location_id: z.string().uuid('Select a location'),
  employee_id: z.string().uuid('Select an employee'),
  behavior_type: z.string().min(1, 'Behavior type is required').max(100),
  result: z.enum(['OBSERVED', 'NOT_OBSERVED', 'NON_COMPLIANT', 'GOOD_PRACTICE']),
  notes: z.string().max(2000).nullable().optional(),
  visit_id: z.string().uuid().nullable().optional(),
});

// ---- Corrective Action ----
export const correctiveActionSchema = z.object({
  source_type: z.enum(['INSPECTION', 'OBSERVATION', 'BEHAVIORAL', 'MANUAL']),
  source_id: z.string().uuid().nullable().optional(),
  location_id: z.string().uuid('Select a location'),
  issue: z.string().min(5, 'Issue description is required').max(500),
  description: z.string().max(5000).nullable().optional(),
  responsible_id: z.string().uuid().nullable().optional(),
  supervisor_id: z.string().uuid().nullable().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  due_date: z.string().nullable().optional(),
});

// ---- Action Evidence ----
export const actionEvidenceSchema = z.object({
  action_id: z.string().uuid(),
  file_url: z.string().url('Valid file URL is required'),
  file_type: z.string().min(1).max(50),
  description: z.string().max(500).nullable().optional(),
});

// ---- Action Status Transition ----
export const actionStatusTransitionSchema = z.object({
  status: z.enum(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_VERIFICATION', 'CLOSED', 'REOPENED']),
  verification_notes: z.string().max(2000).nullable().optional(),
  reopen_reason: z.string().max(2000).nullable().optional(),
});

// ---- Login ----
export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  organization_code: z.string().min(2, 'Organization code is required').max(50),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email is required'),
});

// ---- Report Filters ----
export const reportFilterSchema = z.object({
  organization_id: z.string().uuid().optional(),
  division_id: z.string().uuid().optional(),
  region_id: z.string().uuid().optional(),
  area_id: z.string().uuid().optional(),
  location_id: z.string().uuid().optional(),
  role: z.string().optional(),
  employee_id: z.string().uuid().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  status: z.string().optional(),
});
