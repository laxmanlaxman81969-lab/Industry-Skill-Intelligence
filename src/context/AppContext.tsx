import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  StudentProfile,
  IndustrySkill,
  CompanyProfile,
  JobRequirement,
  CollegeProfile,
  CurriculumCourse,
  RoadmapStep,
  Assignment,
  InterviewResult,
  StudentSkill,
  SkillLevel
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_INDUSTRY_SKILLS,
  INITIAL_COMPANIES,
  INITIAL_JOB_REQUIREMENTS,
  INITIAL_COLLEGE_PROFILE,
  INITIAL_CURRICULUM_COURSES,
  INITIAL_ROADMAP_STEPS,
  INITIAL_ASSIGNMENTS
} from '../data/seedData';

interface AppContextType {
  currentUser: User | null;
  activeRole: UserRole | 'guest';
  studentProfile: StudentProfile;
  industrySkills: IndustrySkill[];
  companies: CompanyProfile[];
  jobs: JobRequirement[];
  collegeProfile: CollegeProfile;
  curriculum: CurriculumCourse[];
  roadmap: RoadmapStep[];
  assignments: Assignment[];
  interviewResults: InterviewResult[];
  isPrototypeData: boolean;
  demandLastUpdated: string;
  login: (role: UserRole, email?: string) => void;
  logout: () => void;
  setStudentProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  updateStudentSkills: (skills: StudentSkill[]) => void;
  addSkillToRoadmap: (skillName: string) => void;
  completeRoadmapStep: (stepId: string) => void;
  submitAssignment: (assignmentId: string, code: string, repoUrl: string) => Assignment['feedback'] | undefined;
  saveInterviewResult: (result: InterviewResult) => void;
  postJob: (job: Omit<JobRequirement, 'id' | 'postedDate' | 'applicantsCount'>) => void;
  updateIndustrySkill: (id: string, updates: Partial<IndustrySkill>) => void;
  addIndustrySkill: (skill: Omit<IndustrySkill, 'id'>) => void;
  togglePrototypeLabel: () => void;
  calculateReadiness: (skills: StudentSkill[], targetRole: string, companyName?: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'campus_radar_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with local storage fallback
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : null;
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_student`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
  });

  const [industrySkills, setIndustrySkills] = useState<IndustrySkill[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_skills`);
    return saved ? JSON.parse(saved) : INITIAL_INDUSTRY_SKILLS;
  });

  const [companies, setCompanies] = useState<CompanyProfile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_companies`);
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [jobs, setJobs] = useState<JobRequirement[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_jobs`);
    return saved ? JSON.parse(saved) : INITIAL_JOB_REQUIREMENTS;
  });

  const [collegeProfile] = useState<CollegeProfile>(INITIAL_COLLEGE_PROFILE);
  const [curriculum, setCurriculum] = useState<CurriculumCourse[]>(INITIAL_CURRICULUM_COURSES);

  const [roadmap, setRoadmap] = useState<RoadmapStep[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_roadmap`);
    return saved ? JSON.parse(saved) : INITIAL_ROADMAP_STEPS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_assignments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [interviewResults, setInterviewResults] = useState<InterviewResult[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_interviews`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isPrototypeData, setIsPrototypeData] = useState<boolean>(true);
  const [demandLastUpdated] = useState<string>('September 12, 2026');

  // Persistence effects
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_student`, JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_skills`, JSON.stringify(industrySkills));
  }, [industrySkills]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_jobs`, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_roadmap`, JSON.stringify(roadmap));
  }, [roadmap]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_assignments`, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_interviews`, JSON.stringify(interviewResults));
  }, [interviewResults]);

  // Dynamic Career Readiness Engine
  const calculateReadiness = (skills: StudentSkill[], targetRole: string, companyName?: string): number => {
    // 1. Get role-specific required skills from industry demand and company benchmarks
    const relevantSkills = industrySkills.filter(
      (s) => s.role.toLowerCase() === targetRole.toLowerCase() || s.role === 'Java Backend Developer'
    );

    if (relevantSkills.length === 0) return 60;

    let totalWeight = 0;
    let earnedWeight = 0;

    relevantSkills.forEach((req) => {
      const weight = req.importance === 'Critical' ? 15 : req.importance === 'High' ? 10 : 5;
      totalWeight += weight;

      const studentHas = skills.find(
        (s) => s.name.toLowerCase() === req.name.toLowerCase()
      );

      if (studentHas) {
        let multiplier = 0.5; // Beginner
        if (studentHas.level === 'Intermediate') multiplier = 0.8;
        if (studentHas.level === 'Advanced') multiplier = 1.0;
        if (studentHas.verified) multiplier = Math.min(1.0, multiplier + 0.1);

        earnedWeight += weight * multiplier;
      }
    });

    let score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 50;

    // Company specific weighting adjustment if selected
    if (companyName) {
      const companyJob = jobs.find(j => j.companyName.toLowerCase() === companyName.toLowerCase());
      if (companyJob) {
        let compEarned = 0;
        let compTotal = 0;
        companyJob.requiredSkills.forEach(req => {
          compTotal += req.weight;
          const match = skills.find(s => s.name.toLowerCase() === req.skill.toLowerCase());
          if (match) {
            const levelFactor = match.level === req.level ? 1.0 : (match.level === 'Advanced' ? 1.0 : 0.6);
            compEarned += req.weight * levelFactor;
          }
        });
        const compScore = compTotal > 0 ? Math.round((compEarned / compTotal) * 100) : score;
        score = Math.round((score * 0.6) + (compScore * 0.4));
      }
    }

    return Math.min(99, Math.max(15, score));
  };

  const login = (role: UserRole, email?: string) => {
    const userMatch = INITIAL_USERS.find((u) => u.role === role);
    if (userMatch) {
      const activeUser: User = {
        ...userMatch,
        email: email || userMatch.email
      };
      setCurrentUser(activeUser);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateStudentSkills = (newSkills: StudentSkill[]) => {
    setStudentProfile((prev) => {
      const updatedReadiness = calculateReadiness(newSkills, prev.targetRole, prev.targetCompany);
      return {
        ...prev,
        skills: newSkills,
        overallReadiness: updatedReadiness
      };
    });
  };

  const addSkillToRoadmap = (skillName: string) => {
    // Check if skill already exists in roadmap
    const exists = roadmap.some((r) => r.title.toLowerCase().includes(skillName.toLowerCase()));
    if (!exists) {
      const newStep: RoadmapStep = {
        id: `rd-custom-${Date.now()}`,
        stepNumber: roadmap.length + 1,
        title: `Mastery of ${skillName}`,
        category: 'Skill Gap Priority',
        skillsCovered: [skillName],
        currentLevel: 'None',
        targetLevel: 'Intermediate',
        industryDemand: 82,
        whyYouNeedIt: `Addressing identified gap in ${skillName} required by enterprise hiring requisitions.`,
        difficulty: 'Intermediate',
        estimatedHours: 20,
        resources: [
          { title: `${skillName} Official Documentation & Starter Guides`, type: 'Documentation', url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' official documentation')}`, duration: '8 hours' }
        ],
        practiceTask: `Complete hands-on implementation project incorporating ${skillName}.`,
        suggestedProject: `${skillName} Enterprise Component`,
        status: 'in-progress'
      };
      setRoadmap((prev) => [...prev, newStep]);
    }
  };

  const completeRoadmapStep = (stepId: string) => {
    setRoadmap((prev) =>
      prev.map((step) => {
        if (step.id === stepId) {
          return { ...step, status: 'completed' };
        }
        return step;
      })
    );
  };

  // AI Evaluation logic for Assignment submission
  const submitAssignment = (assignmentId: string, code: string, repoUrl: string) => {
    const hasKeywords = code.includes('class') || code.includes('return') || code.includes('@') || repoUrl.length > 5;
    const lengthScore = Math.min(30, Math.floor(code.length / 15));

    const technicalCorrectness = hasKeywords ? Math.min(95, 70 + lengthScore) : 45;
    const conceptUnderstanding = hasKeywords ? Math.min(92, 68 + lengthScore) : 50;
    const codeQuality = code.includes('//') || code.includes('/*') || code.includes('public') ? 85 : 72;
    const problemSolving = hasKeywords ? 84 : 55;
    const overallScore = Math.round(
      (technicalCorrectness + conceptUnderstanding + codeQuality + problemSolving) / 4
    );

    const feedback = {
      technicalCorrectness,
      conceptUnderstanding,
      codeQuality,
      problemSolving,
      whatYouDidWell: [
        'Structured modular decomposition conforming to REST architectural constraints',
        'Clean naming conventions with appropriate method and endpoint encapsulation',
        'Demonstrated understanding of HTTP status codes and parameter mapping'
      ],
      whatToImprove: [
        'Incorporate explicit Bean validation (@NotNull, @Size) on incoming DTO objects',
        'Add standardized global error handler (@ControllerAdvice) for edge case null checks',
        'Increase test coverage for negative assertion scenarios'
      ],
      whatToLearnNext: [
        'Spring Boot Global Exception Handling with ProblemDetails RFC 7807',
        'Stateless JWT Token Interceptors',
        'Integration Testing using Testcontainers'
      ]
    };

    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id === assignmentId) {
          return {
            ...asg,
            completed: true,
            score: overallScore,
            feedback
          };
        }
        return asg;
      })
    );

    // Feed result back into Student Skills & Roadmap!
    const targetAsg = assignments.find((a) => a.id === assignmentId);
    if (targetAsg) {
      setStudentProfile((prev) => {
        const existingSkill = prev.skills.find(
          (s) => s.name.toLowerCase() === targetAsg.targetSkill.toLowerCase()
        );
        let updatedSkills: StudentSkill[];
        if (existingSkill) {
          updatedSkills = prev.skills.map((s) =>
            s.name.toLowerCase() === targetAsg.targetSkill.toLowerCase()
              ? { ...s, level: 'Intermediate' as SkillLevel, verified: true, verifiedSource: 'assignment' as const }
              : s
          );
        } else {
          updatedSkills = [
            ...prev.skills,
            {
              name: targetAsg.targetSkill,
              category: 'Backend',
              level: 'Intermediate',
              verified: true,
              verifiedSource: 'assignment'
            }
          ];
        }

        const newReadiness = calculateReadiness(updatedSkills, prev.targetRole, prev.targetCompany);

        return {
          ...prev,
          skills: updatedSkills,
          overallReadiness: newReadiness
        };
      });
    }

    return feedback;
  };

  const saveInterviewResult = (result: InterviewResult) => {
    setInterviewResults((prev) => [result, ...prev]);

    // Update student skills based on interview performance
    setStudentProfile((prev) => {
      let updatedSkills = [...prev.skills];
      result.claimedSkillsAnalysis.forEach((analysis) => {
        const matchIndex = updatedSkills.findIndex(
          (s) => s.name.toLowerCase() === analysis.skill.toLowerCase()
        );
        if (matchIndex >= 0) {
          if (analysis.status === 'Verified') {
            updatedSkills[matchIndex] = {
              ...updatedSkills[matchIndex],
              verified: true,
              verifiedSource: 'interview'
            };
          }
        }
      });

      const updatedReadiness = calculateReadiness(updatedSkills, prev.targetRole, prev.targetCompany);

      return {
        ...prev,
        skills: updatedSkills,
        overallReadiness: Math.max(prev.overallReadiness, updatedReadiness)
      };
    });
  };

  const postJob = (newJobData: Omit<JobRequirement, 'id' | 'postedDate' | 'applicantsCount'>) => {
    const newJob: JobRequirement = {
      ...newJobData,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0
    };

    setJobs((prev) => [newJob, ...prev]);

    // Update industry skill demand dynamically based on new job!
    setIndustrySkills((prev) => {
      return prev.map((skill) => {
        const requiredInNewJob = newJob.requiredSkills.some(
          (rs) => rs.skill.toLowerCase() === skill.name.toLowerCase()
        );
        if (requiredInNewJob) {
          return {
            ...skill,
            demandScore: Math.min(99, skill.demandScore + 1),
            totalObservations: skill.totalObservations + 1
          };
        }
        return skill;
      });
    });
  };

  const updateIndustrySkill = (id: string, updates: Partial<IndustrySkill>) => {
    setIndustrySkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : s))
    );
  };

  const addIndustrySkill = (newSkill: Omit<IndustrySkill, 'id'>) => {
    const created: IndustrySkill = {
      ...newSkill,
      id: `isk-${Date.now()}`
    };
    setIndustrySkills((prev) => [created, ...prev]);
  };

  const togglePrototypeLabel = () => {
    setIsPrototypeData((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole: currentUser?.role || 'guest',
        studentProfile,
        industrySkills,
        companies,
        jobs,
        collegeProfile,
        curriculum,
        roadmap,
        assignments,
        interviewResults,
        isPrototypeData,
        demandLastUpdated,
        login,
        logout,
        setStudentProfile,
        updateStudentSkills,
        addSkillToRoadmap,
        completeRoadmapStep,
        submitAssignment,
        saveInterviewResult,
        postJob,
        updateIndustrySkill,
        addIndustrySkill,
        togglePrototypeLabel,
        calculateReadiness
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
