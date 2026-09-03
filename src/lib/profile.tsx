import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const ROLES = [
  "Executive / Founder",
  "Manager / Team Lead",
  "Sales / Account Management",
  "Marketing",
  "Product / Project Management",
  "Engineering",
  "HR / People Ops",
  "Finance / Operations",
  "Consultant / Freelancer",
] as const;

export const ORG_TYPES = [
  "Startup",
  "Small Business",
  "Enterprise",
  "Agency / Consultancy",
  "Non-profit / NGO",
  "Government / Public Sector",
  "Education",
  "Healthcare",
] as const;

export type Role = (typeof ROLES)[number];
export type OrgType = (typeof ORG_TYPES)[number];

export interface Profile {
  role: Role;
  orgType: OrgType;
}

const DEFAULT_PROFILE: Profile = { role: "Manager / Team Lead", orgType: "Startup" };
const STORAGE_KEY = "quillmark.profile";

interface ProfileContextValue extends Profile {
  setRole: (role: Role) => void;
  setOrgType: (orgType: OrgType) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Profile>;
      setProfile({
        role: ROLES.includes(parsed.role as Role) ? (parsed.role as Role) : DEFAULT_PROFILE.role,
        orgType: ORG_TYPES.includes(parsed.orgType as OrgType)
          ? (parsed.orgType as OrgType)
          : DEFAULT_PROFILE.orgType,
      });
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  function persist(next: Profile) {
    setProfile(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <ProfileContext.Provider
      value={{
        ...profile,
        setRole: (role) => persist({ ...profile, role }),
        setOrgType: (orgType) => persist({ ...profile, orgType }),
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
