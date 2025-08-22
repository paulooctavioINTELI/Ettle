"use client";

export default function StickyCTA() {
  // Always visible on mobile; relies on anchor #signup
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 block md:hidden">
      <div className="mx-3 mb-3 rounded-xl bg-primary px-4 py-3 text-center font-semibold text-white shadow-lg"
           style={{ paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 12px)" }}>
        <a href="#signup" aria-label="Get Ettle now">Get Ettle</a>
      </div>
    </div>
  );
}
