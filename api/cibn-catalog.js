const CATALOG_VERSION = '2026-10-official-timetable-v2';

const COURSES = [
  {program:'MCP',level:'Microfinance I',code:'MF301',name:'The Evolution Management and Regulation of Microfinancing',date:'2026-10-06',time:'09:00-12:00',type:'core',elective:false,durationMinutes:90,authority:'official_cibn'},
  {program:'MCP',level:'Microfinance I',code:'MF302',name:'Financial Analysis and Performance Monitoring in Microfinance Institutions',date:'2026-10-06',time:'09:00-12:00',type:'core',elective:false,durationMinutes:90,authority:'official_cibn'},
  {program:'MCP',level:'Microfinance I',code:'MF303',name:'Product Development and Marketing Management',date:'2026-10-06',time:'14:00-17:00',type:'core',elective:false,durationMinutes:90,authority:'official_cibn'},
  {program:'MCP',level:'Microfinance II',code:'MF401',name:'Risk Management and Internal Control in Microfinance Institutions',date:'2026-10-07',time:'09:00-12:00',type:'core',elective:false,durationMinutes:90,authority:'official_cibn'},
  {program:'MCP',level:'Microfinance II',code:'MF402',name:'Ethics and Corporate Governance',date:'2026-10-06',time:'14:00-17:00',type:'core',elective:false,durationMinutes:90,authority:'official_cibn'},
  {program:'MCP',level:'Microfinance II',code:'MF403',name:'Digital Finance in Microfinance Institution',date:'2026-10-07',time:'09:00-12:00',type:'elective',elective:true,durationMinutes:90,authority:'official_cibn'},
  {program:'MCP',level:'Microfinance II',code:'MF404',name:'Small and Medium Enterprises Management and Development',date:'2026-10-07',time:'14:00-17:00',type:'elective',elective:true,durationMinutes:90,authority:'official_cibn'}
];

const SELECTION_RULES = {
  mcp: {
    programme:'MCP',
    stage1:{requiredCodes:['MF301','MF302','MF303'],requiredCount:3},
    stage2:{requiredCodes:['MF401','MF402'],requiredCount:2},
    elective:{codes:['MF403','MF404'],choose:1},
    note:'MCP comprises three Microfinance I papers, two mandatory Microfinance II papers and one Microfinance II elective.'
  },
  acibCharteredBanker:{
    coreCount:5,
    electivePoolCount:8,
    electiveChoose:1,
    coreCodes:['801','802','803','804','813'],
    electiveCodes:['805','806','807','808','809','810','811','812'],
    portalObservation:'The owner portal screenshot displayed a maximum-of-three elective guard on a particular registration screen. Current official CIBN qualification information says select only one elective.',
    authority:'official_cibn_plus_portal_observation'
  },
  certificationProgramme:{
    observedMaximumCourses:5,
    scope:'Certification Programme selection context only',
    authority:'portal_observation'
  },
  ePayments:{
    numericMaximum:'not_inferred',
    observedRule:'The owner portal rejected an all-displayed-course combination with an examination timetable clash.',
    authority:'portal_observation'
  },
  agencyBanking:{
    numericMaximum:'not_inferred',
    observedSelectionCount:12,
    authority:'portal_observation'
  }
};

const SESSION_RULE = {
  maxCombinedDurationMinutes:180,
  statement:'Candidates cannot combine courses exceeding the 3-hour duration at a particular session.',
  authority:'official_cibn',
  sourceUrl:'https://www.cibng.org/wp-content/uploads/2026/07/October-2026-Examination-Timetable.pdf'
};

const OFFICIAL_EXAM_FEES = {
  'ACIB Diploma':[17000,23500,31500,41000],
  'ACIB Intermediate Professional':[27500,40750,54000,67250],
  'ACIB Chartered Banker':[35000,52000,69000,86000,103000,120000],
  'Microfinance Certification Programme':[8750,13500,18250,23000,27750,32500],
  'Agency Banking Programme':[11250,16000,20750,25500,30250,35000],
  'Certified E-Payments Associate (CePA)':[35000,57000,79000,101000,123000,145000],
  'Certified E-Payments Professional (CePP)':[38000,60000,82000,104000,126000,148000,170000],
  'Certification Programme':[27500,44500,61500,78500,95500,112000],
  'Fintech Foundation':[45000,75000,105000,135000],
  'Fintech Intermediate':[60000,90000,120000],
  'Fintech Professional':[75000,105000,135000]
};

const PROGRAMMES = [
  {key:'acib',name:'Associationship (ACIB) Examination',detail:'Diploma, Intermediate Professional and Chartered Banker routes'},
  {key:'mcp',name:'Micro-Finance Certification Program',detail:'Microfinance I + Microfinance II'},
  {key:'cib',name:'Certificate in Banking',detail:'CIB I, CIB II and CIB III'},
  {key:'agency',name:'Agency Banking',detail:'Three levels'},
  {key:'epayments',name:'Professional E-Payment',detail:'CePA and CePP'},
  {key:'certification',name:'Certification Programmes',detail:'Specialist banking and finance certifications'},
  {key:'exemption',name:'Exemptions',detail:'Eligibility, applications and exemption boundaries'},
  {key:'resources',name:'Resource Hub',detail:'Bookshop, downloads, digital library and examiner reports'}
];

module.exports = (req,res) => {
  res.setHeader('Content-Type','application/json');
  res.setHeader('Cache-Control','public, max-age=300, s-maxage=300');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');
  if(req.method==='OPTIONS') return res.status(204).end();
  if(req.method!=='GET') return res.status(405).json({ok:false,error:'GET only'});
  return res.status(200).json({
    ok:true,
    catalog_version:CATALOG_VERSION,
    generated_at:new Date().toISOString(),
    sources:{
      timetable:'https://www.cibng.org/wp-content/uploads/2026/07/October-2026-Examination-Timetable.pdf',
      qualifications:'https://www.cibng.org/cb-c-overview/',
      mcp:'https://www.cibng.org/micro-finance-certification-program-mcp/'
    },
    courses:COURSES,
    selection_rules:SELECTION_RULES,
    session_rule:SESSION_RULE,
    official_exam_fees:OFFICIAL_EXAM_FEES,
    programmes:PROGRAMMES
  });
};