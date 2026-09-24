import React, { useRef, useEffect, useState, useCallback } from 'react';
import { InterviewerVisualState, InterviewerPersona } from '../../../services/aiInterview/types';
import { VisemeEngine, VisemeTarget } from '../../../services/aiInterview/visemeEngine';
import { Volume2, Headphones, Sparkles, RefreshCw, AlertTriangle, UserCheck, ShieldCheck } from 'lucide-react';

interface AIInterviewerVideoProps {
  persona: InterviewerPersona;
  visualState: InterviewerVisualState;
  isSpeaking: boolean;
  candidateAudioLevel?: number; // 0 to 100 from student's mic
  currentSkillTested?: string;
  targetRole?: string;
  onPersonaChange?: (newPersonaId: string) => void;
  onRetryConnection?: () => void;
  onContinueWithText?: () => void;
}

interface PersonaCropAndGeometry {
  // Source crop window in original 1024x1024 image for broadcast head+shoulders framing
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
  // Normalized facial landmarks relative to cropped viewport (0 to 1)
  mouthX: number;
  mouthY: number;
  mouthW: number;         // Half-width of resting mouth
  upperLipY: number;
  lowerLipY: number;
  chinY: number;
  leftCheekX: number;
  rightCheekX: number;
  cheekY: number;
  eyeLeftX: number;
  eyeRightX: number;
  eyeY: number;
  // Persona skin and lip tones
  skinTone: string;
  lipColor: string;
  lipInnerColor: string;
  creaseColor: string;
}

const PERSONA_CONFIG: Record<string, PersonaCropAndGeometry> = {
  'dr-sarah-vance': {
    // 960x540 crop from 1024x1024: Head & Shoulders framing (chest up to hair)
    cropX: 32,
    cropY: 65,
    cropW: 960,
    cropH: 540,
    mouthX: 0.500,
    mouthY: 0.560,
    mouthW: 0.068,
    upperLipY: 0.548,
    lowerLipY: 0.572,
    chinY: 0.655,
    leftCheekX: 0.405,
    rightCheekX: 0.595,
    cheekY: 0.510,
    eyeLeftX: 0.442,
    eyeRightX: 0.558,
    eyeY: 0.395,
    skinTone: 'rgb(228, 192, 175)',
    lipColor: 'rgba(195, 115, 110, 0.95)',
    lipInnerColor: 'rgba(165, 85, 80, 0.98)',
    creaseColor: 'rgba(125, 82, 70, 0.55)'
  },
  'david-chen': {
    cropX: 32,
    cropY: 75,
    cropW: 960,
    cropH: 540,
    mouthX: 0.500,
    mouthY: 0.575,
    mouthW: 0.072,
    upperLipY: 0.562,
    lowerLipY: 0.588,
    chinY: 0.675,
    leftCheekX: 0.400,
    rightCheekX: 0.600,
    cheekY: 0.520,
    eyeLeftX: 0.438,
    eyeRightX: 0.562,
    eyeY: 0.410,
    skinTone: 'rgb(212, 175, 152)',
    lipColor: 'rgba(178, 110, 95, 0.95)',
    lipInnerColor: 'rgba(148, 80, 68, 0.98)',
    creaseColor: 'rgba(115, 75, 60, 0.60)'
  }
};

export const AIInterviewerVideo: React.FC<AIInterviewerVideoProps> = ({
  persona,
  visualState,
  isSpeaking,
  candidateAudioLevel = 0,
  currentSkillTested,
  targetRole = 'Java Backend Developer',
  onRetryConnection,
  onContinueWithText
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Animation physics state
  const animFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const nodProgressRef = useRef<number>(0);
  const lastNodTimeRef = useRef<number>(0);

  // Natural blinking with random interval & double-blink
  const nextBlinkTimeRef = useRef<number>(performance.now() + 3200);
  const blinkProgressRef = useRef<number>(0);
  const isDoubleBlinkRef = useRef<boolean>(false);

  // Eye micro-saccades
  const eyeSaccadeXRef = useRef<number>(0);
  const eyeSaccadeYRef = useRef<number>(0);
  const nextSaccadeTimeRef = useRef<number>(performance.now() + 2500);

  // Thinking posture
  const thinkingPhaseRef = useRef<number>(0);
  const speakingAccentRef = useRef<number>(0);

  // Pre-load portrait image
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = persona.imageSrc;

    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };

    img.onerror = () => {
      console.warn(`Failed to load interviewer portrait: ${persona.imageSrc}`);
      setImageError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [persona.imageSrc]);

  // Main 60FPS physiological synthesis loop
  const renderFrame = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      const img = imageRef.current;

      if (!canvas || !img || !imageLoaded) {
        animFrameId.current = requestAnimationFrame(renderFrame);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const delta = Math.min(100, now - lastTimeRef.current);
      lastTimeRef.current = now;

      const width = canvas.width;
      const height = canvas.height;
      const cfg = PERSONA_CONFIG[persona.id] || PERSONA_CONFIG['dr-sarah-vance'];

      // Poll real-time Viseme Engine
      const visemeEngine = VisemeEngine.getInstance();
      const viseme: VisemeTarget = visemeEngine.update(now);

      // ─────────────────────────────────────────────────────────────
      // 1. ORGANIC HUMAN MOTION & HEAD/BODY SWAY
      // ─────────────────────────────────────────────────────────────
      // Continuous organic respiratory oscillation (~0.22 Hz)
      const breathing = Math.sin(now * 0.0014) * 2.4;
      // Natural subtle posture sway
      const microSwayX = Math.sin(now * 0.0009) * 2.0 + Math.cos(now * 0.0018) * 1.0;
      let headTilt = Math.sin(now * 0.0007) * 0.012;

      // ─────────────────────────────────────────────────────────────
      // 2. ACTIVE LISTENING: ATTENTIVE FORWARD LEAN & CONVERSATIONAL NODS
      // ─────────────────────────────────────────────────────────────
      let forwardScale = 1.0;
      if (visualState === 'LISTENING') {
        forwardScale = 1.022; // Attentive lean toward camera
        headTilt += 0.010;

        // When candidate speaks, trigger realistic conversational nods
        if (candidateAudioLevel > 14) {
          if (now - lastNodTimeRef.current > 3600 && nodProgressRef.current <= 0) {
            nodProgressRef.current = 1.0;
            lastNodTimeRef.current = now;
          }
        }
      }

      let nodOffsetY = 0;
      if (nodProgressRef.current > 0) {
        nodProgressRef.current -= delta * 0.0015;
        if (nodProgressRef.current < 0) nodProgressRef.current = 0;
        const p = 1.0 - nodProgressRef.current;
        nodOffsetY = Math.sin(p * Math.PI * 2) * 5.5 * Math.exp(-p * 1.4);
      }

      // ─────────────────────────────────────────────────────────────
      // 3. THINKING: LATERAL TILT & REFLECTIVE GAZE SHIFT
      // ─────────────────────────────────────────────────────────────
      let thinkingShiftX = 0;
      let thinkingShiftY = 0;
      if (visualState === 'THINKING' || visualState === 'PROCESSING_ANSWER') {
        thinkingPhaseRef.current += delta * 0.0018;
        headTilt = 0.028 * Math.sin(thinkingPhaseRef.current * 0.7);
        thinkingShiftX = 3.5 * Math.sin(thinkingPhaseRef.current * 0.6);
        thinkingShiftY = -2.0;
      } else {
        thinkingPhaseRef.current = 0;
      }

      // ─────────────────────────────────────────────────────────────
      // 4. NATURAL HUMAN BLINKING & EYE SACCADES
      // ─────────────────────────────────────────────────────────────
      if (now > nextBlinkTimeRef.current && blinkProgressRef.current <= 0) {
        blinkProgressRef.current = 1.0;
        // 12% probability of quick double-blink
        isDoubleBlinkRef.current = Math.random() < 0.12;
        const nextInterval = isDoubleBlinkRef.current ? 350 : 2800 + Math.random() * 3200;
        nextBlinkTimeRef.current = now + nextInterval;
      }

      let blinkAmount = 0;
      if (blinkProgressRef.current > 0) {
        blinkProgressRef.current -= delta * 0.0085;
        if (blinkProgressRef.current < 0) blinkProgressRef.current = 0;
        // Asymmetric blink: fast eyelid drop, smooth lift
        const p = 1.0 - blinkProgressRef.current;
        blinkAmount = Math.sin(p * Math.PI);
      }

      // Subtle eye micro-saccades
      if (now > nextSaccadeTimeRef.current) {
        eyeSaccadeXRef.current = (Math.random() - 0.5) * 1.2;
        eyeSaccadeYRef.current = (Math.random() - 0.5) * 0.8;
        nextSaccadeTimeRef.current = now + 2400 + Math.random() * 2600;
      }

      // ─────────────────────────────────────────────────────────────
      // 5. SPEECH-SYNCHRONIZED HEAD ACCENTS
      // ─────────────────────────────────────────────────────────────
      if (isSpeaking || visualState === 'SPEAKING') {
        // Natural emphasis dips on stressed vowels
        speakingAccentRef.current = viseme.jawOpen * 2.2 * Math.sin(now * 0.012);
      } else {
        speakingAccentRef.current = 0;
      }

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // Combined physiological transform matrix
      const totalShiftX = microSwayX + thinkingShiftX;
      const totalShiftY = breathing + nodOffsetY + thinkingShiftY + speakingAccentRef.current;

      ctx.translate(width / 2 + totalShiftX, height / 2 + totalShiftY);
      if (forwardScale !== 1.0) {
        ctx.scale(forwardScale, forwardScale);
      }
      if (headTilt !== 0) {
        ctx.rotate(headTilt);
      }
      ctx.translate(-width / 2, -height / 2);

      // ─────────────────────────────────────────────────────────────
      // 6. RENDER MASTER PORTRAIT (HEAD & SHOULDERS CAMERA FRAMING)
      // ─────────────────────────────────────────────────────────────
      ctx.drawImage(
        img,
        cfg.cropX,
        cfg.cropY,
        cfg.cropW,
        cfg.cropH,
        0,
        0,
        width,
        height
      );

      // Facial geometry anchors in canvas pixels
      const mouthX = width * cfg.mouthX;
      const mouthY = height * cfg.mouthY;
      const upperLipY = height * cfg.upperLipY;
      const lowerLipY = height * cfg.lowerLipY;
      const chinY = height * cfg.chinY;
      const mouthBaseW = width * cfg.mouthW;

      // Dynamic viseme displacements
      // Jaw drop: up to 13.5px on wide vowels (AA, AE)
      const jawDropPx = viseme.jawOpen * 13.5;
      const chinDropPx = viseme.chinDrop * 9.5;
      // Mouth width: stretches horizontally on IY, AE or narrows on OO, W
      const currentHalfW = mouthBaseW * (1.0 + viseme.mouthWidth * 0.32);
      // Vertical lip aperture
      const lipAperture = Math.max(0, jawDropPx * 0.65);

      // ─────────────────────────────────────────────────────────────
      // 7. MULTI-SLICE ANATOMICAL JAW & CHIN DEFORMATION
      // Slices and displaces the actual photograph pixels of lower face!
      // ─────────────────────────────────────────────────────────────
      if (jawDropPx > 0.4) {
        ctx.save();

        // Sample boundary for lower face (from lower lip level down to neck)
        const sliceStartY = lowerLipY - 2;
        const sliceEndY = Math.min(height, chinY + 55);
        const sliceH = sliceEndY - sliceStartY;
        const sliceW = mouthBaseW * 3.4;
        const sliceLeft = mouthX - sliceW / 2;

        // Clip to chin & jaw contour to ensure seamless blending
        ctx.beginPath();
        ctx.ellipse(
          mouthX,
          sliceStartY + sliceH * 0.45 + chinDropPx * 0.7,
          sliceW * 0.52,
          sliceH * 0.54,
          0,
          0,
          Math.PI * 2
        );
        ctx.clip();

        // Map canvas coordinates to image source crop coordinates
        const scaleX = cfg.cropW / width;
        const scaleY = cfg.cropH / height;

        // Multi-strip vertical stretch for natural skin deformation
        const numStrips = 18;
        const stripHeight = sliceH / numStrips;

        for (let i = 0; i < numStrips; i++) {
          const currentY = sliceStartY + i * stripHeight;
          const progress = i / (numStrips - 1); // 0 at lower lip, 1 at neck

          // Weight: maximum displacement at lower lip & mental crease, smooth ease-out at neck
          let weight = 1.0 - Math.pow(progress, 1.4);
          if (progress > 0.6) {
            weight *= Math.cos(((progress - 0.6) / 0.4) * (Math.PI / 2));
          }

          const stripDisplacement = jawDropPx * weight;

          const srcStripX = (sliceLeft) * scaleX + cfg.cropX;
          const srcStripY = (currentY) * scaleY + cfg.cropY;
          const srcStripW = sliceW * scaleX;
          const srcStripH = (stripHeight + 1.0) * scaleY;

          ctx.drawImage(
            img,
            Math.max(0, srcStripX),
            Math.max(0, srcStripY),
            srcStripW,
            srcStripH,
            sliceLeft,
            currentY + stripDisplacement,
            sliceW,
            stripHeight + 1.0
          );
        }

        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 8. ORAL CAVITY, TEETH, TONGUE & LIP CONTOURS
      // ─────────────────────────────────────────────────────────────
      if (jawDropPx > 0.3) {
        ctx.save();

        const oralCenterY = mouthY + jawDropPx * 0.35;
        const cavityH = Math.max(1.5, lipAperture * 0.75);

        // A. Deep shaded oral cavity interior
        ctx.beginPath();
        ctx.ellipse(
          mouthX,
          oralCenterY,
          currentHalfW * 0.88,
          cavityH,
          0,
          0,
          Math.PI * 2
        );
        const cavityGrad = ctx.createRadialGradient(
          mouthX, oralCenterY - 1, 0,
          mouthX, oralCenterY, currentHalfW * 0.9
        );
        cavityGrad.addColorStop(0, '#220808');
        cavityGrad.addColorStop(0.7, '#140303');
        cavityGrad.addColorStop(1, '#080101');
        ctx.fillStyle = cavityGrad;
        ctx.fill();

        // B. Upper Teeth Row (visible on open vowels & sibilants)
        if (viseme.teethUpperVis > 0.15 && lipAperture > 1.2) {
          ctx.save();
          // Clip teeth inside oral cavity
          ctx.beginPath();
          ctx.ellipse(mouthX, oralCenterY, currentHalfW * 0.86, cavityH, 0, 0, Math.PI * 2);
          ctx.clip();

          const teethW = currentHalfW * 0.78;
          const teethY = oralCenterY - cavityH * 0.45;
          const teethH = Math.min(cavityH * 0.85, 4.8);

          ctx.beginPath();
          ctx.ellipse(mouthX, teethY, teethW, teethH, 0, 0, Math.PI);
          // Natural enamel cream shading with subtle gum occlusion
          const teethGrad = ctx.createLinearGradient(0, teethY - 2, 0, teethY + teethH);
          teethGrad.addColorStop(0, 'rgba(235, 230, 222, 0.95)');
          teethGrad.addColorStop(0.7, 'rgba(248, 246, 242, 0.98)');
          teethGrad.addColorStop(1, 'rgba(215, 208, 198, 0.90)');
          ctx.fillStyle = teethGrad;
          ctx.fill();

          // Subtle interdental separation lines
          ctx.strokeStyle = 'rgba(160, 140, 130, 0.35)';
          ctx.lineWidth = 0.8;
          [-0.45, -0.22, 0, 0.22, 0.45].forEach((offset) => {
            ctx.beginPath();
            ctx.moveTo(mouthX + teethW * offset, teethY);
            ctx.lineTo(mouthX + teethW * offset, teethY + teethH * 0.85);
            ctx.stroke();
          });

          ctx.restore();
        }

        // C. Tongue Articulation (TH, L, AA, AH)
        if (viseme.tonguePose === 'interdental' && lipAperture > 1.5) {
          // TH viseme: tongue tip peeking between teeth
          ctx.beginPath();
          ctx.ellipse(mouthX, oralCenterY + 1.0, currentHalfW * 0.45, cavityH * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(205, 125, 120, 0.92)';
          ctx.fill();
        } else if (viseme.tonguePose === 'floor' && lipAperture > 4.0) {
          // Low tongue visible in floor of mouth
          ctx.beginPath();
          ctx.ellipse(mouthX, oralCenterY + cavityH * 0.5, currentHalfW * 0.65, cavityH * 0.4, 0, Math.PI, Math.PI * 2);
          ctx.fillStyle = 'rgba(185, 105, 100, 0.75)';
          ctx.fill();
        }

        // D. Lower Teeth (visible when jaw drops substantially)
        if (viseme.teethLowerVis > 0.25 && lipAperture > 4.5) {
          const lowerTeethW = currentHalfW * 0.62;
          const lowerTeethY = oralCenterY + cavityH * 0.55;
          ctx.beginPath();
          ctx.ellipse(mouthX, lowerTeethY, lowerTeethW, 2.2, 0, Math.PI, Math.PI * 2);
          ctx.fillStyle = 'rgba(238, 234, 228, 0.85)';
          ctx.fill();
        }

        // E. Upper Lip Vermilion Border (Bézier contour)
        ctx.beginPath();
        const upperArchLift = viseme.lipUpperLift * 2.0;
        ctx.moveTo(mouthX - currentHalfW, upperLipY);
        // Cupid's bow curve
        ctx.bezierCurveTo(
          mouthX - currentHalfW * 0.4, upperLipY - upperArchLift - 1.2,
          mouthX - currentHalfW * 0.15, upperLipY - upperArchLift + 0.5,
          mouthX, upperLipY - upperArchLift
        );
        ctx.bezierCurveTo(
          mouthX + currentHalfW * 0.15, upperLipY - upperArchLift + 0.5,
          mouthX + currentHalfW * 0.4, upperLipY - upperArchLift - 1.2,
          mouthX + currentHalfW, upperLipY
        );
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = cfg.lipColor;
        ctx.stroke();

        // F. Lower Lip Vermilion Border (follows displaced jaw)
        const lowerLipActualY = lowerLipY + jawDropPx * 0.75;
        ctx.beginPath();
        ctx.moveTo(mouthX - currentHalfW * 0.95, lowerLipY + jawDropPx * 0.2);
        ctx.quadraticCurveTo(mouthX, lowerLipActualY + 2.5, mouthX + currentHalfW * 0.95, lowerLipY + jawDropPx * 0.2);
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = cfg.lipColor;
        ctx.stroke();

        // G. Subtle mouth corner shadows (oral commissures)
        ctx.fillStyle = cfg.creaseColor;
        ctx.beginPath();
        ctx.ellipse(mouthX - currentHalfW, upperLipY + 0.5, 1.8, 1.2, 0, 0, Math.PI * 2);
        ctx.ellipse(mouthX + currentHalfW, upperLipY + 0.5, 1.8, 1.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 9. SUBTLE CHEEK TENSION / SPREAD
      // ─────────────────────────────────────────────────────────────
      if (viseme.cheekTension > 0.15) {
        ctx.save();
        const cheekLift = viseme.cheekTension * 1.5;
        const cheekGradL = ctx.createRadialGradient(
          width * cfg.leftCheekX, height * cfg.cheekY - cheekLift, 0,
          width * cfg.leftCheekX, height * cfg.cheekY - cheekLift, 18
        );
        cheekGradL.addColorStop(0, 'rgba(235, 160, 150, 0.12)');
        cheekGradL.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cheekGradL;
        ctx.beginPath();
        ctx.ellipse(width * cfg.leftCheekX, height * cfg.cheekY - cheekLift, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        const cheekGradR = ctx.createRadialGradient(
          width * cfg.rightCheekX, height * cfg.cheekY - cheekLift, 0,
          width * cfg.rightCheekX, height * cfg.cheekY - cheekLift, 18
        );
        cheekGradR.addColorStop(0, 'rgba(235, 160, 150, 0.12)');
        cheekGradR.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cheekGradR;
        ctx.beginPath();
        ctx.ellipse(width * cfg.rightCheekX, height * cfg.cheekY - cheekLift, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 10. REALISTIC EYELID BLINKING
      // ─────────────────────────────────────────────────────────────
      if (blinkAmount > 0.04) {
        const eyeY = height * cfg.eyeY + eyeSaccadeYRef.current;
        const leftEyeX = width * cfg.eyeLeftX + eyeSaccadeXRef.current;
        const rightEyeX = width * cfg.eyeRightX + eyeSaccadeXRef.current;
        const eyeRadX = width * 0.038;
        const eyeRadY = height * 0.016 * blinkAmount;

        ctx.save();
        // Eyelid skin tone matching persona
        ctx.fillStyle = cfg.skinTone;

        // Left eyelid
        ctx.beginPath();
        ctx.ellipse(leftEyeX, eyeY, eyeRadX, eyeRadY, 0, 0, Math.PI * 2);
        ctx.fill();

        // Right eyelid
        ctx.beginPath();
        ctx.ellipse(rightEyeX, eyeY, eyeRadX, eyeRadY, 0, 0, Math.PI * 2);
        ctx.fill();

        // Natural eyelid crease & lash line
        ctx.strokeStyle = cfg.creaseColor;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(leftEyeX - eyeRadX, eyeY);
        ctx.quadraticCurveTo(leftEyeX, eyeY + 1.2, leftEyeX + eyeRadX, eyeY);
        ctx.moveTo(rightEyeX - eyeRadX, eyeY);
        ctx.quadraticCurveTo(rightEyeX, eyeY + 1.2, rightEyeX + eyeRadX, eyeY);
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore(); // Restore transform matrix

      // Soft professional vignette at bottom for subtitle & badge contrast
      const glowGrad = ctx.createLinearGradient(0, height - 70, 0, height);
      glowGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
      glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0.72)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, height - 70, width, 70);

      animFrameId.current = requestAnimationFrame(renderFrame);
    },
    [imageLoaded, visualState, isSpeaking, candidateAudioLevel, persona.id]
  );

  // Animation lifecycle
  useEffect(() => {
    animFrameId.current = requestAnimationFrame(renderFrame);

    const handleVisibility = () => {
      if (document.hidden) {
        if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      } else {
        lastTimeRef.current = performance.now();
        animFrameId.current = requestAnimationFrame(renderFrame);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [renderFrame]);

  // Status badge config
  const getStatusBadge = () => {
    switch (visualState) {
      case 'SPEAKING':
        return {
          icon: <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />,
          label: 'Speaking',
          className: 'bg-blue-900/80 text-blue-200 border-blue-700/60'
        };
      case 'LISTENING':
        return {
          icon: <Headphones className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />,
          label: 'Listening',
          className: 'bg-emerald-900/80 text-emerald-200 border-emerald-700/60'
        };
      case 'THINKING':
      case 'PROCESSING_ANSWER':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />,
          label: 'Thinking...',
          className: 'bg-amber-900/80 text-amber-200 border-amber-700/60'
        };
      case 'FOLLOW_UP':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />,
          label: 'Preparing Follow-Up',
          className: 'bg-indigo-900/80 text-indigo-200 border-indigo-700/60'
        };
      case 'CONNECTION_ISSUE':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'Connection Interrupted',
          className: 'bg-rose-900/80 text-rose-200 border-rose-700/60'
        };
      default:
        return {
          icon: <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />,
          label: 'Ready / Attentive',
          className: 'bg-slate-900/80 text-slate-200 border-slate-700/60'
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-sm flex items-center justify-center select-none">
      {/* 60FPS Viseme & Physiological Video Canvas */}
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className="w-full h-full object-cover"
      />

      {/* Loading Fallback */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-slate-300 space-y-2 p-4 text-center">
          <RefreshCw className="w-7 h-7 animate-spin text-blue-400" />
          <p className="text-xs font-semibold tracking-wide">Connecting to AI Interviewer Video...</p>
          <p className="text-[11px] text-slate-400">Loading professional video presence</p>
        </div>
      )}

      {/* Error Fallback */}
      {imageError && (
        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-slate-300 space-y-3 p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
          <p className="text-xs font-semibold text-slate-200">Interviewer Visual Unavailable</p>
          <div className="flex items-center space-x-2">
            {onRetryConnection && (
              <button
                onClick={onRetryConnection}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
              >
                Retry
              </button>
            )}
            {onContinueWithText && (
              <button
                onClick={onContinueWithText}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium cursor-pointer"
              >
                Continue in Text Mode
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Left: Interviewer Persona Identity */}
      <div className="absolute top-3 left-3 z-10 flex items-center space-x-2">
        <div className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-semibold text-white flex items-center space-x-1.5 shadow-sm">
          <UserCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>{persona.name}</span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">• {persona.title.split(' ')[0]}</span>
        </div>
      </div>

      {/* Top Right: Live Visual State Indicator */}
      <div className="absolute top-3 right-3 z-10">
        <div
          className={`px-2.5 py-1 rounded-lg backdrop-blur-md border text-[11px] font-semibold flex items-center space-x-1.5 shadow-sm transition-colors duration-200 ${badge.className}`}
        >
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Bottom Overlay: Audio Waveform & Skill Context */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Live Audio Waveform when Speaking */}
        {isSpeaking ? (
          <div className="px-3 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-blue-500/50 flex items-center space-x-2 text-[11px] text-blue-200 shadow-sm animate-fade-in">
            <span className="text-[10px] font-semibold text-blue-400 tracking-wider">AI SPEECH</span>
            <div className="flex items-center space-x-1 h-3">
              {[0.4, 0.9, 0.6, 1.0, 0.7, 0.3, 0.8, 0.5, 0.9, 0.4].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-blue-400 rounded-full animate-pulse"
                  style={{
                    height: `${Math.max(3, h * 12)}px`,
                    animationDuration: `${400 + i * 80}ms`
                  }}
                />
              ))}
            </div>
          </div>
        ) : visualState === 'LISTENING' ? (
          <div className="px-3 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-emerald-500/50 flex items-center space-x-2 text-[11px] text-emerald-200 shadow-sm animate-fade-in">
            <span className="text-[10px] font-semibold text-emerald-400 tracking-wider">LISTENING</span>
            <div className="flex items-center space-x-1 h-3">
              {[0.3, 0.5, 0.8, 0.4, 0.6].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-emerald-400 rounded-full transition-all duration-100"
                  style={{
                    height: `${Math.max(3, (candidateAudioLevel / 100) * 12 * h)}px`
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] text-emerald-300/80">
              {candidateAudioLevel > 14 ? 'Receiving voice...' : 'Awaiting answer...'}
            </span>
          </div>
        ) : (
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/70 backdrop-blur-md border border-slate-700/60 text-[10px] text-slate-300 flex items-center space-x-1.5">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span>Target Role: <strong className="text-white font-medium">{targetRole}</strong></span>
          </div>
        )}

        {/* Skill Tested tag */}
        {currentSkillTested && (
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/75 backdrop-blur-md border border-slate-700/60 text-[10px] text-slate-300 flex items-center space-x-1">
            <span className="text-slate-400">Skill:</span>
            <span className="text-blue-400 font-semibold">{currentSkillTested}</span>
          </div>
        )}
      </div>
    </div>
  );
};
