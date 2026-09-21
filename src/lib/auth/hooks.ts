'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Profile, RoleName } from '@/lib/types/database';
import { hasPermission, type Permission } from '@/lib/auth/permissions';

const supabase = createClient();

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setLoading(false);
          return;
        }
      } catch {
        // Continue to check demo mode
      }

      if (typeof window !== 'undefined') {
        const demo = localStorage.getItem('dhruv_demo_user');
        if (demo) {
          try {
            const parsed = JSON.parse(demo);
            setUser({
              id: parsed.id || '11111111-2222-3333-4444-555555555555',
              email: parsed.email || 'admin@dhruvtrack.com',
              app_metadata: {},
              user_metadata: { name: parsed.name || 'Demo Administrator' },
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            } as User);
            setLoading(false);
            return;
          } catch {}
        }
      }

      setUser(null);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function useProfile() {
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfile(data as Profile);
          setLoading(false);
          return;
        }
      } catch {}

      // Fallback demo profile
      if (typeof window !== 'undefined') {
        const demo = localStorage.getItem('dhruv_demo_user');
        const role = localStorage.getItem('dhruv_demo_role') as RoleName || 'SUPER_ADMIN';
        const parsed = demo ? JSON.parse(demo) : {};
        setProfile({
          id: user.id,
          organization_id: '11111111-1111-1111-1111-111111111111',
          employee_id: 'EMP-0001',
          name: parsed.name || 'Dhruv Administrator',
          email: user.email || 'admin@dhruvtrack.com',
          mobile: '+91 9876543210',
          avatar_url: null,
          division_id: null,
          region_id: null,
          area_id: null,
          location_id: null,
          manager_id: null,
          supervisor_id: null,
          employment_type: 'PERMANENT',
          contractor_id: null,
          joining_date: '2024-01-01',
          status: 'ACTIVE',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Profile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, userLoading]);

  return { profile, loading: loading || userLoading, user };
}

export function useRole() {
  const { user } = useUser();
  const [role, setRole] = useState<RoleName | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role_id, roles(name)')
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (!error && data) {
          const roleData = data as unknown as { role_id: string; roles: { name: RoleName } };
          if (roleData.roles?.name) {
            setRole(roleData.roles.name);
            setLoading(false);
            return;
          }
        }
      } catch {}

      if (typeof window !== 'undefined') {
        const demoRole = localStorage.getItem('dhruv_demo_role') as RoleName;
        if (demoRole) {
          setRole(demoRole);
          setLoading(false);
          return;
        }
      }

      setRole('SUPER_ADMIN');
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  return { role, loading };
}

export function usePermissions() {
  const { role, loading } = useRole();

  const can = useCallback(
    (permission: Permission) => {
      if (!role) return false;
      return hasPermission(role, permission);
    },
    [role]
  );

  const canAny = useCallback(
    (permissions: Permission[]) => {
      if (!role) return false;
      return permissions.some((p) => hasPermission(role, p));
    },
    [role]
  );

  return { role, can, hasPermission: can, canAny, loading };
}

export function useOrganization() {
  const { profile, loading } = useProfile();
  const [org, setOrg] = useState<{ id: string; name: string; logo_url: string | null; primary_color: string } | null>(
    { id: '11111111-1111-1111-1111-111111111111', name: 'Dhruv Track Energy', logo_url: null, primary_color: '#1e40af' }
  );

  useEffect(() => {
    if (!profile) return;

    const fetchOrg = async () => {
      try {
        const { data } = await supabase
          .from('organizations')
          .select('id, name, logo_url, primary_color')
          .eq('id', profile.organization_id)
          .single();

        if (data) setOrg(data);
      } catch {}
    };

    fetchOrg();
  }, [profile]);

  return { organization: org, loading };
}
