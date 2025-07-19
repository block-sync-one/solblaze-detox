

import { Icon } from '@iconify/react'
import { StakeBox } from './staking'
import BadValidatorsCarousel from './bad-validators-carousel'
import { Validator } from '@/types/stake';

export default async function Hero() {

    const validators = await(await fetch('http://localhost:3000/api/validators')).json()

 

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 py-20 md:px-16 lg:py-32 max-w-7xl mx-auto">
        {/* Left side (Promotional) */}
        <div className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/20 gap-2">
              <Icon icon="material-symbols:security" className="w-4 h-4" />
              Clean the network
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-text mb-8 leading-[0.9] tracking-tight">
            Power up the Solana Network.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 block mt-2">
              Earn Healthy Rewards.
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-text/80 mb-4 max-w-2xl leading-relaxed font-light">
            Don't let bad actors weaken the network. Stake responsibly with trusted validators
            and help maintain Solana's decentralization while earning rewards.
          </p>
          {/* Bad Validators Carousel */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 mb-8">
            <div className="text-red-400 text-sm font-medium mb-2 flex items-center gap-2">
              <Icon icon="material-symbols:warning" className="w-4 h-4" />
              Active network threats:
            </div>
            <BadValidatorsCarousel badValidators={validators} />
          </div>

          {/* Transition Bridge */}
          <div className="mb-8 text-center">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mb-4"></div>
            <p className="text-lg text-text/80 font-medium">
              Our solution tackles these threats while rewarding you
            </p>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                <Icon icon="clarity:shield-line" className="w-6 h-6 text-primary" />
              </div>
              <span className="text-text/90 font-medium">Secure the network from validator concentration</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                <Icon icon="material-symbols-light:monitor-heart-outline" className="w-6 h-6 text-primary" />
              </div>
              <span className="text-text/90 font-medium">Continuously monitor the network for threats and rebalance your stake</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                <Icon icon="material-symbols:key" className="w-6 h-6 text-primary" />
              </div>
              <span className="text-text/90 font-medium">Retain full control over your stake</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                <Icon icon="mdi:leaf" className="w-6 h-6 text-primary" />
              </div>
              <span className="text-text/90 font-medium">Use bSOL in DeFi or unstake anytime</span>
            </div>
          </div>


        </div>

        {/* Right side (Staking UI Box) */}
        <div className="lg:w-1/2 lg:pl-12">
          <StakeBox validators={validators} />
        </div>
      </div>
    </section>
  )
}
