'use client';

import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
}

export default function VoiceInput({
  onTranscript,
  placeholder = 'Tap to speak',
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    setIsListening(true);
    setShowModal(true);
    setTranscript('');

    // Mock speech recognition (in production, this would use BHASHINI API)
    setTimeout(() => {
      const mockTranscripts = [
        '123456789',
        '987654321',
        '555555555',
        'मेरा UAN नंबर एक दो तीन चार पांच छह सात आठ नौ है',
      ];
      const randomTranscript =
        mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setTranscript(randomTranscript);
      setIsListening(false);

      // Auto-close modal and send transcript after 1 second
      setTimeout(() => {
        setShowModal(false);
        // Extract numbers if Hindi transcription
        const extractedUAN = randomTranscript.match(/\d{9}/)?.[0] || randomTranscript;
        onTranscript(extractedUAN);
      }, 1000);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setShowModal(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={startListening}
        className="shrink-0"
        aria-label="Voice input"
      >
        <Mic className="w-4 h-4" />
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Voice Input
              <Badge variant="outline" className="text-xs">
                🇮🇳 BHASHINI Demo
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Speak your UAN number in English or Hindi
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            {isListening ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 animate-ping">
                    <div className="w-20 h-20 rounded-full bg-danger-400 opacity-75"></div>
                  </div>
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-danger-500">
                    <Mic className="w-10 h-10 text-white" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">
                  Listening...
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-secondary-100">
                  <MicOff className="w-10 h-10 text-secondary-600" />
                </div>
                {transcript && (
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Transcribed:</p>
                    <p className="font-medium text-lg">{transcript}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
            <p>
              <strong>Production Integration:</strong> Uses BHASHINI (India's National Language Translation Mission) for multilingual speech recognition.
            </p>
            <p>Supports 22 Indian languages including Hindi, Tamil, Bengali, Telugu, Marathi, and more.</p>
          </div>

          <Button
            onClick={stopListening}
            variant="outline"
            className="w-full"
            disabled={isListening}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
