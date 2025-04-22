import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "50K+",
    label: "Active Users",
  },
  {
    value: "$2B+",
    label: "Transactions Tracked",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Advanced Analytics",
    description:
      "Get detailed insights into your spending patterns with AI-powered analytics",
  },
  {
    icon: <Receipt className="h-8 w-8" />,
    title: "Smart Receipt Scanner",
    description:
      "Extract data automatically from receipts using advanced AI technology",
  },
  {
    icon: <PieChart className="h-8 w-8" />,
    title: "Budget Planning",
    description: "Create and manage budgets with intelligent recommendations",
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Multi-Account Support",
    description: "Manage multiple accounts and credit cards in one place",
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Multi-Currency",
    description: "Support for multiple currencies with real-time conversion",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Automated Insights",
    description: "Get automated financial insights and recommendations",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Create Your Account",
    description:
      "Get started in minutes with our simple and secure sign-up process",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Track Your Spending",
    description:
      "Automatically categorize and track your transactions in real-time",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Get Insights",
    description:
      "Receive AI-powered insights and recommendations to optimize your finances",
  },
];

// Testimonials Data
export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    quote:
      "FinSync has transformed how I manage my business finances. The AI insights have helped me identify cost-saving opportunities I never knew existed.",
  },
  {
    name: "Michael Chen",
    role: "Freelancer",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    quote:
      "The receipt scanning feature saves me hours each month. Now I can focus on my work instead of manual data entry and expense tracking.",
  },
  {
    name: "Emily Rodriguez",
    role: "Financial Advisor",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    quote:
      "I recommend FinSync to all my clients. The multi-currency support and detailed analytics make it perfect for international investors.",
  },
];

// FAQs Data
export const faqsData = [
  {
    number: "item-1",
    question: "How do I add a new transaction?",
    answer: "You can add a new transaction manually or use our Smart AI Receipt Scanner to automatically extract and log details from your receipt — making the process quick and effortless."
  },
  {
    number: "item-2",
    question: "Can I track spending across multiple accounts?",
    answer: "Absolutely! You can manage and track transactions across various accounts like savings, investment, and main accounts — all in one place."
  },
  {
    number: "item-3",
    question: "What kind of insights will I receive via email?",
    answer: "Each month, we'll send you a detailed breakdown of your spending and earnings, highlighting patterns, trends, and areas to improve—helping you stay financially informed."
  },
  {
    number: "item-4",
    question: "How do budget alerts work?",
    answer: "Simply set your monthly budget, and we'll notify you via email if your spending approaches or exceeds your set limit — keeping your finances in check."
  },
  {
    number: "item-5",
    question: "What kind of analytics are available?",
    answer: "Our dashboard provides intuitive bar and pie charts to help you visualize your financial data, compare monthly trends, and make smarter money decisions."
  }
];