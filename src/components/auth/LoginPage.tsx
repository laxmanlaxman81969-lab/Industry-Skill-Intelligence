import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";
import {
  User,
  Building2,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  KeyRound,
  AlertCircle,
  Loader2,
  Info,
  BrainCircuit,
  TrendingUp,
  Award,
  Settings,
  Briefcase,
} from "lucide-react";
import { AuthService } from "../../services/auth";
import { SkillIntelligenceVisual, IndustrySkillLogo } from "./SkillIntelligenceVisual";

interface LoginPageProps {
  defaultRole?: UserRole;
  onBackToHome: () => void;
  onSuccessNavigate: (role: UserRole) => void;
}

const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string; title: string }> = {
  admin: {
    email: "admin@skillplatform.gov.in",
    password: "Admin@Platform2026",
    title: "Administrator",
  },
  company: {
    email: "hiring@abctech.com",
    password: "Company@Pass2026",
    title: "Employer / Recruiter",
  },
  college: {
    email: "dean@apextech.edu.in",
    password: "College@Pass2026",
    title: "College Academic Dean",
  },
  student: {
    email: "lakshman@skillplatform.edu",
    password: "Student@Pass2026",
    title: "Student",
  },
};

export const LoginPage: React.FC<LoginPageProps> = ({
  defaultRole = "student",
  onBackToHome,
  onSuccessNavigate,
}) => {
  const { loginWithCredentials, setStudentProfile } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<"request" | "reset" | "success">("request");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotToken, setForgotToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [demoGeneratedToken, setDemoGeneratedToken] = useState("");
  const [forgotError, setForgotError] = useState("");

  useEffect(() => {
    setSelectedRole(defaultRole);
  }, [defaultRole]);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Student specific registration fields
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    college: "",
    degree: "B.Tech",
    branch: "Computer Science & Engineering",
    currentYear: "3rd Year",
    graduationYear: "2027",
    targetRole: "Java Backend Developer",
  });

  // Company specific fields
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    industry: "Enterprise Software & SaaS",
    companySize: "500 - 1,000 employees",
    website: "",
    location: "",
  });

  // College specific fields
  const [collegeForm, setCollegeForm] = useState({
    collegeName: "",
    universityAffiliation: "",
    location: "",
    accreditation: "NAAC A++",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!cleanPassword) {
      setErrorMsg("Please enter your password.");
      return;
    }
    if (!cleanEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        const authService = AuthService.getInstance();
        const regName =
          selectedRole === "student"
            ? studentForm.fullName || cleanEmail.split("@")[0]
            : selectedRole === "company"
            ? companyForm.companyName || "Enterprise Partner"
            : selectedRole === "college"
            ? collegeForm.collegeName || "Academic Partner"
            : "Platform Administrator";

        const regResult = await authService.registerUser({
          email: cleanEmail,
          password: cleanPassword,
          name: regName,
          role: selectedRole,
        });

        if (!regResult.success) {
          setErrorMsg(regResult.error || "Registration failed. Please check your details.");
          setIsLoading(false);
          return;
        }

        const loginRes = await loginWithCredentials({
          email: cleanEmail,
          password: cleanPassword,
          role: selectedRole,
          rememberMe,
        });

        if (!loginRes.success) {
          setErrorMsg(loginRes.error || "Account created, but failed to start session.");
          setIsLoading(false);
          return;
        }

        if (selectedRole === "student") {
          setStudentProfile((prev) => ({
            ...prev,
            fullName: studentForm.fullName || regName,
            email: cleanEmail,
            college: studentForm.college || "Apex Institute of Technology",
            degree: studentForm.degree,
            branch: studentForm.branch,
            currentYear: studentForm.currentYear,
            graduationYear: studentForm.graduationYear,
            targetRole: studentForm.targetRole,
            onboardingComplete: false,
          }));
        }

        onSuccessNavigate(selectedRole);
      } else {
        const result = await loginWithCredentials({
          email: cleanEmail,
          password: cleanPassword,
          role: selectedRole,
          rememberMe,
        });

        if (!result.success) {
          setErrorMsg(result.error || "Invalid email or password.");
          setIsLoading(false);
          return;
        }

        if (selectedRole === "student") {
          const userName = result.user?.name || result.session?.user?.name || "Lakshman Reddy";
          setStudentProfile((prev) => ({
            ...prev,
            fullName: userName,
            email: cleanEmail,
          }));
        }

        onSuccessNavigate(selectedRole);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    const creds = DEMO_CREDENTIALS[role];
    try {
      const result = await loginWithCredentials({
        email: creds.email,
        password: creds.password,
        role,
        rememberMe: true,
      });

      if (result.success) {
        onSuccessNavigate(role);
      } else {
        setErrorMsg(result.error || "Demo authentication failed.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Demo login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFill = (role: UserRole) => {
    const creds = DEMO_CREDENTIALS[role];
    setEmail(creds.email);
    setPassword(creds.password);
    setErrorMsg("");
    setSuccessMsg(`Auto-filled demonstration credentials for ${creds.title}.`);
  };

  const handleOpenForgot = () => {
    setForgotEmail(email.trim() || "");
    setForgotToken("");
    setNewPassword("");
    setConfirmPassword("");
    setDemoGeneratedToken("");
    setForgotError("");
    setForgotStep("request");
    setShowForgotModal(true);
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotEmail || !forgotEmail.includes("@")) {
      setForgotError("Please enter a valid registered email address.");
      return;
    }

    const authService = AuthService.getInstance();
    const res = await authService.requestPasswordReset(forgotEmail, selectedRole);

    if (res.demoResetToken) {
      setDemoGeneratedToken(res.demoResetToken);
      setForgotToken(res.demoResetToken);
    }
    setForgotStep("reset");
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotToken.trim()) {
      setForgotError("Please enter the reset token.");
      return;
    }

    if (newPassword.length < 6) {
      setForgotError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match. Please re-type.");
      return;
    }

    const authService = AuthService.getInstance();
    const res = await authService.resetPassword(forgotEmail, forgotToken, newPassword);

    if (res.success) {
      setPassword(newPassword);
      setEmail(forgotEmail);
      setForgotStep("success");
    } else {
      setForgotError(res.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col justify-between font-sans relative">
      {/* Top Navigation Bar - Dedicated Auth Header */}
      <header className="relative z-10 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={onBackToHome}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <IndustrySkillLogo className="w-6 h-6" />
            <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
              INDUSTRY SKILL INTELLIGENCE
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Enterprise
            </span>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Container: Responsive Balanced 2-Column Layout */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* LEFT SIDE: Purpose-Built Animated Visual for Industry Skill Intelligence */}
          <section className="hidden lg:block lg:col-span-7 relative border-r border-slate-200/80 bg-slate-50/30 overflow-hidden">
            <SkillIntelligenceVisual />
          </section>

          {/* RIGHT SIDE: Upgraded Authentication Card */}
          <section className="col-span-1 lg:col-span-5 flex flex-col justify-center px-6 sm:px-10 py-6 sm:py-8 bg-white">
            <div className="w-full max-w-[420px] mx-auto animate-fade-in">
              {/* Brand Header inside form */}
              <div className="mb-5 space-y-1 text-center">
                <div className="inline-flex items-center justify-center space-x-2 mb-1">
                  <IndustrySkillLogo className="w-6 h-6" />
                  <span className="text-xs font-black text-slate-900 tracking-wider">
                    INDUSTRY SKILL INTELLIGENCE
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {isRegistering ? "Create Your Account" : "Welcome Back"}
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {isRegistering
                    ? "Join the platform to begin aligning your skills with industry requirements."
                    : "Sign in to continue your industry-aligned skill development journey."}
                </p>
              </div>

              {/* Role Selector Tabs ("Continue as") */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    CONTINUE AS
                  </label>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                    {selectedRole === "company" ? "EMPLOYER" : selectedRole} PORTAL
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { role: "student" as UserRole, label: "Student", icon: User },
                    { role: "company" as UserRole, label: "Employer", icon: Building2 },
                    { role: "college" as UserRole, label: "College", icon: GraduationCap },
                    { role: "admin" as UserRole, label: "Admin", icon: ShieldCheck },
                  ].map(({ role, label, icon: Icon }) => {
                    const isActive = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role);
                          setIsRegistering(false);
                          setErrorMsg("");
                        }}
                        className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs text-[9px] font-black">
                            ✓
                          </span>
                        )}
                        <Icon className={`w-4 h-4 mb-1 ${isActive ? "text-white" : "text-slate-500"}`} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

          {/* Success Message Alert */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMsg("")}
                className="text-emerald-500 hover:text-emerald-700 ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Validation Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start justify-between">
              <div className="flex items-start space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg("")}
                className="text-rose-500 hover:text-rose-700 ml-2 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sign In / Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                {!isRegistering && (
                  <button
                    type="button"
                    onClick={handleOpenForgot}
                    className="text-[11px] text-slate-500 hover:text-blue-600 transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            {!isRegistering && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 w-3.5 h-3.5"
                  />
                  <span>Remember me on this device</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {rememberMe ? "Persistent (30 Days)" : "Session (24 Hours)"}
                </span>
              </div>
            )}

            {/* Extra Student Registration Fields */}
            {isRegistering && selectedRole === "student" && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="N. Lakshman"
                    value={studentForm.fullName}
                    onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">College</label>
                    <input
                      type="text"
                      required
                      placeholder="Apex Institute"
                      value={studentForm.college}
                      onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Degree</label>
                    <select
                      value={studentForm.degree}
                      onChange={(e) => setStudentForm({ ...studentForm, degree: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="B.Tech">B.Tech</option>
                      <option value="B.E.">B.E.</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="M.Tech">M.Tech</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
                    <input
                      type="text"
                      required
                      value={studentForm.branch}
                      onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      required
                      value={studentForm.graduationYear}
                      onChange={(e) => setStudentForm({ ...studentForm, graduationYear: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Extra Company Registration Fields */}
            {isRegistering && selectedRole === "company" && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="ABC Technologies"
                    value={companyForm.companyName}
                    onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Company Website"
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={companyForm.location}
                    onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Extra College Registration Fields */}
            {isRegistering && selectedRole === "college" && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Apex Institute of Technology"
                    value={collegeForm.collegeName}
                    onChange={(e) => setCollegeForm({ ...collegeForm, collegeName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Affiliated University"
                    value={collegeForm.universityAffiliation}
                    onChange={(e) => setCollegeForm({ ...collegeForm, universityAffiliation: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="NAAC / NBA Accreditation"
                    value={collegeForm.accreditation}
                    onChange={(e) => setCollegeForm({ ...collegeForm, accreditation: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Admin Policy Notice */}
            {selectedRole === "admin" && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Security Policy:</strong> Admin authentication utilizes SHA-256 cryptographic verification and audited sessions. Demo credentials: <code className="bg-blue-100 px-1 rounded">admin@skillplatform.gov.in</code>
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>{isRegistering ? "Complete Registration" : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Account Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              {isRegistering ? (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(true);
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors inline-flex items-center space-x-1"
                  >
                    <span>Create New Account</span>
                    <span>&rarr;</span>
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>

      {/* Forgot Password Flow Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Reset Password</h3>
                  <p className="text-[11px] text-slate-500">Secure SHA-256 credential recovery</p>
                </div>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotError && (
              <div className="my-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotStep === "request" && (
              <form onSubmit={handleRequestReset} className="mt-4 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter the email address associated with your account. A secure reset token will be generated to reset your password.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Generate Reset Token
                </button>
              </form>
            )}

            {forgotStep === "reset" && (
              <form onSubmit={handleResetPasswordSubmit} className="mt-4 space-y-3">
                {demoGeneratedToken && (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                    <div className="font-semibold flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Evaluation Reset Token:</span>
                    </div>
                    <p className="text-[11px] text-blue-700">
                      In this environment, your unguessable one-time token is:
                    </p>
                    <code className="block bg-white px-2.5 py-1.5 rounded-lg border border-blue-300 font-mono text-xs font-bold select-all text-blue-900">
                      {demoGeneratedToken}
                    </code>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reset Token</label>
                  <input
                    type="text"
                    required
                    placeholder="Paste reset token"
                    value={forgotToken}
                    onChange={(e) => setForgotToken(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (min 6 chars)</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Confirm & Update Password
                </button>
              </form>
            )}

            {forgotStep === "success" && (
              <div className="mt-4 space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Password Updated</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your salted password hash has been safely updated. You can now sign in with your new password.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Minimal Dedicated Auth Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>© 2026 AI-Powered Industry Skill Gap & Curriculum Alignment Platform • Secure Environment</p>
      </footer>
    </div>
  );
};
