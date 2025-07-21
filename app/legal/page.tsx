"use client";
import { useState } from "react";
import { Download, FileText, Shield, Scale, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import Footer from "@/components/footer";

export default function LegalPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const legalSections = [
    {
      id: "terms",
      title: "Terms of Service",
      icon: <FileText className="w-5 h-5" />,
      summary: "Conditions and rules for using Game Tested Tech platform and services.",
      content: `
        Welcome to Game Tested Tech. By accessing and using our website, you agree to comply with and be bound by the following terms and conditions.

        **1. Acceptance of Terms**
        By using our service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.

        **2. Use of Service**
        - You must be at least 13 years old to use our service
        - You are responsible for maintaining the confidentiality of your account
        - You agree not to use the service for any unlawful purposes

        **3. Content and Reviews**
        - All content provided is for informational purposes only
        - Product reviews and recommendations are based on our testing and experience
        - We reserve the right to modify or remove content at any time

        **4. Intellectual Property**
        All content, logos, and materials on this site are owned by Game Tested Tech and protected by copyright laws.

        **5. Limitation of Liability**
        Game Tested Tech shall not be liable for any direct, indirect, or consequential damages arising from your use of our service.
      `
    },
    {
      id: "privacy",
      title: "Privacy Policy", 
      icon: <Shield className="w-5 h-5" />,
      summary: "How we collect, use, and protect your personal information and data.",
      content: `
        **Information We Collect**
        - Personal information you provide (name, email, etc.)
        - Usage data and analytics
        - Cookies and tracking technologies

        **How We Use Your Information**
        - To provide and improve our services
        - To send newsletters and updates (with your consent)
        - To analyze website usage and performance

        **Data Protection**
        - We use industry-standard security measures
        - Your data is never sold to third parties
        - You can request data deletion at any time

        **Cookies**
        We use cookies to enhance your browsing experience and analyze site traffic.

        **Third-Party Services**
        We may use services like Google Analytics to improve our website performance.

        **Contact Us**
        For any privacy-related questions, contact us at privacy@gametestedtech.com
      `
    },
    {
      id: "disclaimer",
      title: "Legal Disclaimer",
      icon: <Scale className="w-5 h-5" />,
      summary: "Important disclaimers regarding our content and recommendations.",
      content: `
        **Product Reviews Disclaimer**
        - Reviews are based on our personal testing and experience
        - Results may vary depending on individual use cases
        - We may receive compensation for affiliate links

        **Technical Information**
        - All technical specifications are provided for informational purposes
        - We are not responsible for any damage caused by following our guides
        - Always consult official documentation before making changes

        **Affiliate Links**
        This website contains affiliate links. We may earn a commission when you make purchases through these links, at no additional cost to you.

        **External Links**
        We are not responsible for the content or practices of external websites linked from our site.

        **Gaming Content**
        Gaming performance results are based on our testing hardware and may not reflect your system's performance.
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] text-white">
      <Header />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35]/20 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 bg-[#1a1a1a]/50 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Scale className="w-6 h-6 text-[#ff6b35]" />
              <span className="text-lg font-semibold">Legal Information</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Legal</span>{" "}
              <span className="text-[#ff6b35]">Notice</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transparency and trust are fundamental to our gaming community. 
              Here you'll find all the legal information about Game Tested Tech, 
              including our terms of service, privacy policy, and important disclaimers.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#1a1a2e] to-transparent"></div>
      </div>

      {/* Legal Sections */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {legalSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1a1a]/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 text-left hover:bg-[#1a1a1a]/80 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#ff6b35]/20 rounded-lg text-[#ff6b35] group-hover:bg-[#ff6b35]/30 transition-colors">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#ff6b35] transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-gray-400 mt-1">
                        {section.summary}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSection === section.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-700"
                >
                  <div className="p-6 prose prose-invert max-w-none">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* PDF Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-[#ff6b35]/10 to-[#ff6b35]/5 border border-[#ff6b35]/20 rounded-xl p-8 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-[#ff6b35]/20 px-4 py-2 rounded-full mb-4">
            <FileText className="w-5 h-5 text-[#ff6b35]" />
            <span className="text-[#ff6b35] font-semibold">Download Legal Documents</span>
          </div>
          <h3 className="text-2xl font-bold mb-4">Complete Legal Documentation</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Download our complete legal documentation including Terms of Service, Privacy Policy, 
            and all disclaimers in a comprehensive PDF format.
          </p>
          <button className="inline-flex items-center gap-3 bg-[#ff6b35] hover:bg-[#ff6b35]/80 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
            <Download className="w-5 h-5" />
            Download Legal PDF
          </button>
          <p className="text-gray-500 text-sm mt-3">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center p-6 bg-[#1a1a1a]/30 rounded-xl border border-gray-700"
        >
          <h4 className="text-lg font-semibold mb-2">Questions about our legal policies?</h4>
          <p className="text-gray-400 mb-4">
            Contact our legal team at <span className="text-[#ff6b35]">legal@gametestedtech.com</span>
          </p>
          <div className="text-sm text-gray-500">
            We typically respond within 24-48 hours during business days.
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}