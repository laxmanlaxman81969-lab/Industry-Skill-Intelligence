// Camera & Hardware Media Stream Service
// Ensures video element correctly renders live candidate stream without white/blank frames

export type CameraState =
  | 'CAMERA_INITIALIZING'
  | 'CAMERA_ACTIVE'
  | 'CAMERA_BLOCKED'
  | 'CAMERA_DISCONNECTED'
  | 'CAMERA_ERROR';

export interface CameraConnectionResult {
  stream: MediaStream | null;
  videoTrack: MediaStreamTrack | null;
  audioTrack: MediaStreamTrack | null;
  success: boolean;
  cameraState: CameraState;
  videoLabel?: string;
  audioLabel?: string;
  error?: string;
}

export class CameraService {
  private static instance: CameraService;
  private currentStream: MediaStream | null = null;
  private videoTrack: MediaStreamTrack | null = null;
  private audioTrack: MediaStreamTrack | null = null;
  private cameraState: CameraState = 'CAMERA_INITIALIZING';
  private onTrackEndedCallback: ((type: 'camera' | 'microphone') => void) | null = null;
  private onStateChangeCallback: ((state: CameraState) => void) | null = null;

  private constructor() {}

  public static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  public getCameraState(): CameraState {
    return this.cameraState;
  }

  public setStateChangeListener(callback: (state: CameraState) => void) {
    this.onStateChangeCallback = callback;
  }

  private setCameraState(state: CameraState) {
    this.cameraState = state;
    this.onStateChangeCallback?.(state);
  }

  public setTrackEndedListener(callback: (type: 'camera' | 'microphone') => void) {
    this.onTrackEndedCallback = callback;
  }

  public async requestMediaAccess(): Promise<CameraConnectionResult> {
    this.stopAll();
    this.setCameraState('CAMERA_INITIALIZING');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.setCameraState('CAMERA_ERROR');
        return {
          stream: null,
          videoTrack: null,
          audioTrack: null,
          success: false,
          cameraState: 'CAMERA_ERROR',
          error: 'Browser does not support media device streaming.'
        };
      }

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.currentStream = stream;

      const vTracks = stream.getVideoTracks();
      const aTracks = stream.getAudioTracks();

      this.videoTrack = vTracks.length > 0 ? vTracks[0] : null;
      this.audioTrack = aTracks.length > 0 ? aTracks[0] : null;

      // Attach track ended listeners
      if (this.videoTrack) {
        this.videoTrack.onended = () => {
          this.setCameraState('CAMERA_DISCONNECTED');
          this.onTrackEndedCallback?.('camera');
        };
      }
      if (this.audioTrack) {
        this.audioTrack.onended = () => {
          this.onTrackEndedCallback?.('microphone');
        };
      }

      this.setCameraState('CAMERA_ACTIVE');

      return {
        stream,
        videoTrack: this.videoTrack,
        audioTrack: this.audioTrack,
        success: true,
        cameraState: 'CAMERA_ACTIVE',
        videoLabel: this.videoTrack?.label || 'Webcam Stream',
        audioLabel: this.audioTrack?.label || 'Microphone Stream'
      };
    } catch (err: any) {
      let state: CameraState = 'CAMERA_ERROR';
      let errorMsg = err.message || 'Failed to acquire media stream.';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        state = 'CAMERA_BLOCKED';
        errorMsg = 'Permission denied: Please grant camera and microphone access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        state = 'CAMERA_DISCONNECTED';
        errorMsg = 'No camera or microphone hardware device found on this system.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        state = 'CAMERA_BLOCKED';
        errorMsg = 'Camera or microphone is already in use by another application or tab.';
      }

      this.setCameraState(state);

      return {
        stream: null,
        videoTrack: null,
        audioTrack: null,
        success: false,
        cameraState: state,
        error: errorMsg
      };
    }
  }

  public attachStreamToVideoElement(videoElement: HTMLVideoElement | null, stream: MediaStream | null): Promise<boolean> {
    return new Promise((resolve) => {
      if (!videoElement || !stream) {
        resolve(false);
        return;
      }

      try {
        // Correctly configure properties before assigning srcObject
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.muted = true;

        if (videoElement.srcObject !== stream) {
          videoElement.srcObject = stream;
        }

        // Explicitly trigger play to handle strict browser autoplay restrictions
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Wait for metadata / dimensions to ensure it's not a white frame
              if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                resolve(true);
              } else {
                videoElement.onloadedmetadata = () => {
                  resolve(videoElement.videoWidth > 0 && videoElement.videoHeight > 0);
                };
                // Fallback timeout
                setTimeout(() => resolve(videoElement.videoWidth > 0), 400);
              }
            })
            .catch((err) => {
              console.warn('Explicit video play notice:', err);
              // Retry with muted guarantee
              videoElement.muted = true;
              videoElement.play().then(() => resolve(true)).catch(() => resolve(false));
            });
        } else {
          resolve(true);
        }
      } catch (e) {
        console.error('Error attaching stream to video element:', e);
        resolve(false);
      }
    });
  }

  public getTrackHealth(): { cameraOk: boolean; micOk: boolean } {
    const cameraOk =
      this.videoTrack !== null &&
      this.videoTrack.readyState === 'live' &&
      this.videoTrack.enabled;

    const micOk =
      this.audioTrack !== null &&
      this.audioTrack.readyState === 'live' &&
      this.audioTrack.enabled;

    return { cameraOk, micOk };
  }

  public setCameraEnabled(enabled: boolean) {
    if (this.videoTrack) {
      this.videoTrack.enabled = enabled;
    }
  }

  public setMicEnabled(enabled: boolean) {
    if (this.audioTrack) {
      this.audioTrack.enabled = enabled;
    }
  }

  public getStream(): MediaStream | null {
    return this.currentStream;
  }

  public stopAll() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      this.currentStream = null;
    }
    this.videoTrack = null;
    this.audioTrack = null;
  }
}
