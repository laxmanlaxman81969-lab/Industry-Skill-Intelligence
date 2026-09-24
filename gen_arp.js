const fs = require('fs');
const path = require('path');

const target = 'c:/sih/src/components/student/AnalysisResultPage.tsx';

// Part 1 - imports and interface
let content = `import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillAnalyzerApi } from '../../services/skillAnalyzerApi';
import { AnalysisRecord } from '../../../server/types';
import { SkillLevel } from '../../types';
import {
  ArrowLeft, FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  Target, Zap, SlidersHorizontal, Download, AlertCircle, FileCheck2, Check,
  Briefcase, GraduationCap, FolderGit2, Loader2, ShieldCheck, User
} from 'lucide-react';

interface AnalysisResultPageProps {
  analysisId?: string;
  onNavigate?: (view: string) => void;
  onNavigateToRoadmap?: () => void;
  onNavigateBack?: () => void;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({
  analysisId, onNavigate, onNavigateToRoadmap, onNavigateBack
}) => {
  const { studentProfile, setStudentProfile, addSkillToRoadmap, latestAnalysis, setLatestAnalysis } = useApp();

  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisRecord | null>(() => {
    if (latestAnalysis && (!analysisId || latestAnalysis.analysisId === analysisId)) return latestAnalysis;
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!currentAnalysis && Boolean(analysisId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'gaps-only' | 'matched-only'>('all');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [skillSyncChoices, setSkillSyncChoices] = useState<Record<string, { level: SkillLevel; selected: boolean }>>({});
`;
fs.writeFileSync(target, content, 'utf8');
console.log('Part1 done');
