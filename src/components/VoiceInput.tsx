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
import { DEMO_UANS } from '@/lib/claim-session';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
}

export default function VoiceInput({
  onTranscript,
  placeholder = 'Tap to speak',
}: VoiceInputProps) {
  const { t } = useLanguage();
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
        ...DEMO_UANS.slice(0, 3),
        'मेरा UAN नंबर एक दो तीन चार पांच छह सात आठ नौ शून्य एक दो है',
      ];
      const randomTranscript =
        mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setTranscript(randomTranscript);
      setIsListening(false);

      // Auto-close modal and send transcript after 1 second
      setTimeout(() => {
        setShowModal(false);
        // Extract numbers if Hindi transcription
        const extractedUAN = randomTranscript.match(/\d{12}/)?.[0] || randomTranscript;
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
        className="shrink-0 border-2"
        aria-label="Voice input"
      >
        <Mic className="w-4 h-4" />
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2">
              {t('voice_input_title')}
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-300">
                {t('mock_preview_badge')}
              </Badge>
            </DialogTitle>
            <DialogDescription>{t('voice_input_desc')}</DialogDescription>
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
                  {t('voice_listening')}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-secondary-100">
                  <MicOff className="w-10 h-10 text-secondary-600" />
                </div>
                {transcript && (
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">{t('voice_transcribed')}</p>
                    <p className="font-medium text-lg">{transcript}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>{t('voice_input_note')}</p>
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
