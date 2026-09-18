"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const claims = {
  "1": {
    text: "BREAKING!!! SHOCKING NEWS!!! Share before deleted!",
    platform: "WhatsApp",
    category: "Politics",
    flags: ["Sensational", "Shouting", "Unsourced"],
    risk: "HIGH RISK",
    status: "Unverified",
    time: "18 September 2026, 10:30 PM",
    note: "",
  },

  "2": {
    text: "Scientists announce a major discovery related to public health.",
    platform: "X",
    category: "Health",
    flags: ["Unsourced"],
    risk: "NORMAL",
    status: "Verified True",
    time: "18 September 2026, 8:15 PM",
    note: "The claim was reviewed against available supporting information.",
  },

  "3": {
    text: "SHOCKING investment opportunity! Guaranteed huge returns!",
    platform: "Instagram",
    category: "Finance",
    flags: ["Sensational", "Shouting"],
    risk: "HIGH RISK",
    status: "Misleading",
    time: "18 September 2026, 6:40 PM",
    note: "The wording makes a guaranteed-return claim without sufficient context or evidence.",
  },
};

export default function ClaimDetails() {
  const { id } = useParams();

  const claim = claims[id];

  if (!claim) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--ink)] text-[var(--cream)]">
        <div className="text-center">
          <h1 className="text-4xl font-black">
            Claim not found
          </h1>

          <Link
            href="/"
            className="mt-6 inline-block text-[var(--lime)]"
          >
            ← Back to feed
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--ink)] text-[var(--cream)]">

      {/* NAVBAR */}

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lime)] font-black text-[var(--ink)]">
              C
            </div>

            <div>
              <div className="font-black tracking-tight">
                TruthLens
              </div>

              <div className="text-[9px] uppercase tracking-[0.3em] text-[var(--muted)]">
                Civic Intelligence
              </div>
            </div>
          </Link>

          <Link
            href="/submit"
            className="lime-button rounded-full px-5 py-2.5 text-sm font-bold"
          >
            + Submit Claim
          </Link>

        </div>
      </header>


      {/* CONTENT */}

      <section className="mx-auto max-w-5xl px-6 py-12">

        {/* Back */}

        <Link
          href="/"
          className="text-sm font-bold text-[var(--muted)] transition hover:text-[var(--cream)]"
        >
          ← Back to Public Feed
        </Link>


        {/* Header */}

        <div className="mt-10">

          <div className="flex flex-wrap items-center gap-3">

            <span
              className={`rounded-full px-4 py-2 text-xs font-black ${
                claim.risk === "HIGH RISK"
                  ? "bg-[var(--pink)] text-[var(--cream)]"
                  : "bg-[var(--pigeon)] text-[var(--ink)]"
              }`}
            >
              {claim.risk}
            </span>

            <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-[var(--muted)]">
              {claim.status}
            </span>

          </div>


          <h1 className="mt-7 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Claim Details
          </h1>

        </div>


        {/* CLAIM CARD */}

        <div className="card-3d mt-10 rounded-[32px] border border-white/10 bg-[var(--pigeon)] bg-opacity-10 p-7 backdrop-blur-xl md:p-10">

          <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-white/10 pb-6 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">

            <span>
              Platform:{" "}
              <strong className="text-[var(--cream)]">
                {claim.platform}
              </strong>
            </span>

            <span>
              Category:{" "}
              <strong className="text-[var(--cream)]">
                {claim.category}
              </strong>
            </span>

            <span>
              Submitted:{" "}
              <strong className="text-[var(--cream)]">
                {claim.time}
              </strong>
            </span>

          </div>


          {/* Original claim */}

          <div className="mt-8">

            <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-[var(--pink)]">
              Original Claim
            </p>

            <blockquote className="border-l-4 border-[var(--lime)] pl-6 text-2xl font-bold leading-relaxed md:text-3xl">
              "{claim.text}"
            </blockquote>

          </div>


          {/* Risk assessment */}

          <div className="mt-10">

            <p className="mb-5 text-xs font-black uppercase tracking-[0.25em] text-[var(--pink)]">
              Risk Assessment
            </p>

            <div className="grid gap-4 sm:grid-cols-2">

              {claim.flags.map((flag) => (

                <div
                  key={flag}
                  className="rounded-2xl border border-white/10 bg-[var(--ink)] p-5"
                >

                  <div className="text-xl">
                    ⚠
                  </div>

                  <p className="mt-3 font-black">
                    {flag}
                  </p>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Automated risk signal detected.
                  </p>

                </div>

              ))}

            </div>

          </div>


          {/* Review */}

          <div className="mt-10 border-t border-white/10 pt-8">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--muted)]">
              Reviewer Note
            </p>

            {claim.note ? (
              <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--cream)]">
                {claim.note}
              </p>
            ) : (
              <p className="mt-4 text-[var(--muted)]">
                This claim has not been reviewed yet.
              </p>
            )}

          </div>

        </div>


        {/* Review button */}

        <div className="mt-8 flex justify-end">

          <Link
            href={`/review?id=${claim.id}`}
            className="rounded-full border border-[var(--lime)] px-6 py-3 text-sm font-black text-[var(--lime)] transition hover:bg-[var(--lime)] hover:text-[var(--ink)]"
          >
            Review This Claim →
          </Link>

        </div>

      </section>

    </main>
  );
}