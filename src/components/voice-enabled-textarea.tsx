
'use client';

import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VoiceEnabledTextareaProps extends TextareaProps {}

export const VoiceEnabledTextarea = React.forwardRef<HTMLTextAreaElement, VoiceEnabledTextareaProps>(
  ({ className, value, onChange, ...props }, ref) => {
  const [isListening, setIsListening] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsAvailable(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const existingValue = typeof value === 'string' ? value : '';
        const newValue = existingValue + finalTranscript;

        // Create a synthetic event to pass to the parent's onChange handler
        const syntheticEvent = {
          target: { value: newValue }
        } as React.ChangeEvent<HTMLTextAreaElement>;

        onChange?.(syntheticEvent);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: `An error occurred: ${event.error}. Please try again.`,
          variant: "destructive",
        })
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }

     return () => {
      // Cleanup function to stop recognition when the component unmounts.
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [onChange, toast, value]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isAvailable) {
    return <Textarea ref={ref} className={className} value={value} onChange={onChange} {...props} />;
  }

  return (
    <div className="relative w-full">
      <Textarea
        ref={ref}
        className={cn("pr-12", className)}
        value={value}
        onChange={onChange}
        {...props}
      />
      <Button
        type="button"
        size="icon"
        variant={isListening ? 'destructive' : 'outline'}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
        onClick={toggleListening}
      >
        {isListening ? (
          <Square className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
        <span className="sr-only">{isListening ? "Stop listening" : "Start listening"}</span>
      </Button>
    </div>
  );
});
VoiceEnabledTextarea.displayName = "VoiceEnabledTextarea";
