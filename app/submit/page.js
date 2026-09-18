"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnalyzeClaim() {
  const [text, setText] = useState("");
  const [aiCategory, setAiCategory] = useState("");
  const [confidence, setConfidence] = useState(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [submittedClaim, setSubmittedClaim] = useState(null);

  // =========================
  // ANALYZE CLAIM
  // =========================

  async function handleAnalyze() {
    if (!text.trim()) {
      setError("Please enter a claim before analyzing.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setSubmitError("");
    setAiCategory("");
    setConfidence(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:3001/predict-category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            news: text,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("AI model prediction failed.");
      }

      const data = await response.json();

      console.log("AI MODEL RESULT:", data);

      setAiCategory(data.category);
      setConfidence(data.confidence);

    } catch (err) {
      console.error("AI MODEL ERROR:", err);

      setError(
        "Unable to connect to the AI model. Make sure app.py is running on port 3001."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  // =========================
  // SUBMIT CLAIM
  // =========================

  async function handleSubmitClaim() {
    if (!text.trim()) {
      setSubmitError("Please enter a claim.");
      return;
    }

    if (!aiCategory) {
      setSubmitError("Please analyze the claim before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          category: aiCategory,
          aiConfidence: confidence,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit claim."
        );
      }

      console.log("CLAIM SUBMITTED:", data);

      setSubmittedClaim(data.claim);

    } catch (err) {
      console.error("SUBMIT ERROR:", err);

      setSubmitError(
        err.message || "Unable to submit the claim."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =========================
  // DELETE CLAIM
  // =========================

  async function handleDeleteClaim() {
    if (!submittedClaim?._id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this claim?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/claims/${submittedClaim._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete claim."
        );
      }

      setSubmittedClaim(null);
      setText("");
      setAiCategory("");
      setConfidence(null);
      setError("");
      setSubmitError("");

    } catch (err) {
      console.error("DELETE ERROR:", err);

      setSubmitError(
        err.message || "Unable to delete the claim."
      );
    }
  }

  // =========================
  // CLEAR / ANALYZE ANOTHER
  // =========================

  function handleClear() {
    setText("");
    setAiCategory("");
    setConfidence(null);
    setError("");
    setSubmitError("");
    setSubmittedClaim(null);
  }

  // =========================
  // SUCCESS SCREEN
  // =========================

  if (submittedClaim) {
    return (
      <main className="min-h-screen bg-[var(--ink)] text-[var(--cream)]">

        {/* NAVBAR */}

        <nav className="border-b border-white/10">

          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

            <Link
              href="/"
              className="text-xl font-black tracking-tight"
            >
              Truth<span className="text-[var(--lime)]">
                Lens
              </span>
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
                className="text-[var(--cream)]"
              >
                Analyze Claim
              </Link>

            </div>

          </div>

        </nav>


        {/* SUCCESS */}

        <section className="max-w-4xl mx-auto px-6 py-16">

          <div className="mb-10">

            <p className="text-xs uppercase tracking-[0.3em] text-[var(--lime)] font-bold mb-3">
              Claim Submitted
            </p>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              SUBMISSION COMPLETE.
            </h1>

            <p className="mt-5 max-w-2xl text-[var(--muted)] leading-7">
              Your claim has been analyzed and added to the
              public CivicLens feed.
            </p>

          </div>


          {/* CLAIM CARD */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-10">

            <div className="flex items-start justify-between gap-5">

              <div>

                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                  Status
                </p>

                <span className="mt-2 inline-block rounded-full border border-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                  Unverified
                </span>

              </div>

              <div className="w-12 h-12 rounded-full border border-[var(--lime)]/30 flex items-center justify-center text-[var(--lime)]">
                ✓
              </div>

            </div>


            {/* CLAIM */}

            <div className="mt-8">

              <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                Claim
              </p>

              <p className="mt-3 text-xl leading-8">
                {submittedClaim.text}
              </p>

            </div>


            {/* AI RESULT */}

            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                  AI Predicted Category
                </p>

                <h2 className="mt-3 text-3xl font-black text-[var(--lime)]">
                  {submittedClaim.category}
                </h2>

              </div>


              <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                  Model Confidence
                </p>

                <h2 className="mt-3 text-3xl font-black">

                  {submittedClaim.aiConfidence !== undefined &&
                  submittedClaim.aiConfidence !== null
                    ? `${(
                        submittedClaim.aiConfidence * 100
                      ).toFixed(2)}%`
                    : "--"}

                </h2>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="grid md:grid-cols-2 gap-4 mt-8">

              <Link
                href="/"
                className="
                  lime-button
                  rounded-2xl
                  px-6
                  py-4
                  text-center
                  text-sm
                  font-black
                  uppercase
                  tracking-wider
                "
              >
                View Public Feed →
              </Link>


              <button
                type="button"
                onClick={handleDeleteClaim}
                className="
                  rounded-2xl
                  border
                  border-[var(--pink)]/40
                  px-6
                  py-4
                  text-sm
                  font-black
                  uppercase
                  tracking-wider
                  text-[var(--pink)]
                  transition
                  hover:bg-[var(--pink)]/10
                "
              >
                Delete Claim
              </button>

            </div>


            {/* SUBMIT ERROR */}

            {submitError && (

              <div className="mt-6 rounded-2xl border border-[var(--pink)]/40 bg-[var(--pink)]/10 p-5">

                <p className="text-sm text-[var(--pink)]">
                  {submitError}
                </p>

              </div>

            )}

          </div>


          {/* ANALYZE ANOTHER */}

          <button
            type="button"
            onClick={handleClear}
            className="
              mt-6
              w-full
              rounded-2xl
              border
              border-white/10
              px-6
              py-4
              text-sm
              font-bold
              text-[var(--muted)]
              hover:text-[var(--cream)]
              hover:bg-white/5
              transition
            "
          >
            Analyze Another Claim
          </button>

        </section>

      </main>
    );
  }


  // =========================
  // MAIN ANALYZE PAGE
  // =========================

  return (
    <main className="min-h-screen bg-[var(--ink)] text-[var(--cream)]">

      {/* NAVBAR */}

      <nav className="border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link
            href="/"
            className="text-xl font-black tracking-tight"
          >
            Truth<span className="text-[var(--lime)]">
              Lens
            </span>
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
              className="text-[var(--cream)]"
            >
              Analyze Claim
            </Link>

          </div>

        </div>

      </nav>


      {/* MAIN */}

      <section className="max-w-4xl mx-auto px-6 py-16">

        {/* HEADER */}

        <div className="mb-10">

          <p className="text-xs uppercase tracking-[0.3em] text-[var(--lime)] font-bold mb-3">
            TruthLens Intelligence
          </p>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            ANALYZE CLAIM.
          </h1>

          <p className="mt-5 max-w-2xl text-[var(--muted)] leading-7">
            Enter a news claim or viral post to analyze its
            category using the TruthLens trained AI model.
          </p>

        </div>


        {/* ANALYSIS CARD */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-10">

          {/* CLAIM */}

          <label className="block text-sm font-bold mb-3">
            Claim / News Text
          </label>

          <textarea
            value={text}
            onChange={(e) => {

              setText(e.target.value);

              setAiCategory("");
              setConfidence(null);

              setError("");
              setSubmitError("");

            }}
            rows={9}
            placeholder="Paste the viral claim or news text here..."
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-[var(--ink)]
              px-5
              py-5
              text-[var(--cream)]
              placeholder:text-[var(--muted)]
              outline-none
              resize-none
              focus:border-[var(--lime)]
              transition
            "
          />


          {/* CHARACTER COUNT */}

          <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">

            <span>
              Your claim will be analyzed by the trained AI model.
            </span>

            <span>
              {text.length}
            </span>

          </div>


          {/* INFO */}

          <div className="mt-8 rounded-2xl border border-[var(--lime)]/20 bg-[var(--lime)]/5 p-5">

            <p className="text-sm leading-6 text-[var(--muted)]">
              TruthLens analyzes the submitted text using its
              trained TensorFlow classification model and
              predicts the category of the claim.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="mt-6 rounded-2xl border border-[var(--pink)]/40 bg-[var(--pink)]/10 p-5">

              <p className="text-sm text-[var(--pink)]">
                {error}
              </p>

            </div>

          )}


          {/* ANALYZE BUTTON */}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !text.trim()}
            className="
              lime-button
              mt-8
              w-full
              rounded-2xl
              px-6
              py-4
              text-sm
              font-black
              uppercase
              tracking-wider
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >

            {analyzing
              ? "Analyzing with AI..."
              : "Analyze Claim →"}

          </button>


          {/* AI RESULT */}

          {aiCategory && (

            <div className="mt-8 rounded-3xl border border-[var(--lime)]/30 bg-[var(--lime)]/5 p-7">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--lime)] font-bold">
                    AI Analysis Complete
                  </p>

                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Prediction generated by the TruthLens
                    TensorFlow model.
                  </p>

                </div>

                <div className="w-10 h-10 rounded-full border border-[var(--lime)]/30 flex items-center justify-center text-[var(--lime)]">
                  ✓
                </div>

              </div>


              {/* RESULT GRID */}

              <div className="grid md:grid-cols-2 gap-6 mt-8">

                {/* CATEGORY */}

                <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                  <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                    Predicted Category
                  </p>

                  <h2 className="mt-3 text-3xl md:text-4xl font-black text-[var(--lime)]">
                    {aiCategory}
                  </h2>

                </div>


                {/* CONFIDENCE */}

                <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                  <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                    Model Confidence
                  </p>

                  <h2 className="mt-3 text-3xl md:text-4xl font-black">

                    {confidence !== null
                      ? `${(confidence * 100).toFixed(2)}%`
                      : "--"}

                  </h2>

                </div>

              </div>


              {/* SUBMIT CLAIM */}

              <button
                type="button"
                onClick={handleSubmitClaim}
                disabled={submitting}
                className="
                  lime-button
                  mt-6
                  w-full
                  rounded-2xl
                  px-6
                  py-4
                  text-sm
                  font-black
                  uppercase
                  tracking-wider
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >

                {submitting
                  ? "Submitting Claim..."
                  : "Submit Claim →"}

              </button>


              {/* SUBMIT ERROR */}

              {submitError && (

                <div className="mt-5 rounded-2xl border border-[var(--pink)]/40 bg-[var(--pink)]/10 p-5">

                  <p className="text-sm text-[var(--pink)]">
                    {submitError}
                  </p>

                </div>

              )}


              {/* ANALYZE AGAIN */}

              <button
                type="button"
                onClick={handleClear}
                className="
                  mt-4
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  px-6
                  py-4
                  text-sm
                  font-bold
                  text-[var(--muted)]
                  hover:text-[var(--cream)]
                  hover:bg-white/5
                  transition
                "
              >
                Analyze Another Claim
              </button>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}