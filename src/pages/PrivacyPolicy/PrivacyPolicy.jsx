import React from "react";
import {
  ShieldCheck,
  Lock,
  Database,
  CreditCard,
  Cookie,
  UserCheck,
  Mail,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: (
      <>
        <p>
          When you use Vyason, we may collect information that helps us
          provide, improve, secure, and personalize our services.
        </p>

        <h3>Personal Information</h3>
        <p>Depending on how you use our services, we may collect:</p>

        <ul>
          <li>Name and contact information</li>
          <li>Email address and mobile number</li>
          <li>Billing and shipping addresses</li>
          <li>Account login information</li>
          <li>Order and transaction information</li>
          <li>Customer support communications</li>
          <li>Seller/business information where applicable</li>
        </ul>

        <h3>Technical Information</h3>
        <p>
          We may automatically collect certain technical information when you
          visit or use our website, including IP address, browser type,
          device information, operating system, pages visited, referring
          URLs, and interaction information.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>We may use collected information to:</p>

        <ul>
          <li>Create and manage your Vyason account</li>
          <li>Process and deliver orders</li>
          <li>Process payments and refunds</li>
          <li>Communicate order and account updates</li>
          <li>Provide customer support</li>
          <li>Prevent fraud, abuse, and unauthorized activity</li>
          <li>Improve our website, products, and services</li>
          <li>Personalize your shopping experience</li>
          <li>Send marketing communications where permitted</li>
          <li>Comply with applicable legal and regulatory requirements</li>
        </ul>
      </>
    ),
  },
  {
    id: "payments",
    title: "3. Payments and Financial Information",
    content: (
      <>
        <p>
          Vyason may use third-party payment service providers to process
          online payments. Payment information may be transmitted directly
          to the applicable payment provider and handled according to its
          privacy and security practices.
        </p>

        <p>
          Vyason does not intentionally store complete card numbers, CVV
          numbers, or other sensitive payment credentials on its own
          servers unless specifically required and legally permitted.
        </p>

        <p>
          Payment-related information may include transaction identifiers,
          payment status, payment method, and other information required to
          confirm and reconcile a transaction.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "4. Cookies and Similar Technologies",
    content: (
      <>
        <p>
          Vyason may use cookies and similar technologies to operate the
          website, remember preferences, understand website usage, maintain
          sessions, improve performance, and provide relevant content.
        </p>

        <p>
          You may be able to control or disable cookies through your browser
          settings. Certain website functionality may not work correctly if
          required cookies are disabled.
        </p>
      </>
    ),
  },
  {
    id: "sharing-information",
    title: "5. How We Share Information",
    content: (
      <>
        <p>
          We do not sell your personal information as a standalone product.
          We may share information with trusted parties when reasonably
          necessary to operate our business and provide our services.
        </p>

        <h3>Service Providers</h3>
        <p>
          Information may be shared with providers that support payment
          processing, hosting, analytics, communication, logistics,
          customer support, security, and other business operations.
        </p>

        <h3>Marketplace Sellers</h3>
        <p>
          Where Vyason operates as a marketplace, relevant order information
          may be shared with the seller responsible for fulfilling your
          order. Sellers are expected to handle customer information only
          for legitimate purposes connected with the transaction.
        </p>

        <h3>Legal Requirements</h3>
        <p>
          We may disclose information when required by applicable law,
          regulation, legal process, court order, or governmental request,
          or when necessary to protect our rights, users, or platform.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "6. Data Security",
    content: (
      <>
        <p>
          Vyason takes reasonable technical and organizational measures to
          protect personal information against unauthorized access,
          alteration, disclosure, misuse, or destruction.
        </p>

        <p>
          Security measures may include access controls, authentication,
          encryption where appropriate, secure communications, monitoring,
          and other industry-standard safeguards.
        </p>

        <p>
          However, no method of transmission or electronic storage is
          completely secure. Therefore, we cannot guarantee absolute
          security of information.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "7. Data Retention",
    content: (
      <>
        <p>
          We retain personal information only for as long as reasonably
          necessary to provide our services, maintain business and
          transaction records, resolve disputes, enforce agreements, prevent
          fraud, and comply with applicable legal obligations.
        </p>

        <p>
          Retention periods may vary depending on the type of information
          and the purpose for which it was collected.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "8. Your Privacy Rights",
    content: (
      <>
        <p>
          Depending on applicable law, you may have rights relating to your
          personal information, including the right to:
        </p>

        <ul>
          <li>Request access to personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion where legally applicable</li>
          <li>Withdraw certain consents</li>
          <li>Object to or restrict certain processing</li>
          <li>Opt out of certain marketing communications</li>
          <li>Raise a privacy-related complaint</li>
        </ul>

        <p>
          Requests may be subject to verification and applicable legal
          limitations.
        </p>
      </>
    ),
  },
  {
    id: "marketing",
    title: "9. Marketing Communications",
    content: (
      <>
        <p>
          With your consent where required, Vyason may send promotional
          emails, SMS messages, notifications, or other communications about
          products, offers, services, and updates.
        </p>

        <p>
          You can unsubscribe from promotional communications by using the
          available unsubscribe mechanism or by contacting us.
        </p>

        <p>
          Please note that transactional communications, such as order
          confirmations, payment notifications, security alerts, and
          important account notices, may still be sent when necessary.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    content: (
      <p>
        Vyason's services are not intended to be used by children in
        circumstances where applicable law prohibits such use. We do not
        knowingly collect personal information from children in violation
        of applicable law. If you believe that a child has provided us with
        personal information, please contact us so that we can take
        appropriate action.
      </p>
    ),
  },
  {
    id: "third-party-links",
    title: "11. Third-Party Websites and Services",
    content: (
      <p>
        Our website may contain links to third-party websites, applications,
        payment services, social media platforms, or other services. These
        third parties operate independently and may have their own privacy
        policies. Vyason is not responsible for the privacy practices of
        third-party websites or services that we do not control.
      </p>
    ),
  },
  {
    id: "seller-privacy",
    title: "12. Seller and Marketplace Privacy",
    content: (
      <>
        <p>
          If you purchase products from sellers using the Vyason marketplace,
          certain information required to fulfill your order may be made
          available to the relevant seller.
        </p>

        <p>
          Sellers may process information such as your name, delivery
          address, contact details, order details, and shipping information
          solely for purposes connected with fulfilling marketplace
          transactions and complying with applicable obligations.
        </p>
      </>
    ),
  },
  {
    id: "policy-changes",
    title: "13. Changes to This Privacy Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time to reflect
        changes in our services, technology, legal requirements, or business
        practices. When we make changes, we will update the effective date
        displayed on this page. Continued use of our services after an
        update may be subject to the revised Privacy Policy.
      </p>
    ),
  },
];

const iconMap = {
  "information-we-collect": Database,
  "how-we-use-information": UserCheck,
  payments: CreditCard,
  cookies: Cookie,
  "sharing-information": UserCheck,
  "data-security": Lock,
  "data-retention": Database,
  "your-rights": ShieldCheck,
  marketing: Mail,
};



const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
    
          <section className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                  <ShieldCheck className="h-4 w-4" />
                  Your Privacy Matters
                </div>
    
                <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                  Privacy Policy
                </h1>
    
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  This Privacy Policy explains how Vyason collects, uses,
                  protects, and manages information when you use our website,
                  marketplace, products, and services.
                </p>
    
                {/* <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>Effective Date: September 30, 2026</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Last Updated: September 30, 2026</span>
                </div> */}
              </div>
            </div>
          </section>
    
          {/* Main */}
          <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
              {/* Sidebar */}
              <aside className="lg:sticky lg:top-50 lg:h-fit">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">
                   Topics
                  </h2>
    
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <span>{section.title.replace(/^\d+\.\s/, "")}</span>
                        <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
    
              {/* Content */}
              <article className="min-w-0">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                  <div className="mb-10 rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                    <p className="text-sm leading-6 text-indigo-900">
                      <strong>Important:</strong> This Privacy Policy is intended
                      to explain Vyason's general privacy practices. Your specific
                      rights and our obligations may vary depending on applicable
                      laws and the services you use.
                    </p>
                  </div>
    
                  {sections.map((section, index) => {
                    const Icon = iconMap[section.id] || ShieldCheck;
    
                    return (
                      <section
                        key={section.id}
                        id={section.id}
                        className={`scroll-mt-45 ${
                          index !== 0
                            ? "border-t border-slate-200 pt-10"
                            : ""
                        } ${index !== sections.length - 1 ? "pb-10" : ""}`}
                      >
                        <div className="mb-5 flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Icon className="h-5 w-5" />
                          </div>
    
                          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                            {section.title}
                          </h2>
                        </div>
    
                        <div className="prose prose-slate max-w-none">
                          {section.content}
                        </div>
                      </section>
                    );
                  })}
    
                  {/* Contact */}
                  <section
                    id="contact"
                    className="scroll-mt-28 border-t border-slate-200 pt-10"
                  >
                    <div className="rounded-2xl bg-slate-950 p-7 text-white sm:p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                          <Mail className="h-5 w-5" />
                        </div>
    
                        <div>
                          <h2 className="text-2xl font-bold">
                            14. Contact Us
                          </h2>
    
                          <p className="mt-3 leading-7 text-slate-300">
                            If you have questions, concerns, or requests regarding
                            this Privacy Policy or your personal information,
                            please contact Vyason using the details below.
                          </p>
    
                          <div className="mt-6 space-y-2 text-sm">
                            <p>
                              <span className="font-semibold text-white">
                                Company:
                              </span>{" "}
                              Vyason
                            </p>
    
                            {/* <p>
                              <span className="font-semibold text-white">
                                Email:
                              </span>{" "}
                              privacy@vyason.com
                            </p>
    
                            <p>
                              <span className="font-semibold text-white">
                                Website:
                              </span>{" "}
                              www.vyason.com
                            </p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
    
                  
                </div>
              </article>
            </div>
          </main>
        </div>
      );
}

export default PrivacyPolicy
