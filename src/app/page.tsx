"use client";

import { useState } from "react";
import {
  ArrowRight,
  Brain,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  CreditCard,
  Users,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Detection",
    description:
      "Automatically identify revenue loss patterns across carts, payments, and subscriptions using machine learning.",
    icon: Brain,
  },
  {
    title: "Real-Time Recovery",
    description:
      "Trigger smart recovery workflows instantly when anomalies are detected, maximizing win-back rates.",
    icon: Zap,
  },
  {
    title: "Revenue Analytics",
    description:
      "Visual dashboards show recovered revenue, risk exposure, and campaign performance in one place.",
    icon: BarChart3,
  },
  {
    title: "Smart Payment Retry",
    description:
      "Intelligently retry failed payments at optimal times to reduce involuntary churn.",
    icon: CreditCard,
  },
  {
    title: "Customer Insights",
    description:
      "Segment at-risk customers and personalize recovery outreach based on behavior signals.",
    icon: Users,
  },
  {
    title: "Secure & Compliant",
    description:
      "Enterprise-grade encryption and SOC 2-ready infrastructure protect every transaction.",
    icon: Shield,
  },
];

const steps = [
  {
    title: "Connect Your Data",
    description:
      "Integrate with your payment processor, CRM, or e-commerce platform in minutes.",
  },
  {
    title: "AI Analysis",
    description:
      "Our models scan transactions, carts, and subscriptions to pinpoint revenue at risk.",
  },
  {
    title: "Automated Recovery",
    description:
      "Smart workflows recover revenue through emails, payment retries, and offers.",
  },
  {
    title: "Track Results",
    description:
      "Monitor recovered revenue, recovery rate, and ROI through live dashboards.",
  },
];

const metrics = [
  { label: "Revenue Recovered", value: "$2.4M+" },
  { label: "Recovery Rate", value: "34%" },
  { label: "Active Clients", value: "850+" },
  { label: "Avg. Time to Recovery", value: "< 2 min" },
];

const insights = [
  "Abandoned cart emails sent within 30 minutes recover 2x more revenue.",
  "Smart payment retries reduce failed payment churn by up to 28%.",
  "Businesses using AI recovery see an average 18% increase in monthly revenue.",
];

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Insights", href: "#insights" },
  { name: "Pricing", href: "#pricing" },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">
              AI Revenue Recovery
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-slate-700 transition-colors hover:text-indigo-600"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600 md:inline-block"
            >
              Login
            </a>
            <a
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Get Started
            </a>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-100">
            <div className="container mx-auto flex flex-col gap-2 px-4 py-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-slate-700 transition-colors hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="/login"
                className="text-sm font-medium text-indigo-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 to-transparent"></div>
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Recover Lost Revenue
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {" "}
                  with AI
                </span>
              </h1>
              <p className="text-lg text-slate-600">
                Automatically recover revenue from abandoned carts, failed
                payments, and subscription churn with an intelligent revenue
                recovery platform.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  Get Started
                  <ArrowRight size={16} className="ml-2" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  See How It Works
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-emerald-100 opacity-60 blur-3xl"></div>
              <div className="relative grid grid-cols-2 gap-3 md:gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <Brain size={20} />
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-700">
                    AI Powered
                  </p>
                </div>
                <div className="translate-y-8 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <TrendingUp size={20} />
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-700">
                    Revenue Growth
                  </p>
                </div>
                <div className="translate-y-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:translate-y-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-700">
                    Auto Recovery
                  </p>
                </div>
                <div className="translate-y-12 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:translate-y-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <BarChart3 size={20} />
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-700">
                    Live Analytics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section id="metrics" className="border-y border-slate-100 bg-slate-50 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-2xl font-bold text-indigo-600 md:text-3xl">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs text-slate-500 md:text-sm">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Everything you need to recover revenue
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              From detection to recovery, AI Revenue Recovery handles the full
              lifecycle of lost revenue.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-3 text-sm text-slate-500">
              Four simple steps to start recovering revenue automatically.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Insights */}
      <section id="insights" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              AI Recovery Insights
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Real observations from our AI models to help you understand and
              act on revenue loss faster.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => (
              <div
                key={insight}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Powerful Revenue Dashboard
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Monitor recovered revenue, risk exposure, and recovery campaigns
              from a single dashboard.
            </p>
          </div>
          <div className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Recovered Revenue</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  $29,670
                </p>
                <span className="text-xs text-emerald-600">+18.4%</span>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Recovery Rate</p>
                <p className="mt-1 text-lg font-bold text-slate-900">24.8%</p>
                <span className="text-xs text-emerald-600">+4.2%</span>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Customers Recovered</p>
                <p className="mt-1 text-lg font-bold text-slate-900">1,284</p>
                <span className="text-xs text-emerald-600">+12.6%</span>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Pending Recovery</p>
                <p className="mt-1 text-lg font-bold text-slate-900">$8,430</p>
                <span className="text-xs text-amber-600">-3.1%</span>
              </div>
            </div>
            <div className="mt-4 h-48 rounded-lg border border-slate-200 bg-slate-50"></div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to recover more revenue?
          </h2>
          <p className="mt-3 text-sm text-indigo-100">
            Join hundreds of businesses already using AI Revenue Recovery to
            recapture lost revenue.
          </p>
          <a
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            Get Started
            <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-xl font-bold text-indigo-600">
                AI Revenue Recovery
              </span>
              <p className="mt-2 text-sm text-slate-500">
                Recover lost revenue from carts, payments, and churn with
                AI-powered automation.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Product</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#metrics"
                    className="text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    Metrics
                  </a>
                </li>
                <li>
                  <a
                    href="#insights"
                    className="text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    Insights
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Company</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Legal</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-4 text-center text-sm text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} AI Revenue Recovery. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
