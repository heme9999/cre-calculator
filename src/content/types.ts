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
  dealAnalyzer: string;
  capRate: string;
  noi: string;
  cashOnCash: string;
  loanPayment: string;
  dscr: string;
  exchange1031: string;
  leaseVsBuy: string;
  breakEvenRatio: string;
  guides: string;
  about: string;
  switchLangLabel: string;
  switchLangTarget: string;
  switchLangCode: 'en' | 'zh';
}

export interface CapRateBenchmarkRow {
  propertyType: string;
  range: string;
  notes: string;
}

export interface CapRateBenchmarkTier {
  tierName: string;
  tierDescription: string;
  rows: CapRateBenchmarkRow[];
}

export interface MarketTierRow {
  tier: string;
  metros: string;
  pricing: string;
}

export interface GuidePageContent {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  disclaimer: string;
  propertyTypeTitle: string;
  propertyTypeTableHeader: {
    type: string;
    range: string;
    notes: string;
  };
  propertyTypes: CapRateBenchmarkRow[];
  marketTierTitle: string;
  marketTierIntro: string;
  marketTierTableHeader: {
    tier: string;
    metros: string;
    pricing: string;
  };
  marketTiers: MarketTierRow[];
  chineseInvestorTitle?: string;
  chineseInvestorContent?: string;
  faqTitle: string;
  faqs: FAQItem[];
  dataSourcesTitle: string;
  dataSources: string[];
  relatedTitle: string;
  relatedCalculators: RelatedCalculatorRef[];
}

export interface ArticleSection {
  title: string;
  content: string;
}

export interface ArticleGuideContent {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  disclaimer?: string;
  sections: ArticleSection[];
  faqTitle: string;
  faqs: FAQItem[];
  dataSourcesTitle?: string;
  dataSources?: string[];
  relatedTitle: string;
  relatedCalculators: RelatedCalculatorRef[];
}

export interface GuideHubItem {
  slug: string;
  title: string;
  description: string;
  badge: string;
  readTime: string;
}

export interface GuidesHubPageContent {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  guides: GuideHubItem[];
}

export interface LocaleContent {
  nav: NavContent;
  home: HomePageContent;
  dealAnalyzer: CalculatorPageContent;
  capRate: CalculatorPageContent;
  noi: CalculatorPageContent;
  cashOnCash: CalculatorPageContent;
  loanPayment: CalculatorPageContent;
  dscr: CalculatorPageContent;
  exchange1031: CalculatorPageContent;
  leaseVsBuy: CalculatorPageContent;
  breakEvenRatio: CalculatorPageContent;
  capRateBenchmarksGuide: GuidePageContent;
  howToEstimateNoiGuide: ArticleGuideContent;
  exchange1031ProcessGuide: ArticleGuideContent;
  howToUnderwriteDealGuide: ArticleGuideContent;
  dscrLoanGuideChineseInvestorsGuide?: ArticleGuideContent;
  guidesHub: GuidesHubPageContent;
}
