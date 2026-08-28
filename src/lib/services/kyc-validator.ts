export interface KYCField {
  field: string;
  source1: { name: string; value: string };
  source2: { name: string; value: string };
  match: boolean;
  severity: 'critical' | 'warning' | 'ok';
  fixUrl?: string;
  fixLabel?: string;
}

export interface KYCHealthResult {
  score: number;
  status: 'green' | 'yellow' | 'red';
  fields: KYCField[];
  recommendation: string;
  estimatedDelayIfFiled: number;
  estimatedSettlementIfFixed: number;
}

interface MockKYCProfile {
  epfoName: string;
  panName: string;
  aadhaarName: string;
  epfoDOB: string;
  panDOB: string;
  aadhaarDOB: string;
  bankVerified: boolean;
  dateOfExitUpdated: boolean;
  employerName: string;
  mobileLinked: boolean;
}

const MOCK_PROFILES: Record<string, MockKYCProfile> = {
  '123456789': {
    epfoName: 'Priya S Sharma',
    panName: 'Priya Sharma',
    aadhaarName: 'Priya Singh Sharma',
    epfoDOB: '1998-03-15',
    panDOB: '1998-03-15',
    aadhaarDOB: '1998-03-15',
    bankVerified: true,
    dateOfExitUpdated: false,
    employerName: 'TechVista Solutions Pvt Ltd',
    mobileLinked: true,
  },
  '987654321': {
    epfoName: 'Rajesh Kumar Sharma',
    panName: 'Rajesh Kr Sharma',
    aadhaarName: 'Rajesh Kumar Sharma',
    epfoDOB: '1981-07-22',
    panDOB: '1981-07-22',
    aadhaarDOB: '1981-07-20',
    bankVerified: true,
    dateOfExitUpdated: true,
    employerName: 'BrightSteel Manufacturing',
    mobileLinked: true,
  },
  '555555555': {
    epfoName: 'Ananya Patel',
    panName: 'Ananya Patel',
    aadhaarName: 'Ananya Patel',
    epfoDOB: '1995-11-08',
    panDOB: '1995-11-08',
    aadhaarDOB: '1995-11-08',
    bankVerified: true,
    dateOfExitUpdated: true,
    employerName: 'Cloudbridge IT Services',
    mobileLinked: true,
  },
  '111111111': {
    epfoName: 'Suresh Reddy',
    panName: 'Suresh Reddy',
    aadhaarName: 'Suresh Reddy',
    epfoDOB: '1975-02-14',
    panDOB: '1975-02-14',
    aadhaarDOB: '1975-02-14',
    bankVerified: true,
    dateOfExitUpdated: true,
    employerName: 'National Textiles Ltd',
    mobileLinked: true,
  },
};

/**
 * Validate KYC health for a given UAN BEFORE filing a claim.
 * Returns a health score, field mismatches, and recommendations.
 */
export function validateKYC(uan: string): KYCHealthResult | null {
  const profile = MOCK_PROFILES[uan.trim()];
  if (!profile) return null;

  const fields: KYCField[] = [];
  let issues = 0;
  let criticalIssues = 0;

  // Name check: EPFO vs PAN
  const epfoPanNameMatch = profile.epfoName.toLowerCase() === profile.panName.toLowerCase();
  fields.push({
    field: 'Name (EPFO vs PAN)',
    source1: { name: 'EPFO', value: profile.epfoName },
    source2: { name: 'PAN', value: profile.panName },
    match: epfoPanNameMatch,
    severity: epfoPanNameMatch ? 'ok' : 'critical',
    fixUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    fixLabel: 'Correct PAN Name (NSDL Portal)',
  });
  if (!epfoPanNameMatch) { issues++; criticalIssues++; }

  // Name check: EPFO vs Aadhaar
  const epfoAadhaarNameMatch = profile.epfoName.toLowerCase() === profile.aadhaarName.toLowerCase();
  fields.push({
    field: 'Name (EPFO vs Aadhaar)',
    source1: { name: 'EPFO', value: profile.epfoName },
    source2: { name: 'Aadhaar', value: profile.aadhaarName },
    match: epfoAadhaarNameMatch,
    severity: epfoAadhaarNameMatch ? 'ok' : 'critical',
    fixUrl: 'https://myaadhaar.uidai.gov.in/',
    fixLabel: 'Update Aadhaar (myAadhaar Portal)',
  });
  if (!epfoAadhaarNameMatch) { issues++; criticalIssues++; }

  // DOB check: EPFO vs Aadhaar
  const dobMatch = profile.epfoDOB === profile.aadhaarDOB;
  fields.push({
    field: 'Date of Birth (EPFO vs Aadhaar)',
    source1: { name: 'EPFO', value: profile.epfoDOB },
    source2: { name: 'Aadhaar', value: profile.aadhaarDOB },
    match: dobMatch,
    severity: dobMatch ? 'ok' : 'critical',
    fixUrl: 'https://myaadhaar.uidai.gov.in/',
    fixLabel: 'Update Aadhaar DOB',
  });
  if (!dobMatch) { issues++; criticalIssues++; }

  // Bank verification
  fields.push({
    field: 'Bank Account Verified',
    source1: { name: 'EPFO', value: profile.bankVerified ? 'Verified' : 'Not Verified' },
    source2: { name: 'Required', value: 'Verified' },
    match: profile.bankVerified,
    severity: profile.bankVerified ? 'ok' : 'warning',
    fixUrl: 'https://unifiedportal-mem.epfindia.gov.in/memberInterface/',
    fixLabel: 'Verify Bank in EPFO Portal',
  });
  if (!profile.bankVerified) issues++;

  // Date of Exit
  fields.push({
    field: 'Date of Exit Updated by Employer',
    source1: { name: 'Employer', value: profile.dateOfExitUpdated ? 'Updated' : 'NOT Updated' },
    source2: { name: 'Required', value: 'Updated' },
    match: profile.dateOfExitUpdated,
    severity: profile.dateOfExitUpdated ? 'ok' : 'critical',
  });
  if (!profile.dateOfExitUpdated) { issues++; criticalIssues++; }

  // Mobile linked
  fields.push({
    field: 'Mobile Number Linked',
    source1: { name: 'EPFO', value: profile.mobileLinked ? 'Linked' : 'Not Linked' },
    source2: { name: 'Required', value: 'Linked' },
    match: profile.mobileLinked,
    severity: profile.mobileLinked ? 'ok' : 'warning',
    fixUrl: 'https://unifiedportal-mem.epfindia.gov.in/memberInterface/',
    fixLabel: 'Link Mobile in EPFO Portal',
  });
  if (!profile.mobileLinked) issues++;

  // Calculate score
  const totalChecks = fields.length;
  const passedChecks = fields.filter(f => f.match).length;
  const score = Math.round((passedChecks / totalChecks) * 100);

  let status: 'green' | 'yellow' | 'red';
  if (criticalIssues > 0) status = 'red';
  else if (issues > 0) status = 'yellow';
  else status = 'green';

  const estimatedDelayIfFiled = criticalIssues * 10 + (issues - criticalIssues) * 3;
  const estimatedSettlementIfFixed = 7;

  let recommendation: string;
  if (status === 'green') {
    recommendation = 'All checks passed! You are ready to file your claim. Expected settlement: 7-10 days.';
  } else if (status === 'yellow') {
    recommendation = `Minor issues found. You can file, but fixing them first may speed up settlement by ${estimatedDelayIfFiled} days.`;
  } else {
    recommendation = `CRITICAL issues detected. DO NOT FILE YET. Filing now will result in ${estimatedDelayIfFiled}+ days delay. Fix the issues below first.`;
  }

  return {
    score,
    status,
    fields,
    recommendation,
    estimatedDelayIfFiled,
    estimatedSettlementIfFixed,
  };
}
