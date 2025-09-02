"use client";

import PhoneCarousel from "./PhoneCarousel";
import Feature from "./FeatureComponent";

export default function FeaturesSection() {
  return (
    <section id="features-section" className="relative mx-auto max-w-6xl px-4 py-16">
      {/* 1 col (mobile) → 2 col (desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px] items-start gap-12">

        {/* COLUNA ESQUERDA (texto) */}
        <div id="features-track" className="min-w-0 space-y-20">
          <Feature
            id="feature-leaderboard"
            title="Climb the Leaderboards"
            subtitle="Push Your Limits, and Earn Rewards"
            description="Earn XP with every session and climb the leaderboards. Compete with friends, represent your university, and join the race for glory in Edinburgh. Top performers unlock epic prizes, special giveaways, and the ultimate bragging rights."
          />
          <Feature
            id="feature-instructions"
            title="Learn Every Exercise the Right Way"
            subtitle="Step-by-step interactive videos & clear instructions"
            description="Step-by-step interactive videos and clear written instructions guide you through every movement. Perfect your form, avoid injuries, and train with total confidence—because progress starts with doing it right."
          />
          <Feature
            id="money"
            title="Bring Friends, Earn Rewards, Win Together"
            subtitle="Share the Journey. Reap the Rewards."
            description="Invite friends to join and earn a share of their subscription every month they stay active—turning referrals into recurring rewards."
          />
          <Feature
            id="feature-tracking"
            title="See Your Progress, Shape Your Future"
            subtitle="Track with precision & plan ahead"
            description="Track your training with precision and achieve your goals one session at a time. Every input builds into smart insights that help plan your future sessions—so your training evolves with you, keeping progress steady and results visible."
          />
          <Feature
            id="feature-music"
            title="Your Music, Your Flow"
            subtitle="Lift to Your Beat · The Perfect Soundtrack for Every Session"
            description="Access Spotify directly through the app, making it easier than ever to integrate your beats seamlessly into every workout. See what playlists your friends are training to and share your own—because the best tunes are the ones you share."
          />
          <Feature
            id="feature-reminders"
            title="Consistency Made Simple"
            subtitle="Smart reminders & streaks that build habits"
            description="Stay on track with smart push reminders and workout streaks that keep you accountable. Build momentum one session at a time, turning discipline into habit, unlocking real, lasting results."
          />
          <Feature
            id="feature-social"
            title="Flex Your Progress"
            subtitle="Capture milestones & share your journey"
            description="Capture your milestones and showcase your progress with just a tap. Share your journey across Instagram, TikTok, and Facebook, celebrating every step forward and showing the world how it is done."
          />
        </div>

                {/* COLUNA DIREITA: só aparece no desktop */}
        <div className="hidden md:block relative justify-self-end w-[320px]">
          <PhoneCarousel
            pinStartId="feature-leaderboard"
            pinEndId="feature-social"
            topOffset={84}
            triggerIds={[
              "feature-leaderboard",
              "feature-instructions",
              "money",
              "feature-tracking",
              "feature-music",
              "feature-reminders",
              "feature-social",
            ]}
            screens={[
              { src: "/screens/hankScreen.svg", alt: "Leaderboard overview" },
              { src: "/screens/instructionScreen.svg", alt: "Exercise instructions" },
              { src: "/screens/money.svg", alt: "Referrals & rewards" },
              { src: "/screens/trackingScreen.svg", alt: "Tracking & insights" },
              { src: "/screens/musicScreen.svg", alt: "Spotify integration" },
              { src: "/screens/remindersScreen.svg", alt: "Smart reminders & streaks" },
              { src: "/screens/socialScreen.svg", alt: "Social sharing" },
            ]}
            width={320}
            screenWidth={266.95}
            screenHeight={580}
          />
        </div>
      </div>
    </section>
  );
}
