import { Icon } from "@iconify/react";
import { Image } from "@heroui/image";
export default function WhyItMatters() {
  return (
    <section className="py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-text mb-6 tracking-tight">
            Why Bad Validators Hurt Everyone
          </h2>
          <p className="text-xl text-text/70 max-w-3xl mx-auto leading-relaxed font-light">
            Poor validator choices don&apos;t just affect your rewards—they
            degrade the entire network&apos;s performance, security, and cost
            efficiency for all users.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Slower Network */}
          <div className="bg-secondary/40 backdrop-blur-sm p-10 rounded-3xl border border-red-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full -translate-y-16 translate-x-16 opacity-50" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mb-8 mx-auto border border-red-500/30">
                <Icon
                  className="w-10 h-10 text-red-400"
                  icon="material-symbols:speed"
                />
              </div>
              <h3 className="text-2xl font-bold text-text mb-6 text-center">
                Slower Network Performance
              </h3>
              <p className="text-text/70 text-center mb-6 leading-relaxed font-light">
                Low-performance validators cause transaction delays, missed
                blocks, and reduced throughput. When stake concentrates on poor
                validators, the entire network suffers.
              </p>
              <div className="bg-secondary/60 p-6 rounded-2xl border border-red-500/20 shadow-sm">
                <div className="flex items-start gap-3">
                  <Icon
                    className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                    icon="material-symbols:trending-down"
                  />
                  <p className="text-sm text-red-300 font-semibold">
                    Impact: Increased transaction times and network congestion
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expensive Network */}
          <div className="bg-secondary/40 backdrop-blur-sm p-10 rounded-3xl border border-amber-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full -translate-y-16 translate-x-16 opacity-50" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-8 mx-auto border border-amber-500/30">
                <Icon
                  className="w-10 h-10 text-amber-400"
                  icon="material-symbols:attach-money"
                />
              </div>
              <h3 className="text-2xl font-bold text-text mb-6 text-center">
                Higher Transaction Costs
              </h3>
              <p className="text-text/70 text-center mb-6 leading-relaxed font-light">
                Poor validator distribution leads to inefficient block
                production and higher priority fees. Bad validators make Solana
                more expensive for everyone to use.
              </p>
              <div className="bg-secondary/60 p-6 rounded-2xl border border-amber-500/20 shadow-sm">
                <div className="flex items-start gap-3">
                  <Icon
                    className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0"
                    icon="material-symbols:trending-up"
                  />
                  <p className="text-sm text-amber-300 font-semibold">
                    Impact: Increased fees and reduced network accessibility
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Less Secure */}
          <div className="bg-secondary/40 backdrop-blur-sm p-10 rounded-3xl border border-orange-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full -translate-y-16 translate-x-16 opacity-50" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-8 mx-auto border border-orange-500/30">
                <Icon
                  className="w-10 h-10 text-orange-400"
                  icon="material-symbols:shield-lock"
                />
              </div>
              <h3 className="text-2xl font-bold text-text mb-6 text-center">
                Weakened Security
              </h3>
              <p className="text-text/70 text-center mb-6 leading-relaxed font-light">
                Concentrated stake on unreliable validators creates security
                vulnerabilities. Network attacks become easier when bad actors
                control significant stake.
              </p>
              <div className="bg-secondary/60 p-6 rounded-2xl border border-orange-500/20 shadow-sm">
                <div className="flex items-start gap-3">
                  <Icon
                    className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0"
                    icon="material-symbols:warning"
                  />
                  <p className="text-sm text-orange-300 font-semibold">
                    Impact: Increased risk of network attacks and consensus
                    failures
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SolBlaze Solution */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-primary/20 to-primary/30 border border-primary/30 backdrop-blur-sm text-text p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-32 -translate-x-32 opacity-20" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 rounded-full translate-y-32 translate-x-32 opacity-20" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/40">
                <Image
                  alt="SolBlaze"
                  height={64}
                  src="/solblaze.svg"
                  width={64}
                />
              </div>
              <h3 className="text-3xl font-black mb-6 text-text tracking-tight">
                SolBlaze Fixes This
              </h3>
              <p className="text-text/80 mb-10 max-w-3xl mx-auto text-lg leading-relaxed font-light">
                Our intelligent delegation automatically distributes stake
                across high-performance, trusted validators—making Solana
                faster, cheaper, and more secure for everyone.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="bg-primary/20 border border-primary/30 px-6 py-4 rounded-2xl flex items-center gap-3">
                  <Icon
                    className="w-6 h-6 text-primary"
                    icon="material-symbols:speed"
                  />
                  <span className="font-semibold text-text">
                    Faster Transactions
                  </span>
                </div>
                <div className="bg-primary/20 border border-primary/30 px-6 py-4 rounded-2xl flex items-center gap-3">
                  <Icon
                    className="w-6 h-6 text-primary"
                    icon="material-symbols:savings"
                  />
                  <span className="font-semibold text-text">Lower Fees</span>
                </div>
                <div className="bg-primary/20 border border-primary/30 px-6 py-4 rounded-2xl flex items-center gap-3">
                  <Icon
                    className="w-6 h-6 text-primary"
                    icon="material-symbols:verified-user"
                  />
                  <span className="font-semibold text-text">
                    Enhanced Security
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
