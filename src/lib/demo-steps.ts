import {
  DEMO_UAN_EMPLOYER,
  DEMO_UAN_KYC,
  DEMO_UAN_PROCESSING,
  DEMO_UAN_SETTLED,
} from '@/lib/claim-session';

export type DemoStep = {
  id: number;
  titleKey: string;
  descKey: string;
  actionKey: string;
  shortKey: string;
  component?: 'comparison';
  link?: string;
  noteKey?: string;
  demoUANs?: Array<{ uan: string; labelKey: string }>;
};

export const DEMO_STEP_DEFS: DemoStep[] = [
  {
    id: 1,
    titleKey: 'demo_1_title',
    descKey: 'demo_1_desc',
    actionKey: 'demo_1_action',
    shortKey: 'demo_1_short',
    component: 'comparison',
  },
  {
    id: 2,
    titleKey: 'demo_2_title',
    descKey: 'demo_2_desc',
    actionKey: 'demo_2_action',
    shortKey: 'demo_2_short',
    link: '/claim/check',
    demoUANs: [
      { uan: DEMO_UAN_EMPLOYER, labelKey: 'problem_employer' },
      { uan: DEMO_UAN_KYC, labelKey: 'problem_kyc' },
      { uan: DEMO_UAN_PROCESSING, labelKey: 'problem_processing' },
      { uan: DEMO_UAN_SETTLED, labelKey: 'problem_payment' },
    ],
  },
  {
    id: 3,
    titleKey: 'demo_3_title',
    descKey: 'demo_3_desc',
    actionKey: 'demo_3_action',
    shortKey: 'demo_3_short',
    link: `/claim/${DEMO_UAN_EMPLOYER}/diagnosis`,
  },
  {
    id: 4,
    titleKey: 'demo_4_title',
    descKey: 'demo_4_desc',
    actionKey: 'demo_4_action',
    shortKey: 'demo_4_short',
    link: `/claim/${DEMO_UAN_KYC}/diagnosis`,
  },
  {
    id: 5,
    titleKey: 'demo_5_title',
    descKey: 'demo_5_desc',
    actionKey: 'demo_5_action',
    shortKey: 'demo_5_short',
    link: `/claim/${DEMO_UAN_SETTLED}/alerts`,
  },
  {
    id: 6,
    titleKey: 'demo_6_title',
    descKey: 'demo_6_desc',
    actionKey: 'demo_6_action',
    shortKey: 'demo_6_short',
    noteKey: 'demo_6_note',
  },
  {
    id: 7,
    titleKey: 'demo_7_title',
    descKey: 'demo_7_desc',
    actionKey: 'demo_7_action',
    shortKey: 'demo_7_short',
    link: `/claim/${DEMO_UAN_EMPLOYER}/analytics`,
  },
  {
    id: 8,
    titleKey: 'demo_8_title',
    descKey: 'demo_8_desc',
    actionKey: 'demo_8_action',
    shortKey: 'demo_8_short',
    link: '/tools/kyc-check',
  },
  {
    id: 9,
    titleKey: 'demo_9_title',
    descKey: 'demo_9_desc',
    actionKey: 'demo_9_action',
    shortKey: 'demo_9_short',
    link: '/tools/escalate',
  },
];
