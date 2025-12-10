import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  language?: string; // Language code for transcription (e.g., "en", "ur", "ps")
}

type RecordingState = "idle" | "recording" | "processing";

// Silence detection settings
const SILENCE_THRESHOLD = 0.01; // Audio level below this is considered silence
const SILENCE_DURATION_MS = 3000; // 3 seconds of silence to auto-stop
const MAX_RECORDING_MS = 120000; // 2 minutes max

export function VoiceRecorder({
  onTranscription,
  disabled = false,
  className,
  label = "Record",
  language = "en",
}: VoiceRecorderProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const silenceStartRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const maxDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (maxDurationTimeoutRef.current) {
        clearTimeout(maxDurationTimeoutRef.current);
      }
    };
  }, []);

  // Check for silence
  const checkSilence = useCallback(() => {
    if (!analyserRef.current || state !== "recording") return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength / 255;

    if (average < SILENCE_THRESHOLD) {
      // Silence detected
      if (!silenceStartRef.current) {
        silenceStartRef.current = Date.now();
      } else if (Date.now() - silenceStartRef.current >= SILENCE_DURATION_MS) {
        // 3 seconds of silence - stop recording
        stopRecording();
        return;
      }
    } else {
      // Sound detected - reset silence timer
      silenceStartRef.current = null;
    }

    // Continue checking
    animationFrameRef.current = requestAnimationFrame(checkSilence);
  }, [state]);

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000, // Whisper prefers 16kHz
        },
      });

      // Setup audio analysis for silence detection
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        
        // Close audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        // Cancel silence detection
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        // Process audio
        if (chunksRef.current.length > 0) {
          setState("processing");
          await processAudio();
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setState("recording");
      setPermissionDenied(false);
      silenceStartRef.current = null;

      // Start silence detection
      checkSilence();

      // Set max duration timeout
      maxDurationTimeoutRef.current = setTimeout(() => {
        if (state === "recording") {
          stopRecording();
          toast.info("Maximum recording duration reached");
        }
      }, MAX_RECORDING_MS);

    } catch (error) {
      console.error("Microphone error:", error);
      if ((error as Error).name === "NotAllowedError") {
        setPermissionDenied(true);
        toast.error("Microphone permission denied. Please enable it in your browser settings.");
      } else {
        toast.error("Failed to access microphone");
      }
    }
  };

  const stopRecording = () => {
    if (maxDurationTimeoutRef.current) {
      clearTimeout(maxDurationTimeoutRef.current);
      maxDurationTimeoutRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const processAudio = async () => {
    try {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      
      // Check if we have audio
      if (audioBlob.size === 0) {
        toast.error("No audio recorded");
        setState("idle");
        return;
      }

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", language);

      const response = await api.post("/api/transcribe", formData, {
        headers: {
          // Let the browser set the Content-Type with boundary for FormData
        },
      });

      const data = response.data as { text: string; language?: string; remaining?: number; error?: string };

      if (data.error) {
        toast.error(data.error);
      } else if (data.text) {
        onTranscription(data.text.trim());
        
        // Show remaining minutes if low
        if (data.remaining !== undefined && data.remaining < 30) {
          toast.warning(`${data.remaining} minutes of voice input remaining today`);
        }
      } else {
        toast.info("No speech detected");
      }
    } catch (error: unknown) {
      console.error("Transcription error:", error);
      const axiosError = error as { response?: { status?: number; data?: { error?: string } } };
      if (axiosError.response?.status === 429) {
        toast.error(axiosError.response.data?.error || "Daily voice input limit reached");
      } else {
        toast.error("Failed to transcribe audio");
      }
    } finally {
      setState("idle");
      chunksRef.current = [];
    }
  };

  const handleClick = () => {
    if (state === "recording") {
      stopRecording();
    } else if (state === "idle") {
      startRecording();
    }
  };

  const isDisabled = disabled || state === "processing" || permissionDenied;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={state === "recording" ? "destructive" : "outline"}
          size="icon"
          onClick={handleClick}
          disabled={isDisabled}
          className={cn(
            "relative shrink-0",
            state === "recording" && "animate-pulse",
            className
          )}
          aria-label={state === "recording" ? "Stop recording" : label}
        >
          {state === "processing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : state === "recording" ? (
            <>
              <MicOff className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
            </>
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {permissionDenied
          ? "Microphone access denied"
          : state === "recording"
            ? "Click to stop (auto-stops after 3s silence)"
            : state === "processing"
              ? "Transcribing..."
              : label}
      </TooltipContent>
    </Tooltip>
  );
}
