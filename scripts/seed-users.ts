/**
 * Dhruv Track — User Seed Script
 * 
 * Run this script to create ~200 demo users via Supabase Admin API.
 * 
 * Usage:
 *   SUPABASE_URL=https://your-project.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
 *   npx tsx scripts/seed-users.ts
 * 
 * Prerequisites:
 *   - Run supabase/migrations/001_schema.sql first
 *   - Run supabase/migrations/002_rls.sql  
 *   - Run supabase/seed.sql (for org, divisions, locations, roles, etc.)
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const ORG_ID = '11111111-1111-1111-1111-111111111111';

// Role IDs (from seed.sql)
const ROLE_IDS: Record<string, string> = {
  SUPER_ADMIN: 'ce000001-0000-0000-0000-000000000001',
  CLIENT_ADMIN: 'ce000002-0000-0000-0000-000000000002',
  REGIONAL_MANAGER: 'ce000003-0000-0000-0000-000000000003',
  AREA_MANAGER: 'ce000004-0000-0000-0000-000000000004',
  FIELD_OFFICER: 'ce000005-0000-0000-0000-000000000005',
  SAFETY_SUPERVISOR: 'ce000006-0000-0000-0000-000000000006',
  TRAINER: 'ce000007-0000-0000-0000-000000000007',
  RO_MANAGER: 'ce000008-0000-0000-0000-000000000008',
  SUPERVISOR: 'ce000009-0000-0000-0000-000000000009',
  EMPLOYEE: 'ce000010-0000-0000-0000-000000000010',
  CUSTOMER_ATTENDANT: 'ce000011-0000-0000-0000-000000000011',
  CONTRACTOR: 'ce000012-0000-0000-0000-000000000012',
  DRIVER: 'ce000013-0000-0000-0000-000000000013',
  LPG_DELIVERY_PERSONNEL: 'ce000014-0000-0000-0000-000000000014',
  AUDITOR: 'ce000015-0000-0000-0000-000000000015',
};

// Location IDs for assignment
const LOCATIONS = [
  'c1000001-0000-0000-0000-000000000001',
  'c1000002-0000-0000-0000-000000000002',
  'c1000003-0000-0000-0000-000000000003',
  'c1000004-0000-0000-0000-000000000004',
  'c1000005-0000-0000-0000-000000000005',
  'c1000006-0000-0000-0000-000000000006',
  'c1000007-0000-0000-0000-000000000007',
  'c1000008-0000-0000-0000-000000000008',
  'c1000009-0000-0000-0000-000000000009',
  'c1000010-0000-0000-0000-000000000010',
  'c1000011-0000-0000-0000-000000000011',
  'c1000012-0000-0000-0000-000000000012',
  'c1000013-0000-0000-0000-000000000013',
  'c1000014-0000-0000-0000-000000000014',
  'c1000015-0000-0000-0000-000000000015',
  'c1000016-0000-0000-0000-000000000016',
];

interface UserSeed {
  name: string;
  email: string;
  role: string;
  employee_id: string;
  location_id?: string;
  division_id?: string;
  region_id?: string;
  area_id?: string;
}

function generateUsers(): UserSeed[] {
  const users: UserSeed[] = [];
  let empCounter = 1;

  const empId = () => `EMP-${String(empCounter++).padStart(4, '0')}`;

  // 2 Super Admins
  users.push({ name: 'Dhruv Chakraborty', email: 'admin@dhruvtrack.com', role: 'SUPER_ADMIN', employee_id: empId() });
  users.push({ name: 'Priya Sharma', email: 'priya.admin@dhruvtrack.com', role: 'SUPER_ADMIN', employee_id: empId() });

  // 3 Client Admins
  users.push({ name: 'Rajesh Gupta', email: 'rajesh.gupta@dhruvtrack.com', role: 'CLIENT_ADMIN', employee_id: empId() });
  users.push({ name: 'Anita Das', email: 'anita.das@dhruvtrack.com', role: 'CLIENT_ADMIN', employee_id: empId() });
  users.push({ name: 'Vikram Singh', email: 'vikram.singh@dhruvtrack.com', role: 'CLIENT_ADMIN', employee_id: empId() });

  // 4 Regional Managers
  const rmNames = ['Suresh Banerjee', 'Meena Patel', 'Arun Mohanty', 'Deepa Reddy'];
  const rmRegions = [
    { region: 'b1000001-0000-0000-0000-000000000001', division: 'd1000001-0000-0000-0000-000000000001' },
    { region: 'b1000002-0000-0000-0000-000000000002', division: 'd1000001-0000-0000-0000-000000000001' },
    { region: 'b1000003-0000-0000-0000-000000000003', division: 'd1000002-0000-0000-0000-000000000002' },
    { region: 'b1000001-0000-0000-0000-000000000001', division: 'd1000003-0000-0000-0000-000000000003' },
  ];
  rmNames.forEach((name, i) => {
    users.push({
      name,
      email: name.toLowerCase().replace(/\s/g, '.') + '@dhruvtrack.com',
      role: 'REGIONAL_MANAGER',
      employee_id: empId(),
      region_id: rmRegions[i].region,
      division_id: rmRegions[i].division,
    });
  });

  // 4 Area Managers
  const amNames = ['Kamal Roy', 'Nandini Ghosh', 'Prakash Swain', 'Ritu Mishra'];
  const amAreas = [
    'a1000001-0000-0000-0000-000000000001',
    'a1000002-0000-0000-0000-000000000002',
    'a1000004-0000-0000-0000-000000000004',
    'a1000006-0000-0000-0000-000000000006',
  ];
  amNames.forEach((name, i) => {
    users.push({
      name,
      email: name.toLowerCase().replace(/\s/g, '.') + '@dhruvtrack.com',
      role: 'AREA_MANAGER',
      employee_id: empId(),
      area_id: amAreas[i],
    });
  });

  // 8 Field Officers
  const foNames = ['Amit Sarkar', 'Bijay Nayak', 'Chandan Mukherjee', 'Debasis Jena', 'Eshan Bhatt', 'Farhan Ali', 'Ganesh Pradhan', 'Harsh Vardhan'];
  foNames.forEach((name, i) => {
    users.push({
      name,
      email: name.toLowerCase().replace(/\s/g, '.') + '@dhruvtrack.com',
      role: 'FIELD_OFFICER',
      employee_id: empId(),
      location_id: LOCATIONS[i % LOCATIONS.length],
    });
  });

  // 7 Safety Supervisors
  const ssNames = ['Indrajit Sen', 'Jayanti Panda', 'Kiran Mahapatra', 'Lakshmi Devi', 'Manoj Tiwari', 'Neha Kumari', 'Om Prakash'];
  ssNames.forEach((name, i) => {
    users.push({
      name,
      email: name.toLowerCase().replace(/\s/g, '.') + '@dhruvtrack.com',
      role: 'SAFETY_SUPERVISOR',
      employee_id: empId(),
      location_id: LOCATIONS[i % LOCATIONS.length],
    });
  });

  // 8 Trainers
  const trNames = ['Pankaj Verma', 'Queenie Fernandes', 'Rakesh Mandal', 'Sunita Bhowmik', 'Tapan Das', 'Uma Shankar', 'Vinod Kumar', 'Wasim Khan'];
  trNames.forEach((name) => {
    users.push({
      name,
      email: name.toLowerCase().replace(/\s/g, '.') + '@dhruvtrack.com',
      role: 'TRAINER',
      employee_id: empId(),
    });
  });

  // 13 RO Managers
  for (let i = 0; i < 13; i++) {
    const roName = `RO Manager ${i + 1}`;
    users.push({
      name: roName,
      email: `ro.manager${i + 1}@dhruvtrack.com`,
      role: 'RO_MANAGER',
      employee_id: empId(),
      location_id: LOCATIONS[i % LOCATIONS.length],
    });
  }

  // 12 Supervisors
  for (let i = 0; i < 12; i++) {
    users.push({
      name: `Supervisor ${i + 1}`,
      email: `supervisor${i + 1}@dhruvtrack.com`,
      role: 'SUPERVISOR',
      employee_id: empId(),
      location_id: LOCATIONS[i % LOCATIONS.length],
    });
  }

  // 60 Employees
  const empFirstNames = ['Rahul', 'Sanjay', 'Mohan', 'Ajay', 'Vijay', 'Ravi', 'Sonu', 'Pappu', 'Bablu', 'Tinku', 'Deepak', 'Sunil', 'Anil', 'Manoj', 'Ashok'];
  const empLastNames = ['Das', 'Roy', 'Mondal', 'Patra', 'Behera', 'Nayak', 'Sahu', 'Mishra', 'Singh', 'Kumar', 'Ghosh', 'Dey', 'Pal', 'Sen', 'Kar'];
  for (let i = 0; i < 60; i++) {
    const fn = empFirstNames[i % empFirstNames.length];
    const ln = empLastNames[Math.floor(i / empFirstNames.length) % empLastNames.length];
    users.push({
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@dhruvtrack.com`,
      role: 'EMPLOYEE',
      employee_id: empId(),
      location_id: LOCATIONS[i % LOCATIONS.length],
    });
  }

  // 50 Customer Attendants
  for (let i = 0; i < 50; i++) {
    const fn = empFirstNames[(i + 3) % empFirstNames.length];
    const ln = empLastNames[(i + 2) % empLastNames.length];
    users.push({
      name: `${fn} ${ln}`,
      email: `ca.${fn.toLowerCase()}.${ln.toLowerCase()}${i}@dhruvtrack.com`,
      role: 'CUSTOMER_ATTENDANT',
      employee_id: empId(),
      location_id: LOCATIONS[i % 13], // Only retail locations
    });
  }

  // 15 Contractors
  for (let i = 0; i < 15; i++) {
    users.push({
      name: `Contractor Staff ${i + 1}`,
      email: `contractor.staff${i + 1}@dhruvtrack.com`,
      role: 'CONTRACTOR',
      employee_id: empId(),
    });
  }

  // 7 Drivers
  const driverNames = ['Kartik Sardar', 'Lalu Yadav Jr', 'Munna Bhai', 'Nanhe Lal', 'Omprakash Yadav', 'Pappu Chauhan', 'Qadir Sheikh'];
  driverNames.forEach((name, i) => {
    users.push({
      name,
      email: name.toLowerCase().replace(/\s/g, '.') + '@dhruvtrack.com',
      role: 'DRIVER',
      employee_id: empId(),
    });
  });

  // 7 LPG Delivery Personnel
  for (let i = 0; i < 7; i++) {
    users.push({
      name: `LPG Delivery ${i + 1}`,
      email: `lpg.delivery${i + 1}@dhruvtrack.com`,
      role: 'LPG_DELIVERY_PERSONNEL',
      employee_id: empId(),
      location_id: LOCATIONS[13 + (i % 3)], // LPG locations
    });
  }

  return users;
}

async function supabaseAdmin(path: string, method: string, body?: unknown) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': SUPABASE_SERVICE_ROLE_KEY!,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} failed: ${res.status} ${text}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

async function createUser(user: UserSeed) {
  try {
    let userId: string;

    try {
      const authRes = await supabaseAdmin('/auth/v1/admin/users', 'POST', {
        email: user.email,
        password: 'DhruvTrack@2024',
        email_confirm: true,
        user_metadata: {
          name: user.name,
          organization_id: ORG_ID,
          employee_id: user.employee_id,
        },
      });
      userId = authRes.id;
    } catch (e: any) {
      // If user already exists, find their ID
      const usersList = await supabaseAdmin(`/auth/v1/admin/users?email=eq.${encodeURIComponent(user.email)}`, 'GET');
      if (usersList?.users?.[0]?.id) {
        userId = usersList.users[0].id;
      } else {
        throw e;
      }
    }

    console.log(`✓ Auth user: ${user.name} (${user.email}) → ${userId}`);

    // Insert or update profile
    const profileData: Record<string, unknown> = {
      id: userId,
      organization_id: ORG_ID,
      employee_id: user.employee_id,
      name: user.name,
      email: user.email,
      status: 'ACTIVE',
    };
    if (user.location_id) profileData.location_id = user.location_id;
    if (user.division_id) profileData.division_id = user.division_id;
    if (user.region_id) profileData.region_id = user.region_id;
    if (user.area_id) profileData.area_id = user.area_id;

    try {
      await supabaseAdmin('/rest/v1/profiles', 'POST', profileData);
    } catch {
      await supabaseAdmin(`/rest/v1/profiles?id=eq.${userId}`, 'PATCH', profileData);
    }

    // Assign role
    const roleId = ROLE_IDS[user.role];
    if (roleId) {
      try {
        await supabaseAdmin('/rest/v1/user_roles', 'POST', {
          user_id: userId,
          role_id: roleId,
          organization_id: ORG_ID,
        });
      } catch {}
      console.log(`  → Role: ${user.role}`);
    }

    return userId;
  } catch (error) {
    console.error(`✗ Failed for ${user.name}: ${error}`);
    return null;
  }
}

async function main() {
  console.log('=== Dhruv Track User Seeding ===');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log('');

  const users = generateUsers();
  console.log(`Total users to create: ${users.length}`);
  console.log('');

  let created = 0;
  let failed = 0;

  for (const user of users) {
    const result = await createUser(user);
    if (result) created++;
    else failed++;

    // Rate limiting: small delay between creates
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log('');
  console.log('=== Seed Complete ===');
  console.log(`Created: ${created}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${users.length}`);
  console.log('');
  console.log('Default password for all users: DhruvTrack@2024');
}

main().catch(console.error);
