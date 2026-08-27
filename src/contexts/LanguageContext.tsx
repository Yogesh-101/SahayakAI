'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sahayak-language') as Language | null;
    if (saved && (saved === 'en' || saved === 'hi')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sahayak-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

// ── Translations ────────────────────────────────────────────────────────────

const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    app_name: 'SahayakAI',
    demo_mode: 'Demo Mode',
    back_to_home: 'Back to Home',
    check_another_claim: 'Check Another Claim',

    // Homepage
    hero_title: 'Track Your EPFO Claim in Real Time',
    hero_subtitle:
      'AI-powered insights and WhatsApp notifications for PF withdrawals, loans, and pensions',
    cta_check_status: 'Check Claim Status',
    cta_view_demo: 'View Demo',
    stat_claims_tracked: 'Claims Tracked',
    stat_avg_resolution: 'Avg. Resolution Time',
    stat_success_rate: 'Success Rate',
    disclaimer:
      'Demo Mode: Using mock EPFO data. Not affiliated with Government of India.',

    // Claim Check Page
    check_title: 'Check Your EPFO Claim Status',
    check_subtitle:
      'Enter your Universal Account Number to track your claim in real time.',
    uan_label: 'UAN (Universal Account Number)',
    uan_placeholder: 'Enter UAN (e.g., 123456789)',
    check_button: 'Check Status',
    checking: 'Checking...',
    demo_uans: 'Demo UANs — try these:',

    // Claim Detail Page
    claim_type: 'Claim Type',
    amount: 'Amount',
    filed_on: 'Filed On',
    employer: 'Employer',
    estimated_settlement: 'Estimated settlement:',
    settled_message: 'has been credited to your bank account.',
    claim_progress: 'Claim Progress',
    claim_progress_subtitle: 'Real-time status across all processing stages',

    // Claim Types
    claim_type_withdrawal: 'PF Withdrawal',
    claim_type_loan: 'PF Loan',
    claim_type_pension: 'Pension',

    // Stages
    stage_employer_approval: 'Employer Approval',
    stage_kyc_verification: 'KYC Verification',
    stage_epfo_sanction: 'EPFO Sanction',
    stage_payment_processing: 'Payment Processing',

    // Status
    status_pending: 'Pending',
    status_in_progress: 'In Progress',
    status_completed: 'Completed',
    status_blocked: 'Blocked',
    status_settled: 'Settled',

    // Diagnosis
    diagnosis_title: 'AI Diagnosis',
    issue_detected: 'Issue Detected',
    confidence: 'Confidence:',
    show_resolution: 'Show Resolution Steps',
    hide_resolution: 'Hide Resolution Steps',
    running_diagnosis: 'Running AI diagnosis...',

    // WhatsApp
    whatsapp_title: 'WhatsApp Notifications',
    whatsapp_subtitle:
      'Real-time alerts sent directly to your phone (India Stack integration)',
    whatsapp_demo_badge: 'DEMO',
    whatsapp_integration_note:
      'Production Integration: Uses India Stack\'s WhatsApp Business API for real-time notifications.',
    whatsapp_benefit:
      'Citizens receive updates at every stage without checking the portal.',

    // Error Messages
    error_claim_not_found: 'Claim Not Found',
    error_try_another_uan: 'Try Another UAN',
    error_diagnosis_failed: 'Could not run diagnosis',
    error_try_again: 'Please try again later',
  },

  hi: {
    // General
    app_name: 'सहायकAI',
    demo_mode: 'डेमो मोड',
    back_to_home: 'होम पर जाएं',
    check_another_claim: 'दूसरा दावा जांचें',

    // Homepage
    hero_title: 'अपने EPFO दावे को रियल टाइम में ट्रैक करें',
    hero_subtitle:
      'PF निकासी, ऋण और पेंशन के लिए AI-संचालित जानकारी और WhatsApp सूचनाएं',
    cta_check_status: 'दावा स्थिति जांचें',
    cta_view_demo: 'डेमो देखें',
    stat_claims_tracked: 'ट्रैक किए गए दावे',
    stat_avg_resolution: 'औसत समाधान समय',
    stat_success_rate: 'सफलता दर',
    disclaimer:
      'डेमो मोड: मॉक EPFO डेटा का उपयोग। भारत सरकार से संबद्ध नहीं।',

    // Claim Check Page
    check_title: 'अपने EPFO दावे की स्थिति जांचें',
    check_subtitle:
      'अपने दावे को रियल टाइम में ट्रैक करने के लिए अपना यूनिवर्सल अकाउंट नंबर दर्ज करें।',
    uan_label: 'UAN (यूनिवर्सल अकाउंट नंबर)',
    uan_placeholder: 'UAN दर्ज करें (जैसे, 123456789)',
    check_button: 'स्थिति जांचें',
    checking: 'जांच रहे हैं...',
    demo_uans: 'डेमो UAN - इन्हें आजमाएं:',

    // Claim Detail Page
    claim_type: 'दावा प्रकार',
    amount: 'राशि',
    filed_on: 'दाखिल किया गया',
    employer: 'नियोक्ता',
    estimated_settlement: 'अनुमानित निपटान:',
    settled_message: 'आपके बैंक खाते में जमा किया गया है।',
    claim_progress: 'दावा प्रगति',
    claim_progress_subtitle: 'सभी प्रोसेसिंग चरणों में रियल-टाइम स्थिति',

    // Claim Types
    claim_type_withdrawal: 'PF निकासी',
    claim_type_loan: 'PF ऋण',
    claim_type_pension: 'पेंशन',

    // Stages
    stage_employer_approval: 'नियोक्ता की स्वीकृति',
    stage_kyc_verification: 'KYC सत्यापन',
    stage_epfo_sanction: 'EPFO मंजूरी',
    stage_payment_processing: 'भुगतान प्रक्रिया',

    // Status
    status_pending: 'लंबित',
    status_in_progress: 'प्रगति में',
    status_completed: 'पूर्ण',
    status_blocked: 'अवरुद्ध',
    status_settled: 'निपटा हुआ',

    // Diagnosis
    diagnosis_title: 'AI निदान',
    issue_detected: 'समस्या का पता चला',
    confidence: 'विश्वास:',
    show_resolution: 'समाधान चरण दिखाएं',
    hide_resolution: 'समाधान चरण छिपाएं',
    running_diagnosis: 'AI निदान चल रहा है...',

    // WhatsApp
    whatsapp_title: 'WhatsApp सूचनाएं',
    whatsapp_subtitle:
      'सीधे आपके फोन पर रियल-टाइम अलर्ट (India Stack एकीकरण)',
    whatsapp_demo_badge: 'डेमो',
    whatsapp_integration_note:
      'उत्पादन एकीकरण: रियल-टाइम सूचनाओं के लिए India Stack के WhatsApp Business API का उपयोग करता है।',
    whatsapp_benefit:
      'नागरिकों को पोर्टल की जांच किए बिना हर चरण पर अपडेट मिलता है।',

    // Error Messages
    error_claim_not_found: 'दावा नहीं मिला',
    error_try_another_uan: 'दूसरा UAN आजमाएं',
    error_diagnosis_failed: 'निदान नहीं चल सका',
    error_try_again: 'कृपया बाद में पुनः प्रयास करें',
  },
};
