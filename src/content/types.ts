export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedCalculatorRef {
  title: string;
  slug: string;
}

export interface CalculatorPageContent {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  whatIsTitle: string;
  whatIsContent: string;
  formulaTitle: string;
  formulaCode: string;
  formulaVariables: { label: string; desc: string }[];
  exampleTitle: string;
  exampleContent: string;
  faqTitle: string;
  faqs: FAQItem[];
  relatedTitle: string;
  relatedCalculators: RelatedCalculatorRef[];
}

export interface HomePageContent {
  metaTitle: string;
  metaDescription: string;
  heroH1: string;
  heroSubtitle: string;
  featuredTitle: string;
  featuredDesc: string;
  calculators: {
    slug: string;
    title: string;
    description: string;
    badge: string;
  }[];
  whyUsTitle: string;
  whyUsItems: {
    title: string;
    desc: string;
  }[];
}

export interface NavContent {
  brandName: string;
  calculators: string;
  guides: string;
  about: string;
  switchLangLabel: string;
  switchLangTarget: string;
  switchLangCode: 'en' | 'zh';
}

export interface LocaleContent {
  nav: NavContent;
  home: HomePageContent;
  capRate: CalculatorPageContent;
  noi: CalculatorPageContent;
  cashOnCash: CalculatorPageContent;
  dscr: CalculatorPageContent;
  loanPayment: CalculatorPageContent;
}
