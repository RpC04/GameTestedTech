"use client";
import { useState } from "react";
import { Download, FileText, Shield, Scale, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import Footer from "@/components/footer";

export default function LegalPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleDownload = async (url: string, filename: string, sectionId: string) => {
    setDownloadingId(sectionId);
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object after download
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback: open in new tab if download fails
      window.open(url, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const legalSections = [
    {
      id: "terms",
      title: "Terms of Service",
      icon: <FileText className="w-5 h-5" />,
      summary: "Conditions and rules for using Game Tested Tech platform and services.",
      pdfUrl: "https://iqzmidqszkbtvkdaeyzg.supabase.co/storage/v1/object/public/imagesweb/legalDocument/Legal-Notice.pdf",
      pdfName: "Legal-Notice.pdf",
      content: ` Welcome to Game Tested Tech (“we,” “us,” or “our”). These Terms of Service govern your use of our website located at gametestedtech.com and any services, content, or features provided through the site. 
        By accessing or using the site, you agree to these Terms. If you do not agree, please do not use the site. 
      `
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: <Shield className="w-5 h-5" />,
      pdfUrl: "https://iqzmidqszkbtvkdaeyzg.supabase.co/storage/v1/object/public/imagesweb/legalDocument/Private-Policy.pdf",
      pdfName: "Private-Policy.pdf",
      summary: "How we collect, use, and protect your personal information and data.",
      content: ` Game Tested Tech ("we," "our," or "us") values the privacy and security of our visitors and users. This Privacy Policy outlines the types of information we collect, how we use it, and the choices you have regarding your personal data. By accessing or using our website, you agree to the terms of this Privacy Policy. 
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
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedSection === section.id ? "rotate-180" : ""
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
                      <button
                        onClick={() => handleDownload(section.pdfUrl, section.pdfName, section.id)}
                        className="inline-flex items-center gap-3 bg-[#ff6b35] hover:bg-[#ff6b35]/80 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                        <Download className="w-5 h-5" />
                        Download Legal PDF
                      </button>
                      <p className="text-gray-500 text-sm mt-3">
                        Last updated: {new Date().toLocaleDateString()}
                      </p>
                    </motion.div>
                  </div>

                </motion.div>
              )}
            </motion.div>
          ))}
        </div>



        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center p-6 bg-[#1a1a1a]/30 rounded-xl border border-gray-700"
        >
          <h4 className="text-lg font-semibold mb-2">Questions about our legal policies?</h4>
          <p className="text-gray-400 mb-4">
            Contact our legal team at <span className="text-[#ff6b35]">info@gametestedtech.com</span>
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