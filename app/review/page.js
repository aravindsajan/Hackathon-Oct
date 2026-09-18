"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const claims = {
  "1": {
    id: "1",
    text: "BREAKING!!! SHOCKING NEWS!!! Share before deleted!",
    platform: "WhatsApp",
    category: "Politics",
    flags: ["Sensational", "Shouting", "Unsourced"],
    risk: "HIGH RISK",
    status: "Unverified",
    submittedAt: "12 min ago",
  },

  "2": {
    id: "2",
    text: "A new health advisory has been issued regarding this year's flu season.",
    platform: "X",
    category: "Health",
    flags: ["Unsourced"],
    risk: "NORMAL",
    status: "Verified True",
    submittedAt: "34 min ago",
  },

  "3": {
    id: "3",
    text: "SHOCKING investment opportunity! Double your money in just 7 days!",
    platform: "Instagram",
    category: "Finance",
    flags: ["Sensational", "Shouting"],
    risk: "HIGH RISK",
    status: "Misleading",
    submittedAt: "1 hr ago",
  },
};

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "1";

  const claim = claims[id];

  const [status, setStatus] = useState(
    claim?.status || "Unverified"
  );

  const [note, setNote] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (!claim) {
    return (
      <main className="min-h-screen bg-[var(--ink)] text-[var(--cream)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4">
            Claim Not Found
          </h1>

          <Link
            href="/"
            className="text-[var(--lime)] underline"
          >
            Back to Feed
          </Link>
        </div>
      </main>
    );
  }

  // -----------------------------
  // SUBMIT REVIEW
  // -----------------------------
  function handleReview() {
    if (status === "Unverified") {
      alert("Please select a review status.");
      return;
    }

    if (!note.trim()) {
      alert("Please add a short reviewer note.");
      return;
    }

    setReviewed(true);
  }

  // -----------------------------
  // DELETE CLAIM
  // -----------------------------
  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this claim?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    // Temporary frontend behavior.
    // Later this will call:
    // DELETE /api/claims/:id

    setDeleted(true);
  }

  // -----------------------------
  // DELETED SCREEN
  // -----------------------------
  if (deleted) {
    return (
      <main className="min-h-screen bg-[var(--ink)] text-[var(--cream)]">

        {/* NAVBAR */}
        <nav className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

            <Link
              href="/"
              className="text-xl font-black tracking-tight"
            >
              Truth<span className="text-[var(--lime)]">Lens</span>
            </Link>

            <div className="flex items-center gap-6 text-sm">

              <Link
                href="/"
                className="text-[var(--muted)] hover:text-[var(--cream)] transition"
              >
                Public Feed
              </Link>

              <Link
                href="/submit"
                className="text-[var(--muted)] hover:text-[var(--cream)] transition"
              >
                Submit Claim
              </Link>

            </div>

          </div>
        </nav>

        {/* DELETED MESSAGE */}
        <section className="min-h-[75vh] flex items-center justify-center px-6">

          <div className="text-center max-w-xl">

            <div className="w-20 h-20 mx-auto mb-7 rounded-full bg-[var(--pink)]/10 border border-[var(--pink)]/30 flex items-center justify-center">

              <span className="text-3xl text-[var(--pink)]">
                ✓
              </span>

            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-[var(--pink)] font-bold mb-4">
              Claim Removed
            </p>

            <h1 className="text-4xl md:text-5xl font-black">
              CLAIM DELETED.
            </h1>

            <p className="text-[var(--muted)] mt-4">
              The claim has been removed from the review workflow.
            </p>

            <Link
              href="/"
              className="inline-block lime-button mt-8 px-7 py-4 rounded-xl font-black uppercase tracking-wide"
            >
              Back to Public Feed →
            </Link>

          </div>

        </section>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--ink)] text-[var(--cream)]">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <nav className="border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link
            href="/"
            className="text-xl font-black tracking-tight"
          >
            Truth<span className="text-[var(--lime)]">Lens</span>
          </Link>

          <div className="flex items-center gap-6 text-sm">

            <Link
              href="/"
              className="text-[var(--muted)] hover:text-[var(--cream)] transition"
            >
              Public Feed
            </Link>

            <Link
              href="/submit"
              className="text-[var(--muted)] hover:text-[var(--cream)] transition"
            >
              Submit Claim
            </Link>

          </div>

        </div>

      </nav>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <section className="max-w-5xl mx-auto px-6 py-12">

        {/* HEADER */}

        <div className="mb-10">

          <p className="text-xs uppercase tracking-[0.3em] text-[var(--lime)] font-bold mb-3">
            Reviewer Workspace
          </p>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            REVIEW CLAIM.
          </h1>

          <p className="mt-4 text-[var(--muted)] max-w-2xl">
            Review the submitted claim, select an evidence status,
            and leave a short note explaining the decision.
          </p>

        </div>


        {/* =========================================
            CLAIM CARD
        ========================================= */}

        <div className="card-3d rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-10 mb-8">

          <div className="flex flex-wrap items-center gap-3 mb-6">

            {/* PLATFORM */}

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--pigeon)] text-[var(--ink)]">
              {claim.platform}
            </span>


            {/* CATEGORY */}

            <span className="px-3 py-1 rounded-full text-xs font-bold border border-white/10">
              {claim.category}
            </span>


            {/* RISK */}

            <span
              className={`px-3 py-1 rounded-full text-xs font-black ${
                claim.risk === "HIGH RISK"
                  ? "bg-[var(--pink)] text-[var(--cream)]"
                  : "bg-[var(--lime)] text-[var(--ink)]"
              }`}
            >
              {claim.risk}
            </span>

          </div>


          {/* CLAIM TEXT */}

          <p className="text-2xl md:text-3xl font-bold leading-relaxed">
            "{claim.text}"
          </p>


          {/* SUBMISSION TIME */}

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-sm">

            <span className="text-[var(--muted)]">
              Submitted
            </span>

            <span>
              {claim.submittedAt}
            </span>

          </div>

        </div>


        {/* =========================================
            RISK + STATUS
        ========================================= */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">


          {/* RISK FLAGS */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

            <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-5">
              Automated Risk Flags
            </p>

            <div className="flex flex-wrap gap-3">

              {claim.flags.map((flag) => (

                <span
                  key={flag}
                  className="px-4 py-2 rounded-full bg-[var(--pink)]/80 text-sm font-bold"
                >
                  {flag}
                </span>

              ))}

            </div>

          </div>


          {/* CURRENT STATUS */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

            <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-5">
              Current Status
            </p>

            <span className="inline-block px-4 py-2 rounded-full bg-[var(--pigeon)] text-[var(--ink)] font-bold">
              {claim.status}
            </span>

          </div>

        </div>


        {/* =========================================
            REVIEW FORM
        ========================================= */}

        {!reviewed ? (

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-10">

            <p className="text-xs uppercase tracking-widest text-[var(--lime)] font-bold mb-6">
              Reviewer Decision
            </p>


            {/* STATUS SELECT */}

            <label className="block text-sm font-bold mb-3">
              Verification Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl bg-[var(--ink)] border border-white/15 px-4 py-4 text-[var(--cream)] outline-none focus:border-[var(--lime)]"
            >

              <option value="Unverified">
                Unverified
              </option>

              <option value="Verified True">
                Verified True
              </option>

              <option value="False">
                False
              </option>

              <option value="Misleading">
                Misleading
              </option>

            </select>


            {/* REVIEW NOTE */}

            <label className="block text-sm font-bold mt-7 mb-3">
              Reviewer Note
            </label>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              placeholder="Explain briefly why this claim received this status..."
              className="w-full rounded-xl bg-[var(--ink)] border border-white/15 px-4 py-4 text-[var(--cream)] placeholder:text-[var(--muted)] outline-none resize-none focus:border-[var(--lime)]"
            />


            {/* ACTIONS */}

            <div className="mt-7 flex flex-wrap items-center gap-4">

              {/* SUBMIT REVIEW */}

              <button
                onClick={handleReview}
                className="lime-button px-7 py-4 rounded-xl font-black uppercase tracking-wide"
              >
                Submit Review →
              </button>


              {/* DELETE */}

              <button
                onClick={handleDelete}
                className="px-6 py-4 rounded-xl border border-[var(--pink)] text-[var(--pink)] font-bold hover:bg-[var(--pink)] hover:text-[var(--cream)] transition"
              >
                Delete Claim
              </button>


              {/* CANCEL */}

              <Link
                href="/"
                className="px-6 py-4 rounded-xl border border-white/15 text-[var(--muted)] hover:text-[var(--cream)] hover:bg-white/5 transition"
              >
                Cancel
              </Link>

            </div>

          </div>

        ) : (

          /* =========================================
             REVIEW SUCCESS
          ========================================= */

          <div className="rounded-3xl border border-[var(--lime)]/30 bg-[var(--lime)]/5 p-10 text-center">

            <div className="text-5xl mb-5">
              ✓
            </div>

            <h2 className="text-3xl font-black">
              Review Submitted
            </h2>

            <p className="text-[var(--muted)] mt-3">

              This claim has been marked as{" "}

              <span className="text-[var(--cream)] font-bold">
                {status}
              </span>

              .

            </p>


            <div className="mt-8 flex flex-wrap justify-center gap-4">

              <Link
                href={`/claims/${claim.id}`}
                className="px-6 py-3 rounded-xl border border-white/15 hover:bg-white/5"
              >
                View Claim
              </Link>

              <Link
                href="/"
                className="lime-button px-6 py-3 rounded-xl font-bold"
              >
                Public Feed
              </Link>

            </div>

          </div>

        )}

      </section>

    </main>
  );
}