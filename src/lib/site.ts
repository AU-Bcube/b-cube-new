export type FaqItem = {
  question: string;
  answer: string;
};

export const SITE = {
  name: '비큐브 B-CUBE',
  shortName: 'B-CUBE',
  koreanName: '비큐브',
  title: '비큐브 B-CUBE | 아주대학교 경영인텔리전스학과 IT 소학회',
  description:
    '비큐브 B-CUBE는 아주대학교 경영인텔리전스학과 IT·비즈니스 소학회로, 웹/앱 기획·개발과 디자인톤, IT 스터디를 진행합니다.',
  extendedDescription:
    '비큐브 B-CUBE는 아주대학교 경영인텔리전스학과 소속 IT·비즈니스 소학회입니다. 웹/앱 서비스 기획과 개발, 디자인톤, IT 스터디, 카드뉴스 제작 활동을 통해 아이디어를 실제 결과물로 구현합니다.',
  affiliation: '아주대학교 경영인텔리전스학과 IT·비즈니스 소학회',
  url: 'https://www.b-cube.kr',
  locale: 'ko_KR',
  language: 'ko',
  logo: '/logo.svg',
  ogImage: '/opengraph-image.png',
  naverVerification: 'faeee0c5c10843f8a1f21c3ef305b36b5c7ac22b',
  social: {
    instagram: 'https://www.instagram.com/ajou_bcube/',
    sexyItInstagram: 'https://www.instagram.com/sexyit_season2/',
    github: 'https://github.com/AU-Bcube',
    kakaoTalk: 'https://open.kakao.com/o/sCRuhWTg',
  },
  sameAs: [
    'https://www.instagram.com/ajou_bcube/',
    'https://www.instagram.com/sexyit_season2/',
    'https://github.com/AU-Bcube',
    'https://open.kakao.com/o/sCRuhWTg',
  ],
  keywords: [
    '비큐브',
    'B-CUBE',
    '아주대 비큐브',
    '아주대학교 비큐브',
    '아주대학교 경영인텔리전스학과',
    '경영인텔리전스학과 소학회',
    '아주대학교 IT 소학회',
    'IT 소학회',
    'IT 기획',
    '웹 개발',
    '앱 개발',
    '디자인톤',
    'IT 스터디',
    '카드뉴스',
    '섹시한 IT',
  ],
} as const;

export const SEO_UPDATED_AT = '2026-05-11';

export const absoluteUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${SITE.url}${normalizedPath === '/' ? '' : normalizedPath}`;
};

export const SITE_ROUTES = [
  {
    path: '/',
    label: '홈',
    title: SITE.title,
    description: SITE.description,
    priority: 1,
    changeFrequency: 'weekly',
  },
  {
    path: '/projects',
    label: '프로젝트',
    title: `프로젝트 | ${SITE.name}`,
    description:
      '비큐브의 디자인톤, 섹시한 IT, IT 스터디, 외부 프로젝트 결과물을 한곳에서 확인할 수 있습니다.',
    priority: 0.85,
    changeFrequency: 'weekly',
  },
  {
    path: '/reviews',
    label: '후기',
    title: `후기 | ${SITE.name}`,
    description:
      '비큐브 선배 인터뷰와 활동 사진을 통해 실제 활동 경험과 성과를 확인할 수 있습니다.',
    priority: 0.75,
    changeFrequency: 'monthly',
  },
  {
    path: '/recruit',
    label: '리크루팅',
    title: `리크루팅 | ${SITE.name}`,
    description:
      '비큐브 모집 개요, 활동 분야, 지원 방법과 자주 묻는 질문을 확인할 수 있습니다.',
    priority: 0.8,
    changeFrequency: 'weekly',
  },
] as const;

export const PROJECT_CATEGORIES = [
  {
    id: 'designton',
    name: '디자인톤',
    url: absoluteUrl('/projects#designton'),
    description:
      '팀별로 서비스 아이디어를 기획하고 피그마 기반 UI·프로토타입까지 구체화하는 비큐브의 대표 프로젝트 활동입니다.',
  },
  {
    id: 'sexy-it',
    name: '섹시한 IT',
    url: absoluteUrl('/projects#sexy-it'),
    description:
      '최신 IT 트렌드를 카드뉴스로 제작하여 인스타그램을 통해 공유하는 비큐브의 콘텐츠 제작 활동입니다.',
  },
  {
    id: 'study',
    name: 'IT 스터디',
    url: absoluteUrl('/projects#study'),
    description:
      'Python, Java, 웹 개발, 인과추론 등 실무와 프로젝트에 필요한 지식을 함께 학습하는 정기 스터디 활동입니다.',
  },
  {
    id: 'etc',
    name: '기타 프로젝트',
    url: absoluteUrl('/projects#etc'),
    description:
      '해커톤, 공모전, 외부 프로젝트 등 비큐브 구성원이 진행한 다양한 실전형 프로젝트 결과물입니다.',
  },
] as const;

export const HOME_FAQS: FaqItem[] = [
  {
    question: '비큐브 B-CUBE는 어떤 소학회인가요?',
    answer:
      '비큐브 B-CUBE는 아주대학교 경영인텔리전스학과 소속 IT·비즈니스 소학회로, 웹/앱 서비스 기획·개발, 디자인톤, IT 스터디, 카드뉴스 제작 활동을 진행합니다.',
  },
  {
    question: '비큐브의 주요 활동은 무엇인가요?',
    answer:
      '비큐브의 주요 활동은 디자인톤, 섹시한 IT 카드뉴스, IT 스터디, 웹사이트 기획 및 개발, 신입생 아이디어톤, I TALK 지식 공유 활동입니다.',
  },
  {
    question: '비큐브 활동을 통해 무엇을 경험할 수 있나요?',
    answer:
      '비큐브에서는 서비스 아이디어를 기획하고, UI를 설계하고, 개발과 배포를 경험하며, 팀 프로젝트와 발표를 통해 실무형 협업 역량을 키울 수 있습니다.',
  },
];

export const PROJECT_FAQS: FaqItem[] = [
  {
    question: '비큐브 프로젝트 페이지에서는 무엇을 볼 수 있나요?',
    answer:
      '프로젝트 페이지에서는 디자인톤 결과물, 섹시한 IT 카드뉴스, IT 스터디 활동, 외부 프로젝트와 공모전 결과물을 확인할 수 있습니다.',
  },
  {
    question: '디자인톤은 어떤 활동인가요?',
    answer:
      '디자인톤은 팀별로 앱 또는 웹 서비스 아이디어를 기획하고 사용자 분석, 화면 설계, 피그마 프로토타입 제작, 발표와 피드백까지 진행하는 활동입니다.',
  },
  {
    question: '섹시한 IT는 어떤 콘텐츠인가요?',
    answer:
      '섹시한 IT는 최신 IT 이슈와 기술 트렌드를 카드뉴스로 정리해 비큐브 공식 인스타그램에서 공유하는 콘텐츠 제작 활동입니다.',
  },
];

export const RECRUIT_FAQS: FaqItem[] = [
  {
    question: '비큐브는 어떤 사람을 모집하나요?',
    answer:
      '비큐브는 IT 서비스 기획, 디자인, 개발, 데이터, 마케팅, 카드뉴스 제작에 관심이 있고 팀 프로젝트를 통해 실제 결과물을 만들고 싶은 학생을 모집합니다.',
  },
  {
    question: '개발 경험이 없어도 지원할 수 있나요?',
    answer:
      '개발 경험이 없어도 지원할 수 있습니다. 비큐브는 기획, 마케팅, 개발, 기타 활동 분야를 함께 운영하며 관심 분야에 따라 참여할 수 있습니다.',
  },
  {
    question: '비큐브 지원 방법은 어디에서 확인하나요?',
    answer:
      '비큐브 리크루팅 페이지에서 현재 모집 여부, 모집 메시지, 지원 링크, 활동 분야와 문의 채널을 확인할 수 있습니다.',
  },
];

export const REVIEW_FAQS: FaqItem[] = [
  {
    question: '비큐브 후기 페이지에서는 무엇을 확인할 수 있나요?',
    answer:
      '후기 페이지에서는 비큐브 선배들의 인터뷰와 활동 사진을 통해 실제 활동 경험, 협업 분위기, 프로젝트 성과를 확인할 수 있습니다.',
  },
  {
    question: '비큐브 활동 사진은 어떤 의미가 있나요?',
    answer:
      '활동 사진은 학술제, 스터디 결과보고회, 해커톤과 같은 비큐브의 실제 프로젝트 경험과 수상 성과를 보여주는 자료입니다.',
  },
];
