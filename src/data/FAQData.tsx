import { FAQCategory } from "@/types/FAQ.type";

export const faqData: FAQCategory[] = [
  {
    label: "General",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    items: [
      {
        q: "What is RedactAI?",
        a: "RedactAI is an AI-assisted procurement drafting and review platform built exclusively for Spanish public administrations. It helps officials prepare legally compliant tender documents faster, with every suggestion grounded in the Official State Gazette (BOE) and approved procurement precedents.",
      },
      {
        q: "Who is RedactAI designed for?",
        a: "RedactAI is designed specifically for procurement officers, legal advisors, and administrative staff within Spanish public administrations — from municipal ayuntamientos to regional governments and national agencies.",
      },
      {
        q: "Is RedactAI a replacement for legal counsel?",
        a: "No. RedactAI is a tool that assists legal and administrative professionals — it does not replace them. Every suggestion requires human review and approval. The platform is designed to reduce manual workload and legal risk, not to make autonomous legal decisions.",
      },
      {
        q: "In what languages is RedactAI available?",
        a: "RedactAI currently supports Spanish (Castilian). Support for Catalan, Basque, and Galician is on our roadmap for 2025.",
      },
    ],
  },
  {
    label: "Documents & Upload",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    items: [
      {
        q: "What file formats does RedactAI support?",
        a: "RedactAI accepts Word documents (.docx) and PDF files. For best results, we recommend submitting editable Word documents. PDF support includes automatic text extraction for scanned and digitally-created PDFs.",
      },
      {
        q: "What is the maximum document size?",
        a: "RedactAI supports tender documents from 25 pages up to 890 pages. Files up to 200 MB can be uploaded directly. If your document is larger, please contact our support team for an assisted upload.",
      },
      {
        q: "Is my document data secure?",
        a: "Yes. All documents are encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. RedactAI is fully compliant with the EU General Data Protection Regulation (GDPR) and Spain's Organic Law on Data Protection (LOPDGDD). Documents are never used to train any AI models.",
      },
      {
        q: "Can I start from a blank template instead of uploading?",
        a: "Yes. RedactAI includes a library of official government templates sourced from the Ministry of Finance's procurement portal. You can start any tender directly from one of these templates and build it out with AI assistance.",
      },
    ],
  },
  {
    label: "AI & Suggestions",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    items: [
      {
        q: "Where do the AI suggestions come from?",
        a: "Every suggestion is derived from official sources only — primarily the Official State Gazette (BOE), the Government Procurement Portal (PLACE), and a curated database of approved Spanish public tenders. RedactAI never invents information or uses unverified sources.",
      },
      {
        q: "Can the AI make changes to my document automatically?",
        a: "No. This is a core principle of RedactAI. Zero changes are applied automatically. Every suggestion is shown to you for review, and you must explicitly accept, edit, or reject each one before it is applied. This ensures full human control at every step.",
      },
      {
        q: "What does a suggestion look like?",
        a: "Each suggestion is displayed in a side-by-side view showing your original text alongside the proposed revision. Below the comparison, you'll see a plain-language explanation of why the change is recommended and the specific legal article or provision it references.",
      },
      {
        q: "What happens if I disagree with a suggestion?",
        a: "You can reject any suggestion with a single click. Rejected suggestions are logged in your audit trail but are never applied to the document. You can also edit a suggestion inline before accepting it, giving you full control over the final wording.",
      },
    ],
  },
  {
    label: "Compliance & Legal",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    items: [
      {
        q: "What Spanish procurement laws does RedactAI cover?",
        a: "RedactAI covers Law 9/2017 on Public Sector Contracts (LCSP), Royal Decree 1098/2001, Royal Decree 817/2009, and the relevant EU Directives 2014/23/EU and 2014/24/EU as transposed into Spanish law. The legal database is updated regularly to reflect new BOE publications.",
      },
      {
        q: "Does RedactAI provide a compliance certificate?",
        a: "RedactAI generates a compliance summary report with every export. This report outlines the issues detected, the suggestions made, and the decisions taken by the reviewing officer. While this is not a formal legal certificate, it provides a structured compliance record suitable for administrative files.",
      },
      {
        q: "Is there an audit trail?",
        a: "Yes. Every action taken within a document — including which suggestions were accepted, edited, or rejected, and by whom — is recorded in a timestamped audit log. This log is exportable alongside the final document and can be submitted as part of the administrative file.",
      },
      {
        q: "Can RedactAI help if a tender has already been challenged?",
        a: "RedactAI is a drafting and review tool, not a legal defence service. If a tender has already been impugned, we recommend consulting a qualified procurement lawyer. RedactAI can help you prepare future documents that reduce the risk of similar challenges.",
      },
    ],
  },
  {
    label: "Pricing & Plans",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    items: [
      {
        q: "How is RedactAI priced?",
        a: "RedactAI is offered on a per-administration subscription basis. Pricing scales with the number of active users and the volume of documents processed per month. Contact our sales team for a tailored quote based on your administration's procurement volume.",
      },
      {
        q: "Is there a free trial?",
        a: "Yes. We offer a 14-day free trial with full access to all features, including document upload, AI analysis, and export. No credit card is required to start your trial.",
      },
      {
        q: "Are there discounts for smaller administrations?",
        a: "Yes. We have special pricing tiers for smaller municipalities and local bodies with lower procurement volumes. Please reach out to our sales team to discuss your specific situation.",
      },
      {
        q: "Can we pay via public procurement framework?",
        a: "Yes. RedactAI can be procured through approved framework agreements for software services. Contact us with your administration's procurement requirements and we will provide the necessary documentation.",
      },
    ],
  },
];

