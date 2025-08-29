
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, Square } from 'lucide-react';
import { Textarea, type TextareaProps } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

interface VoiceEnabledTextareaProps extends TextareaProps {
  name: string;
}

export const VoiceEnabledTextarea = ({ name, ...props }: VoiceEnabledTextareaProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const { setValue } = useFormContext();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setValue(name, props.value + finalTranscript + interimTranscript, { shouldValidate: true });
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
  }, [name, props.value, setValue, toast]);

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
      <Textarea {...props} name={name} />
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
};
