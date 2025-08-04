"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is SolBlaze and how does it work?",
    answer:
      "SolBlaze is a liquid staking protocol that automatically distributes your SOL across high-performance, trusted validators. You receive bSOL tokens representing your staked SOL, which you can use in DeFi while still earning staking rewards. Our intelligent delegation system ensures optimal validator selection for maximum security and performance.",
  },
  {
    question: "What are the risks of delegating to bad validators?",
    answer:
      "Bad validators can cause slow network experience, missed rewards, and contribute to network instability. They may have good uptime & low commission rates, but this doesn't mean they are good for the network.",
  },
  {
    question: "What is the definition of high commission?",
    answer:
      "High commission is a validator that charges more than 5% in commission / 10% in MEV fees. SolBlaze strategy will automatically re-delegate your stake to a validator that is not charging high commission.",
  },
  {
    question: "How does SolBlaze protect against validator risks?",
    answer:
      "SolBlaze automatically diversifies your stake across multiple vetted, high-performance validators. Our selection criteria include uptime history, commission rates, security practices, and network contribution. This diversification protects you from individual validator failures while supporting overall network health.",
  },
  {
    question: "Can I unstake my SOL anytime?",
    answer:
      "Yes! With liquid staking through SolBlaze, you can trade your bSOL tokens for SOL anytime on various exchanges, or use our unstaking mechanism. This provides much more flexibility than traditional staking, which requires waiting for the unstaking period.",
  },
  {
    question: "How do I get started with SolBlaze?",
    answer:
      "Simply connect your Solana wallet, select existing stake accounts you want to delegate to SolBlaze, and confirm the transaction. You'll immediately receive bSOL tokens representing your stake, which you can hold for staking rewards or use in DeFi protocols throughout the Solana ecosystem.",
  },
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-text mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-text/70 font-light leading-relaxed">
            Everything you need to know about staking with SolBlaze
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-secondary/30 backdrop-blur-sm rounded-2xl border border-primary/20 overflow-hidden shadow-lg"
            >
              <button
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-secondary/40 transition-colors duration-200"
                onClick={() => toggleItem(index)}
              >
                <h3 className="text-lg font-semibold text-text pr-4 leading-relaxed">
                  {item.question}
                </h3>
                <Icon
                  className={`w-6 h-6 text-primary transition-transform duration-200 flex-shrink-0 ${
                    openItem === index ? "rotate-180" : ""
                  }`}
                  icon={
                    openItem === index
                      ? "material-symbols:remove"
                      : "material-symbols:add"
                  }
                />
              </button>
              {openItem === index && (
                <div className="px-8 pb-6">
                  <div className="border-t border-primary/20 pt-6">
                    <p className="text-text/80 leading-relaxed font-light text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-8">
            <Icon
              className="w-12 h-12 text-primary mx-auto mb-4"
              icon="material-symbols:help"
            />
            <h3 className="text-2xl font-bold text-text mb-4">
              Still have questions?
            </h3>
            <p className="text-text/70 mb-6 font-light">
              Join our community or reach out to our team for personalized
              support.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-primary text-secondary font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
                onClick={() =>
                  window.open(" https://solblaze.org/discord", "_blank")
                }
              >
                <Icon className="w-5 h-5" icon="material-symbols:forum" />
                Join Discord
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
