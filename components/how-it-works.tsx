import { Icon } from "@iconify/react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Connect Your Wallet",
      description:
        "Link your Solana wallet to discover stake accounts and analyze your current validator performance",
      icon: "material-symbols:account-balance-wallet-outline",
      detail: "Supports Phantom, Solflare, and all major Solana wallets",
    },
    {
      title: "Review & Select",
      description:
        "See detailed analytics on your current validators and select accounts that would benefit from rebalancing",
      icon: "material-symbols:analytics-outline",
      detail: "Smart recommendations based on validator performance",
    },
    {
      title: "Delegate & Earn",
      description:
        "Seamlessly transition to high-performing validators while receiving liquid bSOL tokens for DeFi use",
      icon: "material-symbols:rocket-launch-outline",
      detail: "Instant liquidity with ongoing staking rewards",
    },
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-8">
            <Icon className="w-4 h-4 mr-2" icon="material-symbols:auto-mode" />
            Intelligent Staking
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-text mb-8 tracking-tight leading-tight">
            Three steps to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              smarter staking
            </span>
          </h2>
          <p className="text-xl text-text/60 max-w-2xl mx-auto leading-relaxed">
            Transform your staking strategy with intelligent delegation that
            maximizes rewards while strengthening the network
          </p>
        </div>

        {/* Steps Flow */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Flow connector */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-primary/40 to-primary/20 hidden md:block" />
              )}

              <div className="flex flex-col md:flex-row items-start gap-8 group">
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
                    <Icon className="w-8 h-8 text-primary" icon={step.icon} />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-text mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-lg text-text/70 leading-relaxed max-w-2xl">
                      {step.description}
                    </p>
                  </div>

                  {/* Detail badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-secondary/40 backdrop-blur-sm rounded-full border border-primary/20 text-sm text-text/70">
                    <Icon
                      className="w-4 h-4 mr-2 text-primary"
                      icon="material-symbols:check-circle-outline"
                    />
                    {step.detail}
                  </div>
                </div>

                {/* Step indicator */}
                <div className="hidden lg:flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-sm">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-24 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-xl" />
            <div className="relative bg-secondary/30 backdrop-blur-xl border border-primary/20 rounded-3xl p-12 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-text mb-3 tracking-tight">
                    Ready to optimize your stake?
                  </h3>
                  <p className="text-text/70 leading-relaxed">
                    Join hundreds of stakers earning more while securing the
                    network
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-text/60 font-medium">
                      Average APY increase
                    </div>
                    <div className="text-3xl font-black text-primary">
                      +2.3%
                    </div>
                  </div>
                  <button className="bg-primary text-secondary font-bold px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 group">
                    Get Started
                    <Icon
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                      icon="material-symbols:arrow-forward"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
