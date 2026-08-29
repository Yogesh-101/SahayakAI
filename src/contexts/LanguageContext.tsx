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
      'AI-powered insights and WhatsApp notifications for PF withdrawal claims',
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
    whatsapp_title: 'WhatsApp Notifications (Mock Preview)',
    whatsapp_subtitle:
      'Simulated alerts — not sent to a real phone',
    whatsapp_demo_badge: 'MOCK PREVIEW',
    whatsapp_integration_note:
      'Mock preview only. In production this would use India Stack\'s WhatsApp Business API.',
    whatsapp_benefit:
      'Shows how citizens could receive updates without checking the portal.',

    // Error Messages
    error_claim_not_found: 'Claim Not Found',
    error_try_another_uan: 'Try Another UAN',
    error_diagnosis_failed: 'Could not run diagnosis',
    error_try_again: 'Please try again later',
    diagnosis_rule_based: 'Rule-based demo mode',
    diagnosis_gpt_powered: 'GPT-3.5 powered',
    diagnosis_escalate_cta: 'Escalate Legally',
    claim_health_title: 'Claim Health Score',
    claim_health_days_in_stage: '{days} days at current stage',
    hero_founder_story:
      'When I filed my PF withdrawal, the EPFO portal showed only UNDER PROCESS for weeks — with no idea which stage was stuck or what to do next.',
    judge_banner_text: 'Judges: start the guided walkthrough',
    judge_banner_cta: 'Open /demo',
    stat_stage_visibility: '4-Stage Visibility',
    stat_ai_diagnosis: 'AI + Rule-Based',
    prototype_banner:
      'Hackathon prototype for Build What Moves India — not affiliated with EPFO or Government of India. Mock data only.',
    ticker_label: 'DEMO',
    ticker_text:
      'Prototype update: Mock claim tracking with AI diagnosis · KYC Health Check uses sample profiles only · Legal templates link to official portals',
    header_tagline: 'Hackathon EPFO Claims Assistant (Prototype)',
    nav_kyc_check: 'KYC Check',
    nav_escalate: 'Escalate',
    hero_badge: 'Built for Build What Moves India 2026',
    hero_welcome: 'WELCOME TO SAHAYAKAI',
    hero_title_line1: 'Your EPFO Claim.',
    hero_title_line2: 'Complete Transparency.',
    hero_description:
      'Stop checking "Under Process". Get real-time stage tracking, AI-powered diagnosis, and actionable resolution steps for your PF withdrawal claims.',
    cta_track_claim: 'Track Your Claim',
    cta_watch_demo: 'Watch Demo',
    stat_epfo_members: 'EPFO Members',
    stat_target_settlement: 'Target Settlement',
    stat_diagnosis_accuracy: 'Diagnosis Accuracy',
    stat_languages: 'Hindi + English (22 planned)',
    mock_preview_badge: 'Mock Preview',
    features_title: 'How SahayakAI Works',
    features_subtitle:
      'Four core capabilities transforming EPFO claim tracking from opaque to transparent.',
    feature_tracking_title: 'Real-Time Stage Tracking',
    feature_tracking_desc:
      'See exactly which stage your claim is at — Employer Approval, KYC, EPFO Sanction, or Payment.',
    feature_ai_title: 'AI Bottleneck Diagnosis',
    feature_ai_desc:
      'GPT-powered detection identifies why your claim is delayed with confidence scoring.',
    feature_resolution_title: 'Resolution Guidance',
    feature_resolution_desc:
      'Step-by-step instructions to fix blockers — contact HR, update KYC, or escalate to EPFO.',
    feature_whatsapp_title: 'WhatsApp Alerts (Mock Preview)',
    feature_whatsapp_desc:
      'Preview how stage-change alerts would look on WhatsApp — not sent to a real phone.',
    problem_title: 'The Problem We Solve',
    problem_subtitle: 'See the difference SahayakAI makes for 8 crore+ EPFO members',
    problem_before_title: 'EPFO Portal (Current)',
    problem_before_subtitle: 'Citizens left in the dark',
    problem_status_label: 'Status:',
    problem_status_value: 'UNDER PROCESS',
    problem_last_updated: 'Last Updated: 15 days ago',
    problem_before_li1: 'No visibility into which stage',
    problem_before_li2: 'No diagnosis of issues',
    problem_before_li3: 'No actionable steps',
    problem_before_li4: 'Must check portal daily',
    problem_after_title: 'SahayakAI (Solution)',
    problem_after_subtitle: 'Complete clarity and guidance',
    problem_stage_employer: 'Employer Approval',
    problem_stage_kyc: 'KYC Verification',
    problem_status_completed: 'Completed',
    problem_status_blocked: 'Blocked',
    problem_ai_note: 'AI: Name mismatch PAN vs Aadhaar (92%)',
    problem_after_li1: 'Real-time stage visibility',
    problem_after_li2: 'AI-powered diagnosis',
    problem_after_li3: 'Step-by-step resolution',
    problem_after_li4: 'WhatsApp + legal escalation',
    tools_title: 'Citizen Empowerment Tools',
    tools_subtitle:
      'Go beyond tracking. SahayakAI equips you with tools no other EPFO platform provides.',
    tool_kyc_title: 'KYC Health Checker',
    tool_kyc_desc: 'Check if your documents are ready BEFORE filing. Prevents 30% of delays.',
    tool_legal_title: 'Legal Escalation',
    tool_legal_desc: 'One-click EPFiGMS, RTI, and CPGRAMS documents with legal references.',
    tool_finance_title: 'Financial Impact',
    tool_finance_desc: 'See the real cost of delay — lost interest, inflation erosion, daily losses.',
    tool_peer_title: 'Peer Comparison',
    tool_peer_desc: 'Compare your claim speed against similar claims. Know if your delay is abnormal.',
    tool_email_title: 'Smart Email Generator',
    tool_email_desc: 'AI-generated employer emails with legal references and follow-up tracking.',
    tool_rights_title: 'Know Your Rights',
    tool_rights_desc: 'Context-aware legal rights based on your claim stage, with portal links.',
    indiastack_title: 'Planned India Stack Integrations',
    indiastack_subtitle: 'Mock previews of how SahayakAI could connect to India\'s digital public infrastructure.',
    indiastack_whatsapp_title: 'WhatsApp Business API',
    indiastack_whatsapp_desc: 'Mock preview of claim notifications',
    indiastack_bhashini_title: 'BHASHINI Voice Input',
    indiastack_bhashini_desc: 'Mock voice input — Hindi & English today',
    indiastack_digilocker_title: 'DigiLocker',
    indiastack_digilocker_desc: 'Planned KYC document verification',
    cta2_title: 'Ready to track your EPFO claim?',
    cta2_subtitle: 'Enter your UAN and get instant AI-powered diagnosis. No sign-up required.',
    cta2_check_status: 'Check Claim Status',
    cta2_check_kyc: 'Check KYC Health',
    footer_tagline:
      'AI-powered EPFO claims assistant. Making government services transparent and accessible for every Indian citizen.',
    footer_quick_links: 'Quick Links',
    footer_track_claim: 'Track Claim',
    footer_kyc_checker: 'KYC Health Checker',
    footer_legal_escalation: 'Legal Escalation',
    footer_interactive_demo: 'Interactive Demo',
    footer_epfo_resources: 'EPFO Resources',
    footer_helplines: 'Helplines',
    footer_helpline_epfo: 'EPFO: 14470',
    footer_helpline_toll: 'Toll Free: 1800-118-005',
    footer_helpline_hours: 'Mon-Sat: 9:15 AM - 5:45 PM',
    footer_built_for: 'Built for',
    footer_disclaimer_v2:
      'Disclaimer: This is a hackathon prototype using mock data. Not affiliated with EPFO or Government of India.',

    // UX v2 — navigation & journey
    prototype_badge: 'Demo · Mock Data',
    prototype_badge_tooltip: 'Hackathon prototype — not affiliated with EPFO or Government of India',
    mobile_menu: 'Menu',
    tab_status: 'Status',
    tab_fix: 'Fix',
    tab_compare: 'Compare',
    tab_rights: 'Rights',
    tab_alerts: 'Alerts',
    step_status: 'Status',
    step_fix: 'Fix',
    step_compare: 'Compare',
    step_rights: 'Rights',
    step_alerts: 'Alerts',
    claim_tabs_label: 'Claim sections',
    journey_stepper_label: 'Your claim journey',
    next_step_label: 'What to do next',
    next_step_blocked_title: 'Your claim is blocked — take action today',
    next_step_fix_cta: 'See how to fix',
    next_step_delay_title: 'Your claim is delayed',
    next_step_delay_desc: 'Stuck for {days} days at the current stage. Know your rights.',
    next_step_rights_cta: 'Know your rights',
    next_step_track_title: 'Your claim is progressing',
    next_step_track_desc: 'Track stage-by-stage progress and estimated timeline.',
    next_step_settled_title: 'Claim settled successfully',
    next_step_settled_desc: 'View notification history and share your experience.',
    continue_to_fix: 'Continue: See how to fix',
    continue_to_compare: 'Continue: Compare & cost of delay',
    continue_to_rights: 'Continue: Know your rights',
    continue_to_alerts: 'Continue: View alerts',
    call_epfo_fab: 'Call EPFO helpline 14470',
    call_epfo_short: 'Call 14470',
    loading_claim: 'Fetching claim status...',
    expand_details: 'Show full claim details',
    collapse_details: 'Collapse claim details',
    share_status: 'Share claim status',
    copied_title: 'Copied!',
    copied_status: 'Status copied to clipboard.',
    check_no_real_epfo: 'Mock data only — we do not access real EPFO records.',
    check_welcome_back: 'Welcome back! Continue tracking UAN',
    check_uan_help: 'Where to find your UAN?',
    check_uan_help_desc: 'Find UAN on your EPFO passbook, salary slip, or at unifiedportal-mem.epfindia.gov.in',
    check_uan_invalid: 'UAN must be exactly 12 digits.',
    check_problem_picker_title: 'What is wrong with your claim?',
    problem_employer: 'Employer not approving',
    problem_kyc: 'KYC / identity check failed',
    problem_processing: 'Claim still processing',
    problem_payment: 'Payment delayed',
    check_claim_found: 'Claim found!',
    check_navigating: 'Opening your claim dashboard...',
    entry_track_title: 'Track My Claim',
    entry_track_desc: 'Enter UAN and see stage-by-stage status',
    entry_fix_title: 'Fix a Blocker',
    entry_fix_desc: 'AI diagnosis and step-by-step resolution',
    entry_escalate_title: 'Escalate Legally',
    entry_escalate_desc: 'EPFiGMS, RTI, and CPGRAMS document generator',
    tools_check_first: 'Check your claim first',
    section_diagnosis_title: 'AI Diagnosis & Actions',
    section_diagnosis_subtitle: 'Plain-language issue detection and recommended actions',
    section_analytics_title: 'Analytics & Financial Insights',
    section_analytics_subtitle: 'Compare your claim and understand the cost of delay',
    section_rights_title: 'Legal Rights & Escalation',
    section_rights_subtitle: 'Know your rights and take action when needed',
    stage_kyc_plain: 'Identity check (PAN/Aadhaar)',
    diagnosis_analyzing: 'Analyzing claim stages, timelines, and blockers',
    diagnosis_retry: 'Retry Diagnosis',
    diagnosis_helpline: 'EPFO Helpline Numbers',
    diagnosis_read_aloud: 'Read aloud (mock)',
    diagnosis_checklist_title: 'Your action checklist',
    diagnosis_step_copy: 'Copy',
    diagnosis_step_call: 'Call',
    diagnosis_step_open: 'Open',
    what_if_today_title: 'What if you act today?',
    what_if_today_desc: 'If resolved today, estimated settlement in ~{days} days (mock projection).',
    what_if_today_note: 'Based on typical processing times for similar claims.',
    finance_title: 'Financial Impact of Delay',
    finance_days_delayed: '{days} days delayed',
    finance_daily_loss_label: 'You are losing daily',
    finance_total_loss_label: 'Total opportunity cost so far',
    finance_losing_daily: 'You are losing every day this claim is delayed',
    finance_fd_loss: 'Lost Fixed Deposit interest (7% p.a.)',
    finance_inflation: 'Inflation erosion (6% p.a.)',
    finance_mf: 'Could have earned in Mutual Fund (12% p.a.)',
    finance_if_30_days: 'If delayed 30 days total',
    finance_footnote: 'Calculated on claim amount of ₹{amount} | Mock data for demo',
    finance_share_employer: 'Share delay with employer',
    finance_cites_link: 'This delay may violate the 3-day CITES settlement rule',
    finance_view_rights: 'View your rights',
    rights_title: 'Know Your Rights',
    rights_count: '{count} rights applicable',
    rights_priority: 'Most relevant for you',
    rights_show_more: 'Show {count} more rights',
    rights_show_less: 'Show less',
    rights_disclaimer: 'Rights are contextual based on your claim stage and delay duration. Informational guidance only, not legal advice.',
    rights_applies: 'Applies because:',
    alerts_enable: 'Enable alert previews',
    alerts_enabled_note: 'Mock toggle — alerts are not sent to a real phone.',
    alerts_missed: 'You would have been notified {days} days ago about this blocker.',
    alerts_sms_fallback: 'In production: SMS and email fallback for users without WhatsApp.',
    analytics_mock_data: 'Based on 24,853 similar claims (mock data for demo)',
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
      'PF निकासी दावों के लिए AI-संचालित जानकारी और WhatsApp सूचनाएं',
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
    whatsapp_title: 'WhatsApp सूचनाएं (मॉक पूर्वावलोकन)',
    whatsapp_subtitle:
      'सिम्युलेटेड अलर्ट — वास्तविक फोन पर नहीं भेजे जाते',
    whatsapp_demo_badge: 'मॉक पूर्वावलोकन',
    whatsapp_integration_note:
      'केवल मॉक पूर्वावलोकन। उत्पादन में India Stack के WhatsApp Business API का उपयोग होगा।',
    whatsapp_benefit:
      'दिखाता है कि नागरिक पोर्टल जांचे बिना अपडेट कैसे प्राप्त कर सकते हैं।',

    // Error Messages
    error_claim_not_found: 'दावा नहीं मिला',
    error_try_another_uan: 'दूसरा UAN आजमाएं',
    error_diagnosis_failed: 'निदान नहीं चल सका',
    error_try_again: 'कृपया बाद में पुनः प्रयास करें',
    diagnosis_rule_based: 'नियम-आधारित डेमो मोड',
    diagnosis_gpt_powered: 'GPT-3.5 संचालित',
    diagnosis_escalate_cta: 'कानूनी शिकायत करें',
    claim_health_title: 'दावा स्वास्थ्य स्कोर',
    claim_health_days_in_stage: 'वर्तमान चरण में {days} दिन',
    hero_founder_story:
      'जब मैंने PF निकासी के लिए आवेदन किया, तो EPFO पोर्टल पर हफ्तों तक केवल प्रक्रियाधीन दिखा — पता नहीं कौन सा चरण अटका है या क्या करना है।',
    judge_banner_text: 'न्यायाधीश: मार्गदर्शित डेमो से शुरू करें',
    judge_banner_cta: '/demo खोलें',
    stat_stage_visibility: '4-चरण दृश्यता',
    stat_ai_diagnosis: 'AI + नियम-आधारित',

    // Homepage v2
    prototype_banner:
      'बिल्ड व्हाट मूव्स इंडिया हैकाथॉन प्रोटोटाइप — EPFO या भारत सरकार से संबद्ध नहीं। केवल डेमो डेटा।',
    ticker_label: 'डेमो',
    ticker_text:
      'प्रोटोटाइप अपडेट: मॉक दावा ट्रैकिंग और AI निदान · KYC जांच केवल नमूना प्रोफाइल · कानूनी टेम्पलेट आधिकारिक पोर्टल से लिंक',
    header_tagline: 'हैकाथॉन EPFO दावा सहायक (प्रोटोटाइप)',
    nav_kyc_check: 'KYC जांच',
    nav_escalate: 'शिकायत करें',
    hero_badge: 'Build What Moves India 2026 के लिए निर्मित',
    hero_welcome: 'सहायकAI में आपका स्वागत है',
    hero_title_line1: 'आपका EPFO दावा।',
    hero_title_line2: 'पूर्ण पारदर्शिता।',
    hero_description:
      '"प्रक्रियाधीन" देखना बंद करें। अपने PF निकासी दावों के लिए रियल-टाइम स्थिति ट्रैकिंग, AI-संचालित निदान और कार्रवाई योग्य समाधान चरण प्राप्त करें।',
    cta_track_claim: 'अपना दावा ट्रैक करें',
    cta_watch_demo: 'डेमो देखें',
    stat_epfo_members: 'EPFO सदस्य',
    stat_target_settlement: 'लक्षित निपटान',
    stat_diagnosis_accuracy: 'निदान सटीकता',
    stat_languages: 'हिंदी + अंग्रेज़ी (22 नियोजित)',
    mock_preview_badge: 'मॉक पूर्वावलोकन',
    features_title: 'सहायकAI कैसे काम करता है',
    features_subtitle:
      'EPFO दावा ट्रैकिंग को अपारदर्शी से पारदर्शी में बदलने वाली चार मुख्य क्षमताएं।',
    feature_tracking_title: 'रियल-टाइम चरण ट्रैकिंग',
    feature_tracking_desc:
      'देखें कि आपका दावा किस चरण में है — नियोक्ता स्वीकृति, KYC, EPFO मंजूरी, या भुगतान।',
    feature_ai_title: 'AI बाधा निदान',
    feature_ai_desc:
      'GPT-संचालित पहचान विश्वास स्कोरिंग के साथ बताती है कि आपका दावा क्यों विलंबित है।',
    feature_resolution_title: 'समाधान मार्गदर्शन',
    feature_resolution_desc:
      'बाधाओं को ठीक करने के लिए चरण-दर-चरण निर्देश — HR से संपर्क करें, KYC अपडेट करें, या EPFO को एस्केलेट करें।',
    feature_whatsapp_title: 'WhatsApp अलर्ट (मॉक पूर्वावलोकन)',
    feature_whatsapp_desc:
      'देखें कि WhatsApp पर चरण-परिवर्तन अलर्ट कैसे दिखेंगे — वास्तविक फोन पर नहीं भेजे जाते।',
    problem_title: 'हम जिस समस्या का समाधान करते हैं',
    problem_subtitle: '8 करोड़+ EPFO सदस्यों के लिए सहायकAI द्वारा किए गए अंतर को देखें',
    problem_before_title: 'EPFO पोर्टल (वर्तमान)',
    problem_before_subtitle: 'नागरिक अंधेरे में छोड़ दिए गए',
    problem_status_label: 'स्थिति:',
    problem_status_value: 'प्रक्रियाधीन',
    problem_last_updated: 'अंतिम अपडेट: 15 दिन पहले',
    problem_before_li1: 'किस चरण में है इसकी कोई दृश्यता नहीं',
    problem_before_li2: 'समस्याओं का कोई निदान नहीं',
    problem_before_li3: 'कोई कार्रवाई योग्य कदम नहीं',
    problem_before_li4: 'रोजाना पोर्टल जांचना पड़ता है',
    problem_after_title: 'सहायकAI (समाधान)',
    problem_after_subtitle: 'पूर्ण स्पष्टता और मार्गदर्शन',
    problem_stage_employer: 'नियोक्ता स्वीकृति',
    problem_stage_kyc: 'KYC सत्यापन',
    problem_status_completed: 'पूर्ण',
    problem_status_blocked: 'अवरुद्ध',
    problem_ai_note: 'AI: PAN बनाम आधार नाम में असमानता (92%)',
    problem_after_li1: 'रियल-टाइम चरण दृश्यता',
    problem_after_li2: 'AI-संचालित निदान',
    problem_after_li3: 'चरण-दर-चरण समाधान',
    problem_after_li4: 'WhatsApp + कानूनी एस्केलेशन',
    tools_title: 'नागरिक सशक्तिकरण उपकरण',
    tools_subtitle:
      'केवल ट्रैकिंग से आगे बढ़ें। सहायकAI आपको ऐसे उपकरण देता है जो कोई अन्य EPFO प्लेटफॉर्म नहीं देता।',
    tool_kyc_title: 'KYC स्वास्थ्य जांचकर्ता',
    tool_kyc_desc: 'दाखिल करने से पहले जांचें कि आपके दस्तावेज़ तैयार हैं या नहीं। 30% देरी को रोकता है।',
    tool_legal_title: 'कानूनी एस्केलेशन',
    tool_legal_desc: 'कानूनी संदर्भों के साथ एक-क्लिक EPFiGMS, RTI, और CPGRAMS दस्तावेज़।',
    tool_finance_title: 'वित्तीय प्रभाव',
    tool_finance_desc: 'देरी की वास्तविक लागत देखें — ब्याज हानि, मुद्रास्फीति क्षरण, दैनिक नुकसान।',
    tool_peer_title: 'सहकर्मी तुलना',
    tool_peer_desc: 'अपने दावे की गति की तुलना समान दावों से करें। जानें कि आपकी देरी असामान्य है या नहीं।',
    tool_email_title: 'स्मार्ट ईमेल जनरेटर',
    tool_email_desc: 'कानूनी संदर्भों और फॉलो-अप ट्रैकिंग के साथ AI-जनित नियोक्ता ईमेल।',
    tool_rights_title: 'अपने अधिकार जानें',
    tool_rights_desc:
      'पोर्टल लिंक के साथ आपके दावे के चरण के आधार पर संदर्भ-जागरूक कानूनी अधिकार।',
    indiastack_title: 'नियोजित India Stack एकीकरण',
    indiastack_subtitle: 'सहायकAI भारत के डिजिटल बुनियादी ढांचे से कैसे जुड़ सकता है — मॉक पूर्वावलोकन।',
    indiastack_whatsapp_title: 'WhatsApp Business API',
    indiastack_whatsapp_desc: 'दावा सूचनाओं का मॉक पूर्वावलोकन',
    indiastack_bhashini_title: 'भाषिणी वॉइस इनपुट',
    indiastack_bhashini_desc: 'मॉक वॉइस इनपुट — आज हिंदी और अंग्रेज़ी',
    indiastack_digilocker_title: 'डिजिलॉकर',
    indiastack_digilocker_desc: 'नियोजित KYC दस्तावेज़ सत्यापन',
    cta2_title: 'अपना EPFO दावा ट्रैक करने के लिए तैयार हैं?',
    cta2_subtitle: 'अपना UAN दर्ज करें और तुरंत AI-संचालित निदान प्राप्त करें। साइन-अप की आवश्यकता नहीं।',
    cta2_check_status: 'दावा स्थिति जांचें',
    cta2_check_kyc: 'KYC स्वास्थ्य जांचें',
    footer_tagline:
      'AI-संचालित EPFO दावा सहायक। हर भारतीय नागरिक के लिए सरकारी सेवाओं को पारदर्शी और सुलभ बनाना।',
    footer_quick_links: 'त्वरित लिंक',
    footer_track_claim: 'दावा ट्रैक करें',
    footer_kyc_checker: 'KYC स्वास्थ्य जांचकर्ता',
    footer_legal_escalation: 'कानूनी एस्केलेशन',
    footer_interactive_demo: 'इंटरैक्टिव डेमो',
    footer_epfo_resources: 'EPFO संसाधन',
    footer_helplines: 'हेल्पलाइन',
    footer_helpline_epfo: 'EPFO: 14470',
    footer_helpline_toll: 'टोल फ्री: 1800-118-005',
    footer_helpline_hours: 'सोम-शनि: सुबह 9:15 - शाम 5:45',
    footer_built_for: 'के लिए निर्मित',
    footer_disclaimer_v2:
      'अस्वीकरण: यह मॉक डेटा का उपयोग करने वाला एक हैकाथॉन प्रोटोटाइप है। EPFO या भारत सरकार से संबद्ध नहीं।',

    // UX v2 — navigation & journey
    prototype_badge: 'डेमो · मॉक डेटा',
    prototype_badge_tooltip: 'हैकाथॉन प्रोटोटाइप — EPFO या भारत सरकार से संबद्ध नहीं',
    mobile_menu: 'मेनू',
    tab_status: 'स्थिति',
    tab_fix: 'सुधार',
    tab_compare: 'तुलना',
    tab_rights: 'अधिकार',
    tab_alerts: 'अलर्ट',
    step_status: 'स्थिति',
    step_fix: 'सुधार',
    step_compare: 'तुलना',
    step_rights: 'अधिकार',
    step_alerts: 'अलर्ट',
    claim_tabs_label: 'दावा अनुभाग',
    journey_stepper_label: 'आपकी दावा यात्रा',
    next_step_label: 'अगला कदम',
    next_step_blocked_title: 'आपका दावा अवरुद्ध है — आज कार्रवाई करें',
    next_step_fix_cta: 'सुधार देखें',
    next_step_delay_title: 'आपका दावा विलंबित है',
    next_step_delay_desc: 'वर्तमान चरण में {days} दिन से अटका है। अपने अधिकार जानें।',
    next_step_rights_cta: 'अपने अधिकार जानें',
    next_step_track_title: 'आपका दावा प्रगति पर है',
    next_step_track_desc: 'चरण-दर-चरण प्रगति और अनुमानित समयरेखा देखें।',
    next_step_settled_title: 'दावा सफलतापूर्वक निपटा',
    next_step_settled_desc: 'सूचना इतिहास देखें और अनुभव साझा करें।',
    continue_to_fix: 'आगे: सुधार देखें',
    continue_to_compare: 'आगे: तुलना और देरी की लागत',
    continue_to_rights: 'आगे: अपने अधिकार जानें',
    continue_to_alerts: 'आगे: अलर्ट देखें',
    call_epfo_fab: 'EPFO हेल्पलाइन 14470 पर कॉल करें',
    call_epfo_short: '14470 कॉल',
    loading_claim: 'दावा स्थिति लोड हो रही है...',
    expand_details: 'पूर्ण विवरण दिखाएं',
    collapse_details: 'विवरण छिपाएं',
    share_status: 'स्थिति साझा करें',
    copied_title: 'कॉपी हो गया!',
    copied_status: 'स्थिति क्लिपबोर्ड पर कॉपी हो गई।',
    check_no_real_epfo: 'केवल मॉक डेटा — हम वास्तविक EPFO रिकॉर्ड नहीं देखते।',
    check_welcome_back: 'वापसी पर स्वागत! UAN ट्रैक करना जारी रखें',
    check_uan_help: 'अपना UAN कहाँ मिलेगा?',
    check_uan_help_desc: 'UAN EPFO पासबुक, वेतन पर्ची, या unifiedportal-mem.epfindia.gov.in पर मिलता है',
    check_uan_invalid: 'UAN ठीक 12 अंकों का होना चाहिए।',
    check_problem_picker_title: 'आपके दावे में क्या समस्या है?',
    problem_employer: 'नियोक्ता स्वीकृति नहीं',
    problem_kyc: 'KYC / पहचान जांच विफल',
    problem_processing: 'दावा अभी प्रक्रिया में',
    problem_payment: 'भुगतान विलंबित',
    check_claim_found: 'दावा मिला!',
    check_navigating: 'आपका दावा डैशबोर्ड खोला जा रहा है...',
    entry_track_title: 'मेरा दावा ट्रैक करें',
    entry_track_desc: 'UAN दर्ज करें और चरण-दर-चरण स्थिति देखें',
    entry_fix_title: 'बाधा ठीक करें',
    entry_fix_desc: 'AI निदान और चरण-दर-चरण समाधान',
    entry_escalate_title: 'कानूनी शिकायत',
    entry_escalate_desc: 'EPFiGMS, RTI, CPGRAMS दस्तावेज़ जनरेटर',
    tools_check_first: 'पहले अपना दावा जांचें',
    section_diagnosis_title: 'AI निदान और कार्रवाई',
    section_diagnosis_subtitle: 'सरल भाषा में समस्या पहचान और अनुशंसित कदम',
    section_analytics_title: 'विश्लेषण और वित्तीय जानकारी',
    section_analytics_subtitle: 'अपने दावे की तुलना करें और देरी की लागत समझें',
    section_rights_title: 'कानूनी अधिकार और एस्केलेशन',
    section_rights_subtitle: 'अपने अधिकार जानें और आवश्यकता पर कार्रवाई करें',
    stage_kyc_plain: 'पहचान जांच (PAN/आधार)',
    diagnosis_analyzing: 'दावा चरण, समयरेखा और बाधाओं का विश्लेषण',
    diagnosis_retry: 'निदान पुनः करें',
    diagnosis_helpline: 'EPFO हेल्पलाइन नंबर',
    diagnosis_read_aloud: 'ज़ोर से पढ़ें (मॉक)',
    diagnosis_checklist_title: 'आपकी कार्रवाई सूची',
    diagnosis_step_copy: 'कॉपी',
    diagnosis_step_call: 'कॉल',
    diagnosis_step_open: 'खोलें',
    what_if_today_title: 'अगर आप आज कार्रवाई करें?',
    what_if_today_desc: 'अगर आज हल हो, तो अनुमानित निपटान ~{days} दिनों में (मॉक अनुमान)।',
    what_if_today_note: 'समान दावों की सामान्य प्रसंस्करण अवधि पर आधारित।',
    finance_title: 'देरी का वित्तीय प्रभाव',
    finance_days_delayed: '{days} दिन विलंब',
    finance_daily_loss_label: 'आप रोज़ाना खो रहे हैं',
    finance_total_loss_label: 'अब तक की कुल अवसर लागत',
    finance_losing_daily: 'देरी के हर दिन आप नुकसान उठा रहे हैं',
    finance_fd_loss: 'FD ब्याज हानि (7% वार्षिक)',
    finance_inflation: 'मुद्रास्फीति क्षरण (6% वार्षिक)',
    finance_mf: 'म्यूचुअल फंड में कमाई (12% वार्षिक)',
    finance_if_30_days: 'यदि कुल 30 दिन विलंब',
    finance_footnote: 'दावा राशि ₹{amount} पर गणना | डेमो के लिए मॉक डेटा',
    finance_share_employer: 'नियोक्ता के साथ देरी साझा करें',
    finance_cites_link: 'यह देरी 3-दिन CITES निपटान नियम का उल्लंघन कर सकती है',
    finance_view_rights: 'अपने अधिकार देखें',
    rights_title: 'अपने अधिकार जानें',
    rights_count: '{count} अधिकार लागू',
    rights_priority: 'आपके लिए सबसे प्रासंगिक',
    rights_show_more: '{count} और अधिकार दिखाएं',
    rights_show_less: 'कम दिखाएं',
    rights_disclaimer: 'अधिकार आपके दावे के चरण और देरी अवधि के आधार पर हैं। केवल सूचनात्मक मार्गदर्शन, कानूनी सलाह नहीं।',
    rights_applies: 'लागू क्योंकि:',
    alerts_enable: 'अलर्ट पूर्वावलोकन सक्षम करें',
    alerts_enabled_note: 'मॉक टॉगल — वास्तविक फोन पर अलर्ट नहीं भेजे जाते।',
    alerts_missed: 'इस बाधा के बारे में आपको {days} दिन पहले सूचित किया जाता।',
    alerts_sms_fallback: 'उत्पादन में: WhatsApp के बिना उपयोगकर्ताओं के लिए SMS और ईमेल विकल्प।',
    analytics_mock_data: '24,853 समान दावों पर आधारित (डेमो के लिए मॉक डेटा)',
  },
};
