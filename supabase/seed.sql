-- ============================================================
-- Dhruv Track — Seed Data (~200 users)
-- ============================================================
-- Run AFTER schema and RLS migrations
-- This creates a realistic demo dataset
-- ============================================================

-- ============================================================
-- 1. ORGANIZATION
-- ============================================================
INSERT INTO organizations (id, name, slug, primary_color, config) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Dhruv Energy Services', 'dhruv-energy', '#1e40af', '{"tagline": "Track Training. Verify Safety. Close Actions."}');

INSERT INTO organization_config (organization_id, branding, enabled_roles, enabled_divisions) VALUES
  ('11111111-1111-1111-1111-111111111111',
   '{"primary_color": "#1e40af"}',
   ARRAY['SUPER_ADMIN','CLIENT_ADMIN','REGIONAL_MANAGER','AREA_MANAGER','FIELD_OFFICER','SAFETY_SUPERVISOR','TRAINER','RO_MANAGER','SUPERVISOR','EMPLOYEE','CUSTOMER_ATTENDANT','CONTRACTOR','DRIVER','LPG_DELIVERY_PERSONNEL','AUDITOR'],
   ARRAY['RETAIL'::division_type, 'LPG_DISTRIBUTION'::division_type, 'TRANSPORT'::division_type]
  );

-- ============================================================
-- 2. DIVISIONS
-- ============================================================
INSERT INTO divisions (id, organization_id, name, type) VALUES
  ('d1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Retail Operations', 'RETAIL'),
  ('d1000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'LPG Distribution', 'LPG_DISTRIBUTION'),
  ('d1000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Transport', 'TRANSPORT');

-- ============================================================
-- 3. REGIONS
-- ============================================================
INSERT INTO regions (id, organization_id, division_id, name, code) VALUES
  -- Retail regions
  ('b1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'd1000001-0000-0000-0000-000000000001', 'West Bengal', 'WB'),
  ('b1000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'd1000001-0000-0000-0000-000000000001', 'Odisha', 'OD'),
  -- LPG regions
  ('b1000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'd1000002-0000-0000-0000-000000000002', 'West Bengal', 'WB-LPG');

-- ============================================================
-- 4. AREAS
-- ============================================================
INSERT INTO areas (id, organization_id, region_id, name, code) VALUES
  -- Retail WB
  ('a1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b1000001-0000-0000-0000-000000000001', 'Kolkata Territory', 'KOL'),
  ('a1000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'b1000001-0000-0000-0000-000000000001', 'Howrah Territory', 'HWH'),
  ('a1000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'b1000001-0000-0000-0000-000000000001', 'Siliguri Territory', 'SLG'),
  -- Retail OD
  ('a1000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'b1000002-0000-0000-0000-000000000002', 'Bhubaneswar Territory', 'BBS'),
  ('a1000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'b1000002-0000-0000-0000-000000000002', 'Cuttack Territory', 'CTC'),
  -- LPG WB
  ('a1000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'b1000003-0000-0000-0000-000000000003', 'Kolkata LPG Territory', 'KOL-LPG');

-- ============================================================
-- 5. LOCATIONS (18 locations)
-- ============================================================
INSERT INTO locations (id, organization_id, area_id, name, code, type, qr_code, address, latitude, longitude) VALUES
  -- Kolkata ROs
  ('c1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'Park Street Fuel Station', 'RO-WB-KOL-001', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000001-0000-0000-0000-000000000001/RO-WB-KOL-001', '45 Park Street, Kolkata 700016', 22.5533, 88.3513),
  ('c1000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'Salt Lake Fuel Station', 'RO-WB-KOL-002', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000002-0000-0000-0000-000000000002/RO-WB-KOL-002', 'Sector V, Salt Lake, Kolkata 700091', 22.5726, 88.4314),
  ('c1000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'New Town Fuel Station', 'RO-WB-KOL-003', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000003-0000-0000-0000-000000000003/RO-WB-KOL-003', 'Major Arterial Road, New Town, Kolkata 700156', 22.5866, 88.4647),
  -- Howrah ROs
  ('c1000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'a1000002-0000-0000-0000-000000000002', 'Howrah Station Fuel Point', 'RO-WB-HWH-001', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000004-0000-0000-0000-000000000004/RO-WB-HWH-001', 'GT Road, Howrah 711101', 22.5839, 88.3427),
  ('c1000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'a1000002-0000-0000-0000-000000000002', 'Shibpur Fuel Station', 'RO-WB-HWH-002', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000005-0000-0000-0000-000000000005/RO-WB-HWH-002', 'Shibpur, Howrah 711102', 22.5656, 88.3234),
  ('c1000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'a1000002-0000-0000-0000-000000000002', 'Uluberia Fuel Station', 'RO-WB-HWH-003', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000006-0000-0000-0000-000000000006/RO-WB-HWH-003', 'NH-6, Uluberia, Howrah 711316', 22.4685, 88.1149),
  -- Siliguri ROs
  ('c1000007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'a1000003-0000-0000-0000-000000000003', 'Siliguri Junction Fuel', 'RO-WB-SLG-001', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000007-0000-0000-0000-000000000007/RO-WB-SLG-001', 'Hill Cart Road, Siliguri 734001', 26.7271, 88.3953),
  ('c1000008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'a1000003-0000-0000-0000-000000000003', 'Matigara Fuel Station', 'RO-WB-SLG-002', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000008-0000-0000-0000-000000000008/RO-WB-SLG-002', 'Matigara, Siliguri 734010', 26.6848, 88.3864),
  -- Bhubaneswar ROs
  ('c1000009-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'a1000004-0000-0000-0000-000000000004', 'Jaydev Vihar Fuel Station', 'RO-OD-BBS-001', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000009-0000-0000-0000-000000000009/RO-OD-BBS-001', 'Jaydev Vihar, Bhubaneswar 751013', 20.2961, 85.8245),
  ('c1000010-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'a1000004-0000-0000-0000-000000000004', 'Patia Fuel Station', 'RO-OD-BBS-002', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000010-0000-0000-0000-000000000010/RO-OD-BBS-002', 'Patia, Bhubaneswar 751024', 20.3565, 85.8197),
  ('c1000011-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', 'a1000004-0000-0000-0000-000000000004', 'Rasulgarh Fuel Station', 'RO-OD-BBS-003', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000011-0000-0000-0000-000000000011/RO-OD-BBS-003', 'Rasulgarh, Bhubaneswar 751010', 20.2775, 85.8584),
  -- Cuttack ROs
  ('c1000012-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', 'a1000005-0000-0000-0000-000000000005', 'Cuttack Central Fuel', 'RO-OD-CTC-001', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000012-0000-0000-0000-000000000012/RO-OD-CTC-001', 'Link Road, Cuttack 753012', 20.4625, 85.8830),
  ('c1000013-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', 'a1000005-0000-0000-0000-000000000005', 'Choudwar Fuel Station', 'RO-OD-CTC-002', 'RETAIL_OUTLET', 'dhruvtrack://location/c1000013-0000-0000-0000-000000000013/RO-OD-CTC-002', 'Choudwar, Cuttack 754025', 20.5000, 85.8333),
  -- LPG Distributors
  ('c1000014-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', 'a1000006-0000-0000-0000-000000000006', 'Kolkata LPG Distributor A', 'LPG-WB-KOL-001', 'LPG_DISTRIBUTOR', 'dhruvtrack://location/c1000014-0000-0000-0000-000000000014/LPG-WB-KOL-001', 'Gariahat, Kolkata 700019', 22.5196, 88.3692),
  ('c1000015-0000-0000-0000-000000000015', '11111111-1111-1111-1111-111111111111', 'a1000006-0000-0000-0000-000000000006', 'Kolkata LPG Distributor B', 'LPG-WB-KOL-002', 'LPG_DISTRIBUTOR', 'dhruvtrack://location/c1000015-0000-0000-0000-000000000015/LPG-WB-KOL-002', 'Behala, Kolkata 700034', 22.4840, 88.3047),
  ('c1000016-0000-0000-0000-000000000016', '11111111-1111-1111-1111-111111111111', 'a1000006-0000-0000-0000-000000000006', 'Kolkata LPG Distributor C', 'LPG-WB-KOL-003', 'LPG_DISTRIBUTOR', 'dhruvtrack://location/c1000016-0000-0000-0000-000000000016/LPG-WB-KOL-003', 'Jadavpur, Kolkata 700032', 22.4989, 88.3696),
  -- Depots
  ('c1000017-0000-0000-0000-000000000017', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'Kolkata Transport Depot', 'DEP-WB-KOL-001', 'DEPOT', 'dhruvtrack://location/c1000017-0000-0000-0000-000000000017/DEP-WB-KOL-001', 'Budge Budge, Kolkata 700137', 22.4721, 88.1726),
  ('c1000018-0000-0000-0000-000000000018', '11111111-1111-1111-1111-111111111111', 'a1000004-0000-0000-0000-000000000004', 'Bhubaneswar Transport Depot', 'DEP-OD-BBS-001', 'DEPOT', 'dhruvtrack://location/c1000018-0000-0000-0000-000000000018/DEP-OD-BBS-001', 'Mancheswar, Bhubaneswar 751017', 20.3087, 85.8449);

-- ============================================================
-- 6. ROLES
-- ============================================================
INSERT INTO roles (id, organization_id, name, display_name, permissions, is_system) VALUES
  ('ce000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'SUPER_ADMIN', 'Super Admin', '{}', true),
  ('ce000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'CLIENT_ADMIN', 'Client Admin', '{}', true),
  ('ce000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'REGIONAL_MANAGER', 'Regional Manager', '{}', true),
  ('ce000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'AREA_MANAGER', 'Area Manager', '{}', true),
  ('ce000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'FIELD_OFFICER', 'Field Officer', '{}', true),
  ('ce000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'SAFETY_SUPERVISOR', 'Safety Supervisor', '{}', true),
  ('ce000007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'TRAINER', 'Trainer', '{}', true),
  ('ce000008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'RO_MANAGER', 'RO Manager', '{}', true),
  ('ce000009-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'SUPERVISOR', 'Supervisor', '{}', true),
  ('ce000010-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'EMPLOYEE', 'Employee', '{}', true),
  ('ce000011-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', 'CUSTOMER_ATTENDANT', 'Customer Attendant', '{}', true),
  ('ce000012-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', 'CONTRACTOR', 'Contractor', '{}', true),
  ('ce000013-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', 'DRIVER', 'Driver', '{}', true),
  ('ce000014-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', 'LPG_DELIVERY_PERSONNEL', 'LPG Delivery Personnel', '{}', true),
  ('ce000015-0000-0000-0000-000000000015', '11111111-1111-1111-1111-111111111111', 'AUDITOR', 'Auditor', '{}', true);

-- ============================================================
-- 7. CONTRACTORS
-- ============================================================
INSERT INTO contractors (id, organization_id, name, contact_person, contact_phone, is_active) VALUES
  ('ca000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Bengal Transport Co', 'Ramesh Kumar', '9876543210', true),
  ('ca000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Eastern Logistics', 'Sunil Patel', '9876543211', true),
  ('ca000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Odisha Carriers', 'Prakash Mohanty', '9876543212', true);

-- ============================================================
-- 8. TRAINING COURSES
-- ============================================================
INSERT INTO training_courses (id, organization_id, name, category, description, duration_hours, validity_months, is_active) VALUES
  ('cb000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Fire Safety & Prevention', 'SAFETY', 'Fire safety fundamentals, fire extinguisher use, and emergency evacuation procedures', 8, 12, true),
  ('cb000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'PPE Usage & Compliance', 'SAFETY', 'Personal protective equipment selection, usage, and maintenance', 4, 12, true),
  ('cb000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Customer Interaction & Safety', 'BEHAVIORAL', 'Safe customer interaction protocols at retail outlets', 4, 24, true),
  ('cb000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'SOP Compliance - Retail', 'SOP', 'Standard operating procedures for retail outlet operations', 8, 12, true),
  ('cb000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Emergency Response', 'EMERGENCY', 'Emergency response procedures including spill management and first aid', 8, 12, true),
  ('cb000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Defensive Driving', 'DRIVING', 'Defensive driving techniques for tanker and delivery vehicle operators', 16, 24, true),
  ('cb000007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Tanker Operations Safety', 'TANKER', 'Safe loading, transport, and decantation procedures for fuel tankers', 16, 12, true),
  ('cb000008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'Retail Outlet Operations', 'RETAIL', 'Complete retail outlet management and operations training', 24, 24, true),
  ('cb000009-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'LPG Safe Handling', 'LPG', 'LPG cylinder handling, storage, and delivery safety procedures', 8, 12, true),
  ('cb000010-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'Annual Safety Refresher', 'REFRESHER', 'Annual refresher on all safety protocols and procedures', 4, 12, true);

-- ============================================================
-- 9. INSPECTION TEMPLATES
-- ============================================================
INSERT INTO inspection_templates (id, organization_id, name, category, division_type, questions, is_active) VALUES
  ('cc000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Retail Outlet Safety Checklist', 'Safety', 'RETAIL', 
   '[
     {"key":"ppe","text":"PPE worn by all personnel","category":"PPE","required":true,"allow_photo":true,"allow_comment":true,"order":1},
     {"key":"uniform","text":"Proper uniform worn","category":"PPE","required":true,"allow_photo":true,"allow_comment":true,"order":2},
     {"key":"fire_ext","text":"Fire extinguishers in place and valid","category":"Fire Safety","required":true,"allow_photo":true,"allow_comment":true,"order":3},
     {"key":"emergency_equip","text":"Emergency equipment accessible","category":"Emergency","required":true,"allow_photo":true,"allow_comment":true,"order":4},
     {"key":"safety_signage","text":"Safety signage visible and intact","category":"Signage","required":true,"allow_photo":true,"allow_comment":true,"order":5},
     {"key":"no_smoking","text":"No smoking policy enforced","category":"Safety","required":true,"allow_photo":true,"allow_comment":true,"order":6},
     {"key":"housekeeping","text":"Housekeeping standards maintained","category":"Housekeeping","required":true,"allow_photo":true,"allow_comment":true,"order":7},
     {"key":"electrical","text":"Electrical safety standards met","category":"Electrical","required":true,"allow_photo":true,"allow_comment":true,"order":8},
     {"key":"forecourt","text":"Forecourt safety measures in place","category":"Forecourt","required":true,"allow_photo":true,"allow_comment":true,"order":9},
     {"key":"tanker_dec","text":"Tanker decantation procedures followed","category":"Operations","required":false,"allow_photo":true,"allow_comment":true,"order":10},
     {"key":"emergency_proc","text":"Emergency procedure displayed and known","category":"Emergency","required":true,"allow_photo":true,"allow_comment":true,"order":11},
     {"key":"customer_safety","text":"Customer safety measures in place","category":"Customer","required":true,"allow_photo":true,"allow_comment":true,"order":12},
     {"key":"sop_compliance","text":"SOP compliance verified","category":"SOP","required":true,"allow_photo":true,"allow_comment":true,"order":13}
   ]', true),
  ('cc000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'LPG Delivery Safety Checklist', 'Safety', 'LPG_DISTRIBUTION',
   '[
     {"key":"delivery_ppe","text":"Delivery personnel wearing PPE","category":"PPE","required":true,"allow_photo":true,"allow_comment":true,"order":1},
     {"key":"cylinder_handling","text":"Proper cylinder handling observed","category":"Handling","required":true,"allow_photo":true,"allow_comment":true,"order":2},
     {"key":"vehicle_condition","text":"Delivery vehicle in safe condition","category":"Vehicle","required":true,"allow_photo":true,"allow_comment":true,"order":3},
     {"key":"safe_delivery","text":"Safe delivery procedure followed","category":"Delivery","required":true,"allow_photo":true,"allow_comment":true,"order":4},
     {"key":"leakage_check","text":"Leakage check performed","category":"Safety","required":true,"allow_photo":true,"allow_comment":true,"order":5},
     {"key":"customer_demo","text":"Customer safety demonstration given","category":"Customer","required":true,"allow_photo":true,"allow_comment":true,"order":6},
     {"key":"emergency_aware","text":"Emergency awareness confirmed","category":"Emergency","required":true,"allow_photo":true,"allow_comment":true,"order":7},
     {"key":"documentation","text":"Proper documentation maintained","category":"Documentation","required":true,"allow_photo":true,"allow_comment":true,"order":8},
     {"key":"delivery_behavior","text":"Professional delivery behavior observed","category":"Behavioral","required":true,"allow_photo":true,"allow_comment":true,"order":9}
   ]', true);

-- ============================================================
-- 10. VEHICLES
-- ============================================================
INSERT INTO vehicles (id, organization_id, vehicle_number, vehicle_type, contractor_id, fitness_expiry, insurance_expiry, permit_expiry, status) VALUES
  ('cd000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'WB-01-AB-1234', 'TANKER', 'ca000001-0000-0000-0000-000000000001', '2027-06-15', '2027-03-20', '2027-12-31', 'ACTIVE'),
  ('cd000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'WB-01-CD-5678', 'TANKER', 'ca000001-0000-0000-0000-000000000001', '2027-08-10', '2027-05-15', '2027-12-31', 'ACTIVE'),
  ('cd000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'WB-02-EF-9012', 'TRUCK', 'ca000002-0000-0000-0000-000000000002', '2027-04-20', '2027-02-28', '2027-12-31', 'ACTIVE'),
  ('cd000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'WB-03-GH-3456', 'LPG_DELIVERY', 'ca000002-0000-0000-0000-000000000002', '2027-09-01', '2027-07-15', '2027-12-31', 'ACTIVE'),
  ('cd000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'OD-01-IJ-7890', 'TANKER', 'ca000003-0000-0000-0000-000000000003', '2027-05-25', '2027-04-10', '2027-12-31', 'ACTIVE'),
  ('cd000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'OD-02-KL-1234', 'LPG_DELIVERY', 'ca000003-0000-0000-0000-000000000003', '2026-11-15', '2027-01-20', '2027-12-31', 'ACTIVE'),
  ('cd000007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'WB-04-MN-5678', 'TANKER', 'ca000001-0000-0000-0000-000000000001', '2026-10-01', '2026-09-15', '2027-12-31', 'UNDER_MAINTENANCE');

-- ============================================================
-- NOTE: Actual user profiles require auth.users records.
-- In a real deployment, seed users via Supabase Auth API
-- or the dashboard. The profiles trigger will auto-create
-- profile rows. Below are sample profile data structures
-- that would be created via the auth flow.
-- ============================================================

-- For demo, you can create users via Supabase Dashboard or
-- use the supabase.auth.admin.createUser() API in a seed script.
-- Each user creation triggers handle_new_user() which creates
-- the profile record.

-- Example: To create the super admin:
-- 1. Create user via Supabase Auth with email: admin@dhruvtrack.com
-- 2. The trigger creates profile with org_id = first org
-- 3. Then INSERT into user_roles to assign SUPER_ADMIN role

-- ============================================================
-- SAMPLE DATA: What would exist after user creation
-- (These are INSERT statements you'd run AFTER creating 
-- the auth.users records with matching IDs)
-- ============================================================

-- To avoid the foreign key constraint on auth.users, this
-- seed file provides the SQL for everything EXCEPT profiles
-- and user_roles. Those must be created via the auth flow
-- or by first inserting into auth.users.

-- A companion TypeScript seed script can be used to create
-- users via the Supabase Admin API.
