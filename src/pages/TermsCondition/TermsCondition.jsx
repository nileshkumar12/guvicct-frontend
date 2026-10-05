

import {
  FileText,
  UserCheck,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  Store,
  AlertTriangle,
  Scale,
  Mail,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: FileText,
    content: (
      <>
        <p>
          Welcome to Vyason. These Terms & Conditions ("Terms") govern your
          access to and use of the Vyason website, marketplace, applications,
          products, services, and related features.
        </p>

        <p>
          By accessing, browsing, registering for an account, placing an
          order, purchasing a product, or otherwise using Vyason, you agree
          to be bound by these Terms and our applicable policies.
        </p>

        <p>
          If you do not agree with any part of these Terms, you should not
          access or use our services.
        </p>
      </>
    ),
  },

  {
    id: "eligibility",
    title: "2. Eligibility and Account",
    icon: UserCheck,
    content: (
      <>
        <p>
          You must provide accurate and complete information when creating
          an account or placing an order through Vyason.
        </p>

        <p>You are responsible for:</p>

        <ul>
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>Keeping your account information accurate and updated</li>
          <li>All activities performed through your account</li>
          <li>Immediately notifying Vyason of unauthorized account access</li>
        </ul>

        <p>
          Vyason reserves the right to suspend or terminate accounts where
          we reasonably believe there has been misuse, fraud, violation of
          these Terms, or unlawful activity.
        </p>
      </>
    ),
  },

  {
    id: "marketplace",
    title: "3. Vyason Marketplace",
    icon: Store,
    content: (
      <>
        <p>
          Vyason may operate as an online marketplace connecting customers
          with independent sellers and businesses.
        </p>

        <p>
          Products listed on the marketplace may be offered by Vyason or by
          third-party sellers. Where a product is sold by an independent
          seller, the seller may be responsible for product availability,
          product information, fulfillment, warranties, and other seller
          obligations as applicable.
        </p>

        <p>
          Vyason may facilitate payments, order processing, communications,
          shipping coordination, customer support, and other marketplace
          services.
        </p>
      </>
    ),
  },

  {
    id: "products",
    title: "4. Product Information and Availability",
    icon: ShoppingBag,
    content: (
      <>
        <p>
          We make reasonable efforts to display accurate product
          descriptions, images, prices, specifications, availability, and
          other information.
        </p>

        <p>
          However, product images may vary slightly from the actual product,
          particularly due to screen settings, photography, packaging
          changes, or manufacturer updates.
        </p>

        <p>
          Product availability may change without notice. Vyason or the
          applicable seller may cancel an order if a product is unavailable,
          incorrectly listed, discontinued, or otherwise cannot be fulfilled.
        </p>

        <p>
          Where an order is cancelled after payment has been received, the
          applicable refund will be processed according to our refund
          procedures.
        </p>
      </>
    ),
  },

  {
    id: "pricing",
    title: "5. Pricing, Taxes and Offers",
    icon: CreditCard,
    content: (
      <>
        <p>
          Product prices displayed on Vyason may change from time to time.
          Prices may include or exclude applicable taxes, delivery charges,
          platform charges, or other fees depending on how they are displayed
          during checkout.
        </p>

        <p>
          We reserve the right to correct pricing, promotional, typographical,
          or other listing errors.
        </p>

        <p>
          Promotional offers, coupons, discounts, and promotional codes may
          have additional eligibility requirements, validity periods, usage
          limits, or product restrictions.
        </p>

        <p>
          Vyason may cancel or modify a promotion where there is suspected
          misuse, technical error, fraudulent activity, or other legitimate
          reason.
        </p>
      </>
    ),
  },

  {
    id: "orders",
    title: "6. Orders and Order Acceptance",
    icon: ShoppingBag,
    content: (
      <>
        <p>
          Placing an order through Vyason constitutes a request to purchase
          the selected products. An order is subject to acceptance,
          availability, payment authorization, and other applicable
          conditions.
        </p>

        <p>
          After placing an order, you may receive an order confirmation.
          This confirmation does not necessarily guarantee that the order
          will be fulfilled if a subsequent issue is identified.
        </p>

        <p>We may cancel an order in circumstances including:</p>

        <ul>
          <li>Product unavailability</li>
          <li>Incorrect pricing or product information</li>
          <li>Payment authorization failure</li>
          <li>Suspected fraud or unauthorized activity</li>
          <li>Shipping or address-related issues</li>
          <li>Violation of applicable terms or policies</li>
          <li>Other circumstances preventing lawful fulfillment</li>
        </ul>
      </>
    ),
  },

  {
    id: "payments",
    title: "7. Payments",
    icon: CreditCard,
    content: (
      <>
        <p>
          Vyason may support payment methods including credit cards, debit
          cards, UPI, wallets, net banking, cash on delivery, and other
          payment methods made available during checkout.
        </p>

        <p>
          Payments may be processed by third-party payment service providers.
          Your use of such payment methods may also be subject to the
          applicable provider's terms and conditions.
        </p>

        <p>
          An order requiring online payment may only be confirmed after
          successful payment authorization or verification.
        </p>

        <p>
          Vyason may use transaction information to verify payments, prevent
          fraud, reconcile orders, process refunds, and provide customer
          support.
        </p>
      </>
    ),
  },

  {
    id: "shipping",
    title: "8. Shipping and Delivery",
    icon: Truck,
    content: (
      <>
        <p>
          Delivery estimates displayed on Vyason are estimates and may vary
          depending on seller processing time, product availability,
          destination, logistics provider, weather, public holidays, and
          other circumstances.
        </p>

        <p>
          You are responsible for providing an accurate and complete delivery
          address and contact information.
        </p>

        <p>
          If an order cannot be delivered because of an incorrect address,
          unavailable recipient, refusal to accept delivery, or other
          customer-related circumstances, additional delivery attempts or
          charges may apply where permitted.
        </p>

        <p>
          Some products or locations may have delivery restrictions.
        </p>
      </>
    ),
  },

  {
    id: "returns",
    title: "9. Returns, Refunds and Cancellations",
    icon: RotateCcw,
    content: (
      <>
        <p>
          Returns, replacements, refunds, and cancellations are governed by
          the applicable Vyason Return & Refund Policy and any product- or
          seller-specific conditions displayed at the time of purchase.
        </p>

        <p>
          Certain products may be non-returnable or may have special return
          requirements due to their nature, hygiene considerations, warranty
          conditions, personalization, or applicable law.
        </p>

        <p>
          Refund timing may depend on the payment method, payment provider,
          banking institution, seller processing, and other factors.
        </p>

        <p>
          Vyason may investigate returned products and may reject a return
          where the product does not meet the applicable return conditions.
        </p>
      </>
    ),
  },

  {
    id: "seller-terms",
    title: "10. Seller Terms",
    icon: Store,
    content: (
      <>
        <p>
          Sellers using Vyason are responsible for ensuring that their
          products, listings, pricing, inventory, business information,
          licenses, taxes, and fulfillment practices comply with applicable
          laws and marketplace requirements.
        </p>

        <p>Sellers must not:</p>

        <ul>
          <li>List counterfeit or unlawfully sourced products</li>
          <li>Provide misleading product information</li>
          <li>Manipulate ratings, reviews, or marketplace activity</li>
          <li>Use customer information for unauthorized purposes</li>
          <li>Sell prohibited or restricted products</li>
          <li>Engage in fraudulent transactions</li>
        </ul>

        <p>
          Vyason may suspend, restrict, remove, or terminate seller accounts
          or listings where necessary to protect customers, the marketplace,
          or comply with applicable law.
        </p>
      </>
    ),
  },

  {
    id: "reviews",
    title: "11. Reviews, Ratings and User Content",
    icon: UserCheck,
    content: (
      <>
        <p>
          Users may be able to submit reviews, ratings, photographs,
          comments, questions, or other content ("User Content").
        </p>

        <p>
          You are responsible for ensuring that your User Content is
          accurate, lawful, and does not infringe the rights of others.
        </p>

        <p>User Content must not:</p>

        <ul>
          <li>Contain unlawful, abusive, threatening, or defamatory material</li>
          <li>Infringe intellectual property or privacy rights</li>
          <li>Contain malware, malicious code, or harmful material</li>
          <li>Be misleading, fraudulent, or artificially manipulated</li>
          <li>Contain unauthorized personal information</li>
        </ul>

        <p>
          Vyason may remove or restrict User Content that violates applicable
          policies or legal requirements.
        </p>
      </>
    ),
  },

  {
    id: "intellectual-property",
    title: "12. Intellectual Property",
    icon: ShieldCheck,
    content: (
      <>
        <p>
          Unless otherwise stated, Vyason and its licensors own or control
          the intellectual property rights in the Vyason website, platform,
          branding, logos, graphics, design, software, text, and other
          platform content.
        </p>

        <p>
          You may use the platform only for lawful personal or business
          purposes consistent with these Terms.
        </p>

        <p>
          You may not copy, reproduce, modify, distribute, sell, reverse
          engineer, scrape, republish, or commercially exploit Vyason's
          platform content without prior written authorization, except where
          permitted by applicable law.
        </p>
      </>
    ),
  },

  {
    id: "prohibited-use",
    title: "13. Prohibited Activities",
    icon: AlertTriangle,
    content: (
      <>
        <p>
          You agree not to use Vyason for unlawful, fraudulent, abusive, or
          unauthorized purposes.
        </p>

        <p>Prohibited activities include:</p>

        <ul>
          <li>Attempting to gain unauthorized access to the platform</li>
          <li>Using another person's account without authorization</li>
          <li>Introducing malicious software or harmful code</li>
          <li>Interfering with platform security or functionality</li>
          <li>Scraping or automated extraction without authorization</li>
          <li>Fraudulent transactions or payment activity</li>
          <li>Manipulating reviews, ratings, or marketplace systems</li>
          <li>Using Vyason for unlawful activities</li>
        </ul>
      </>
    ),
  },

  {
    id: "fraud",
    title: "14. Fraud Prevention and Account Security",
    icon: LockIcon,
    content: (
      <>
        <p>
          Vyason may use automated and manual processes to detect and prevent
          fraud, abuse, suspicious transactions, unauthorized account access,
          payment risks, and other harmful activity.
        </p>

        <p>
          We may temporarily hold, restrict, cancel, or investigate
          transactions where reasonably necessary to protect users and the
          platform.
        </p>
      </>
    ),
  },

  {
    id: "third-party-services",
    title: "15. Third-Party Services",
    icon: Scale,
    content: (
      <>
        <p>
          Vyason may integrate with third-party services such as payment
          providers, logistics companies, analytics providers, authentication
          services, communication providers, and other technology partners.
        </p>

        <p>
          Your interaction with a third-party service may be governed by that
          provider's own terms, policies, and agreements.
        </p>
      </>
    ),
  },

  {
    id: "disclaimer",
    title: "16. Disclaimers",
    icon: AlertTriangle,
    content: (
      <>
        <p>
          To the maximum extent permitted by applicable law, Vyason provides
          its platform and services on an "as available" and "as is" basis.
        </p>

        <p>
          We do not guarantee that the platform will always be uninterrupted,
          error-free, completely secure, or free from technical defects.
        </p>

        <p>
          Product-specific warranties, guarantees, or representations may be
          provided by the applicable manufacturer or seller.
        </p>
      </>
    ),
  },

  {
    id: "limitation",
    title: "17. Limitation of Liability",
    icon: Scale,
    content: (
      <>
        <p>
          To the extent permitted by applicable law, Vyason will not be
          responsible for indirect, incidental, special, consequential, or
          punitive damages arising from your use of the platform or inability
          to use the platform.
        </p>

        <p>
          Nothing in these Terms is intended to exclude or limit liability
          that cannot lawfully be excluded or limited under applicable law.
        </p>
      </>
    ),
  },

  {
    id: "indemnification",
    title: "18. Indemnification",
    icon: ShieldCheck,
    content: (
      <p>
        To the extent permitted by applicable law, you agree to indemnify and
        hold harmless Vyason, its affiliates, officers, employees, partners,
        and service providers from claims, losses, liabilities, damages, and
        expenses arising from your violation of these Terms, misuse of the
        platform, unlawful conduct, or infringement of another party's
        rights.
      </p>
    ),
  },

  {
    id: "suspension",
    title: "19. Suspension and Termination",
    icon: UserCheck,
    content: (
      <>
        <p>
          Vyason may suspend, restrict, or terminate access to an account or
          service where reasonably necessary, including in cases involving
          fraud, abuse, security concerns, violation of these Terms,
          unlawful activity, or failure to comply with marketplace
          requirements.
        </p>

        <p>
          You may stop using Vyason at any time. Certain provisions of these
          Terms may continue to apply after termination where their nature
          requires continued effect.
        </p>
      </>
    ),
  },

  {
    id: "privacy",
    title: "20. Privacy",
    icon: LockIcon,
    content: (
      <p>
        Your use of Vyason is also governed by our Privacy Policy, which
        explains how we collect, use, store, and protect personal
        information.
      </p>
    ),
  },

  {
    id: "changes",
    title: "21. Changes to These Terms",
    icon: FileText,
    content: (
      <p>
        Vyason may update these Terms from time to time to reflect changes
        in our services, business practices, technology, or applicable legal
        requirements. Updated Terms will be posted on this page along with
        the applicable effective date. Your continued use of Vyason after
        changes become effective constitutes use subject to the updated
        Terms, to the extent permitted by applicable law.
      </p>
    ),
  },

  {
    id: "governing-law",
    title: "22. Governing Law and Disputes",
    icon: Scale,
    content: (
      <>
        <p>
          These Terms shall be interpreted and governed by the laws
          applicable to the Vyason operating entity, subject to mandatory
          consumer protection and other applicable legal requirements.
        </p>

        <p>
          Any dispute arising from the use of Vyason should first be
          addressed through our customer support or grievance process where
          applicable.
        </p>

        <p>
          Nothing in these Terms prevents a consumer from exercising rights
          available under mandatory applicable law.
        </p>
      </>
    ),
  },
];

function LockIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

const TermsCondition = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              <FileText className="h-4 w-4" />
              Vyason Marketplace Terms
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Terms & Conditions
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              These Terms & Conditions govern your use of the Vyason
              marketplace, website, products, services, accounts, and
              transactions.
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
                Topic
              </h2>

              <nav className="max-h-[70vh] space-y-1 overflow-y-auto pr-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                  >
                    <span>
                      {section.title.replace(/^\d+\.\s/, "")}
                    </span>

                    <ChevronRight className="h-4 w-4 shrink-0 opacity-0 transition group-hover:opacity-100" />
                  </a>
                ))}

                <a
                  href="#contact"
                  className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600"
                >
                  Contact Us
                  <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                </a>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              {/* Important Notice */}
              <div className="mb-10 rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                <p className="text-sm leading-6 text-indigo-900">
                  <strong>Please read carefully:</strong> These Terms apply
                  to customers, sellers, and other users of the Vyason
                  marketplace. Additional terms may apply to specific
                  products, services, promotions, sellers, or payment
                  methods.
                </p>
              </div>

              {sections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className={`scroll-mt-45 ${
                      index !== 0
                        ? "border-t border-slate-200 pt-10"
                        : ""
                    } pb-10`}
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
                        23. Contact Us
                      </h2>

                      <p className="mt-3 leading-7 text-slate-300">
                        If you have questions regarding these Terms,
                        marketplace transactions, seller requirements, or
                        other Vyason services, please contact us.
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
                          support@vyason.com
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

              {/* Footer */}
              {/* <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} Vyason. All rights reserved.
              </div> */}
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
export default TermsCondition;