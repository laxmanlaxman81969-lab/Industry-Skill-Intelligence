import React, { useEffect, useRef, useState } from 'react';
import { InterviewerVisualState } from '../../../services/aiInterview/types';
import { Volume2, Mic, Sparkles, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';

interface AIVoiceInterviewerProps {
  visualState: InterviewerVisualState;
  isSpeaking: boolean;
  candidateAudioLevel?: number; // 0 to 100 from student's mic
  currentQuestionText?: string;
  skillTested?: string;
  targetRole?: string;
  interviewerName?: string;
  statusSubtitle?: string;
}

export const AIVoiceInterviewer: React.FC<AIVoiceInterviewerProps> = ({
  visualState,
  isSpeaking,
  candidateAudioLevel = 0,
  currentQuestionText,
  skillTested,
  targetRole = 'Java Backend Developer',
  interviewerName = 'AI Technical Interviewer',
  statusSubtitle
}) => {
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>(new Array(28).fill(0.1));
  const animFrameRef = useRef<number | null>(null);

  // Dynamic real-time waveform generator
  useEffect(() => {
    let phase = 0;

    const updateWaveform = () => {
      phase += 0.08;

      if (isSpeaking) {
        // Dynamic multi-frequency voice speech envelope
        const newAmps = waveAmplitudes.map((_, i) => {
          const normIdx = i / 28;
          const centerWeight = Math.sin(normIdx * Math.PI);
          const f1 = Math.sin(phase * 2.2 + i * 0.45);
          const f2 = Math.cos(phase * 1.5 + i * 0.3);
          const amp = Math.max(0.12, Math.min(1.0, (f1 * 0.45 + f2 * 0.35 + 0.5) * centerWeight * 0.95 + 0.15));
          return amp;
        });
        setWaveAmplitudes(newAmps);
      } else if (visualState === 'LISTENING') {
        // Waveform driven by student's real microphone level (0 - 100)
        const micFactor = Math.min(1.0, Math.max(0.08, candidateAudioLevel / 75));
        const newAmps = waveAmplitudes.map((_, i) => {
          const centerWeight = Math.sin((i / 28) * Math.PI);
          const jitter = Math.sin(phase * 3.5 + i * 0.7) * 0.35;
          const amp = Math.max(0.08, Math.min(0.95, (micFactor + jitter * micFactor) * centerWeight + 0.08));
          return amp;
        });
        setWaveAmplitudes(newAmps);
      } else if (visualState === 'THINKING' || visualState === 'PROCESSING_ANSWER') {
        // Smooth scanning pulse across waveform
        const scanPos = (Math.sin(phase * 0.8) + 1) * 0.5 * 28;
        const newAmps = waveAmplitudes.map((_, i) => {
          const dist = Math.abs(i - scanPos);
          const wave = Math.max(0.1, Math.exp(-dist * 0.35) * 0.75 + 0.1);
          return wave;
        });
        setWaveAmplitudes(newAmps);
      } else {
        // Resting baseline
        setWaveAmplitudes(new Array(28).fill(0.1));
      }

      animFrameRef.current = requestAnimationFrame(updateWaveform);
    };

    animFrameRef.current = requestAnimationFrame(updateWaveform);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isSpeaking, visualState, candidateAudioLevel]);

  // Status badge config
  const getStatusBadge = () => {
    switch (visualState) {
      case 'SPEAKING':
        return {
          icon: <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />,
          label: 'AI Interviewer Speaking',
          sub: 'Listen carefully to the question',
          colorClass: 'bg-blue-900/60 text-blue-200 border-blue-500/40',
          waveColor: 'bg-blue-500'
        };
      case 'LISTENING':
        return {
          icon: <Mic className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />,
          label: 'Listening to Candidate',
          sub: candidateAudioLevel > 14 ? 'Receiving voice answer...' : 'Awaiting candidate voice...',
          colorClass: 'bg-emerald-900/60 text-emerald-200 border-emerald-500/40',
          waveColor: 'bg-emerald-400'
        };
      case 'THINKING':
      case 'PROCESSING_ANSWER':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />,
          label: 'Analyzing Response...',
          sub: 'Evaluating key technical concepts',
          colorClass: 'bg-amber-900/60 text-amber-200 border-amber-500/40',
          waveColor: 'bg-amber-400'
        };
      case 'FOLLOW_UP':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />,
          label: 'Contextual Follow-Up',
          sub: 'Formulating in-depth probe',
          colorClass: 'bg-indigo-900/60 text-indigo-200 border-indigo-500/40',
          waveColor: 'bg-indigo-400'
        };
      case 'CONNECTION_ISSUE':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'Audio Stream Interrupted',
          sub: 'Re-establishing voice connection',
          colorClass: 'bg-rose-900/60 text-rose-200 border-rose-500/40',
          waveColor: 'bg-rose-400'
        };
      default:
        return {
          icon: <span className="w-2 h-2 rounded-full bg-slate-400" />,
          label: 'AI Ready / Attentive',
          sub: 'Voice interview session active',
          colorClass: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
          waveColor: 'bg-slate-400'
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-md flex flex-col justify-between p-6 select-none">
      {/* Top Header: Identity & State Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-white flex items-center space-x-2 shadow-xs">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>{interviewerName}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Role: <strong className="text-slate-200">{targetRole}</strong>
          </span>
        </div>

        <div className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors duration-200 ${badge.colorClass}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Center: Professional Audio Waveform Visualizer */}
      <div className="my-auto flex flex-col items-center justify-center space-y-4 py-4">
        {/* Animated Sound Bars */}
        <div className="flex items-center justify-center space-x-1.5 h-16 w-full max-w-md px-4">
          {waveAmplitudes.map((amp, idx) => (
            <div
              key={idx}
              className={`w-1.5 rounded-full transition-all duration-75 ${badge.waveColor}`}
              style={{
                height: `${Math.max(6, amp * 56)}px`,
                opacity: Math.max(0.35, amp)
              }}
            />
          ))}
        </div>

        {/* Live Question / Status Display */}
        <div className="text-center max-w-lg px-4 space-y-1">
          {currentQuestionText ? (
            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed line-clamp-3">
              "{currentQuestionText}"
            </p>
          ) : (
            <p className="text-xs text-slate-400 font-medium italic">
              {statusSubtitle || badge.sub}
            </p>
          )}

          {skillTested && (
            <div className="inline-flex items-center space-x-1.5 pt-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Evaluating Skill:</span>
              <span className="text-[11px] font-semibold text-blue-400">{skillTested}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer: Operational Indicators */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Real-time Voice Analysis</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-400 animate-pulse' : visualState === 'LISTENING' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-slate-300">{badge.sub}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
