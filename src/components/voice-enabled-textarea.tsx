

'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, Square } from 'lucide-react';
import { Textarea, type TextareaProps } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

interface VoiceEnabledTextareaProps extends TextareaProps {
  name: string;
}

export const VoiceEnabledTextarea = forwardRef<HTMLTextAreaElement, VoiceEnabledTextareaProps>(({ name, ...props }, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const { setValue, getValues } = useFormContext();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const existingText = getValues(name) || '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setValue(name, existingText + finalTranscript + ' ', { shouldValidate: true });
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({ title: 'Voice Error', description: `Could not recognize speech: ${event.error}`, variant: 'destructive' });
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [name, setValue, toast, getValues]);

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
        toast({ title: 'Browser Not Supported', description: 'Your browser does not support voice recognition.', variant: 'destructive'});
        return;
    }
    
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };
  
  return (
    <div className="relative">
      <Textarea {...props} name={name} ref={ref} />
      {recognitionRef.current && (
          <Button
            type="button"
            size="icon"
            variant={isRecording ? 'destructive' : 'ghost'}
            className="absolute bottom-2 right-2 h-8 w-8"
            onClick={handleToggleRecording}
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
          </Button>
      )}
    </div>
  );
});
VoiceEnabledTextarea.displayName = 'VoiceEnabledTextarea';
