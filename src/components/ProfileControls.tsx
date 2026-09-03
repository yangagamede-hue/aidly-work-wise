import { Building2, UserRound } from "lucide-react";
import { FieldLabel } from "@/components/AppShell";
import { ORG_TYPES, ROLES, useProfile, type OrgType, type Role } from "@/lib/profile";

const selectClass =
  "w-full appearance-none rounded-xl border border-border bg-surface/80 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/30";

export function ProfileControls({ compact = false }: { compact?: boolean }) {
  const { role, orgType, setRole, setOrgType } = useProfile();

  return (
    <div className={compact ? "flex flex-col gap-3" : "grid gap-4 sm:grid-cols-2"}>
      <div>
        <FieldLabel>
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="size-3.5" /> Your role
          </span>
        </FieldLabel>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className={selectClass}
          aria-label="Your role within the organisation"
        >
          {ROLES.map((r) => (
            <option key={r} value={r} className="bg-surface">
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel>
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="size-3.5" /> Organisation type
          </span>
        </FieldLabel>
        <select
          value={orgType}
          onChange={(e) => setOrgType(e.target.value as OrgType)}
          className={selectClass}
          aria-label="Type of organisation"
        >
          {ORG_TYPES.map((o) => (
            <option key={o} value={o} className="bg-surface">
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function ProfileBadge() {
  const { role, orgType } = useProfile();
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70">Workspace</p>
      <p className="mt-1 text-sm font-semibold leading-tight text-foreground">{role}</p>
      <p className="text-xs text-muted-foreground">{orgType}</p>
    </div>
  );
}
