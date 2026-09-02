import { useState } from 'react';
import { Check, ChevronLeft, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { roleLanding, useAuth } from '../app/AuthContext';
import type { Role } from '../types/labflow';

type LoginStep = 'role' | 'credentials';

interface RoleOption {
  id: Role;
  label: string;
  description: string;
  icon: string;
  colorVar: string;
  bgVar: string;
  placeholder: string;
}

const roles: RoleOption[] = [
  {
    id: 'Admin',
    label: 'Administrator',
    description: 'Full system access & configuration',
    icon: '⚙',
    colorVar: '--role-admin',
    bgVar: '--role-admin-bg',
    placeholder: 'admin@labflow.in',
  },
  {
    id: 'Doctor',
    label: 'Doctor',
    description: 'Review results & sign-off reports',
    icon: '🩺',
    colorVar: '--role-doctor',
    bgVar: '--role-doctor-bg',
    placeholder: 'doctor@labflow.in',
  },
  {
    id: 'Receptionist',
    label: 'Receptionist',
    description: 'Patient registration & billing',
    icon: '🗂',
    colorVar: '--role-receptionist',
    bgVar: '--role-receptionist-bg',
    placeholder: 'receptionist@labflow.in',
  },
  {
    id: 'Lab Technician',
    label: 'Lab Technician',
    description: 'Sample processing & result entry',
    icon: '🔬',
    colorVar: '--role-technician',
    bgVar: '--role-technician-bg',
    placeholder: 'technician@labflow.in',
  },
  {
    id: 'Patient',
    label: 'Patient',
    description: 'View reports & booking history',
    icon: '👤',
    colorVar: '--role-patient',
    bgVar: '--role-patient-bg',
    placeholder: 'patient@email.com',
  },
];

const features = [
  'End-to-end test lifecycle management',
  'Real-time sample tracking & status updates',
  'Automated report generation with digital sign-off',
  'Role-based access for complete audit trails',
];

const stats = [
  ['12,400+', 'Tests/month'],
  ['99.8%', 'Uptime'],
  ['<4 min', 'Avg turnaround'],
];

export function Login() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [step, setStep] = useState<LoginStep>('role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const selected = roles.find((role) => role.id === selectedRole);

  const handleContinue = () => {
    if (selectedRole) setStep('credentials');
  };

  const handleLogin = async () => {
    if (!selectedRole || loading) return;
    setLoading(true);
    setError(null);

    try {
      const authenticatedRole = await login(email, password);
      setLoading(false);
      navigate(roleLanding[authenticatedRole]);
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen overflow-hidden bg-surface-muted">
      <section className="relative hidden w-[45%] min-w-[440px] flex-col overflow-hidden bg-sidebar p-12 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              className="absolute rounded-full border border-white"
              key={index}
              style={{
                width: `${(index + 1) * 120}px`,
                height: `${(index + 1) * 120}px`,
                left: '50%',
                top: '60%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="relative z-[1]">
          <div className="mb-16 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[10px] bg-gradient-to-br from-brand-600 to-accent">
              <FlaskConical size={20} />
            </div>
            <div>
              <div className="text-[22px] font-extrabold leading-tight tracking-[-0.5px]">LabFlow</div>
              <div className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.09em] text-[rgb(var(--sidebar-logo-muted))]">Smart Diagnostics</div>
            </div>
          </div>

          <h1 className="mb-4 text-[32px] font-extrabold leading-[1.2] tracking-[-0.8px]">
            Diagnostic excellence,
            <br />
            digitally delivered.
          </h1>
          <p className="mb-12 max-w-[430px] text-[15px] leading-[1.7] text-[rgb(var(--login-panel-copy))]">
            From patient registration to verified lab reports, LabFlow connects every step of your diagnostic workflow in one secure platform.
          </p>

          <div className="grid gap-3.5">
            {features.map((feature) => (
              <div className="flex items-center gap-2.5" key={feature}>
                <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/20 text-accent">
                  <Check size={11} strokeWidth={3} />
                </div>
                <span className="text-[13.5px] text-[rgb(var(--sidebar-text))]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-[1] mt-auto flex gap-8">
          {stats.map(([value, label]) => (
            <div key={label}>
              <div className="text-xl font-extrabold text-white">{value}</div>
              <div className="text-xs text-[rgb(var(--sidebar-logo-muted))]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[480px]">
          {step === 'role' ? (
            <>
              <div className="mb-8">
                <h2 className="mb-1.5 text-2xl font-extrabold tracking-[-0.5px] text-ink">Welcome back</h2>
                <p className="text-sm text-ink-muted">Select your role to continue</p>
              </div>

              <div className="mb-7 flex flex-col gap-2.5">
                {roles.map((role) => {
                  const active = selectedRole === role.id;
                  return (
                    <button
                      className="flex w-full items-center gap-3.5 rounded-[10px] border-2 p-3.5 text-left transition"
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      style={{
                        borderColor: active ? `rgb(var(${role.colorVar}))` : 'rgb(var(--color-border))',
                        background: active ? `rgb(var(${role.bgVar}))` : 'rgb(var(--color-surface))',
                      }}
                      type="button"
                    >
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-ui border text-lg"
                        style={{
                          background: `rgb(var(${role.bgVar}))`,
                          borderColor: `rgb(var(${role.colorVar}) / 0.13)`,
                        }}
                      >
                        {role.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink">{role.label}</span>
                        <span className="mt-px block text-xs text-ink-muted">{role.description}</span>
                      </span>
                      {active ? (
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-white" style={{ background: `rgb(var(${role.colorVar}))` }}>
                          <Check size={11} strokeWidth={3} />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <button
                className="h-[50px] w-full rounded-[10px] text-[15px] font-semibold transition disabled:cursor-not-allowed"
                disabled={!selectedRole}
                onClick={handleContinue}
                type="button"
              >
                <span className={selectedRole ? 'grid h-full place-items-center rounded-[10px] bg-brand-600 text-white' : 'grid h-full place-items-center rounded-[10px] bg-border text-ink-muted'}>
                  Continue →
                </span>
              </button>
            </>
          ) : (
            <>
              <button className="mb-6 flex items-center gap-1.5 p-0 text-[13px] text-ink-muted" onClick={() => setStep('role')} type="button">
                <ChevronLeft size={14} />
                Back to role selection
              </button>

              {selected ? (
                <div
                  className="mb-7 flex items-center gap-3 rounded-[10px] border p-3"
                  style={{
                    background: `rgb(var(${selected.bgVar}))`,
                    borderColor: `rgb(var(${selected.colorVar}) / 0.20)`,
                  }}
                >
                  <span className="text-xl">{selected.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-ink">Signing in as {selected.label}</div>
                    <div className="text-xs text-ink-muted">{selected.description}</div>
                  </div>
                </div>
              ) : null}

              <h2 className="mb-6 text-2xl font-extrabold tracking-[-0.5px] text-ink">Sign in to LabFlow</h2>

              <div className="mb-4">
                <label className="mb-1.5 block text-[13px] font-semibold text-ink" htmlFor="email">Email address</label>
                <input
                  className="h-[44px] w-full rounded-ui border-[1.5px] border-border bg-white px-3.5 text-sm text-ink outline-none focus:border-brand-600"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={selected?.placeholder ?? 'admin@labflow.in'}
                  type="email"
                  value={email}
                />
              </div>

              <div className="mb-6">
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-ink" htmlFor="password">Password</label>
                  <a className="text-xs text-brand-600" href="#">Forgot password?</a>
                </div>
                <input
                  className="h-[44px] w-full rounded-ui border-[1.5px] border-border bg-white px-3.5 text-sm text-ink outline-none focus:border-brand-600"
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleLogin();
                  }}
                  placeholder="••••••••"
                  type="password"
                  value={password}
                />
              </div>

              {error ? <p className="mb-4 text-sm text-danger" role="alert">{error}</p> : null}

              <button
                className="h-[50px] w-full rounded-[10px] text-[15px] font-semibold transition"
                disabled={loading}
                onClick={handleLogin}
                type="button"
              >
                <span className={loading ? 'grid h-full place-items-center rounded-[10px] bg-[rgb(var(--color-muted))] text-ink-muted' : 'grid h-full place-items-center rounded-[10px] bg-brand-600 text-white'}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </span>
              </button>

              <p className="mt-4 text-center text-xs text-ink-muted">Protected by 256-bit TLS encryption · HIPAA compliant</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
