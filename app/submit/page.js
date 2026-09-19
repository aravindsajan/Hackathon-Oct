"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnalyzeClaim() {
  // =========================
  // CLAIM INPUTS
  // =========================

  const [title, setTitle] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [link, setLink] = useState("");
  const [text, setText] = useState("");

  // =========================
  // AI RESULTS
  // =========================

  const [aiCategory, setAiCategory] = useState("");
  const [categoryConfidence, setCategoryConfidence] = useState(null);

  const [verification, setVerification] = useState("");
  const [verificationConfidence, setVerificationConfidence] =
    useState(null);

  const [riskLevel, setRiskLevel] = useState("");
  const [riskFlags, setRiskFlags] = useState([]);

  // =========================
  // STATES
  // =========================

  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [submittedClaim, setSubmittedClaim] = useState(null);

  // =========================
  // ANALYZE CLAIM
  // =========================

  async function handleAnalyze() {
    console.log("ANALYZE BUTTON CLICKED");

    // Validation

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!sourcePlatform) {
      setError("Please select the source platform.");
      return;
    }

    if (!link.trim()) {
      setError("Please enter the source link.");
      return;
    }

    if (!text.trim()) {
      setError("Please enter a claim before analyzing.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setSubmitError("");

    // Clear previous results

    setAiCategory("");
    setCategoryConfidence(null);

    setVerification("");
    setVerificationConfidence(null);

    setRiskLevel("");
    setRiskFlags([]);

    try {
      console.log("Sending request to Python AI...");

      const response = await fetch(
        "http://127.0.0.1:3001/predict-category",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),
            link: link.trim(),
            news: text.trim(),
          }),
        }
      );

      console.log("AI RESPONSE STATUS:", response.status);

      if (!response.ok) {
        throw new Error(
          `AI model returned status ${response.status}`
        );
      }

      const data = await response.json();

      console.log("AI MODEL RESULT:", data);

      // =========================
      // CATEGORY
      // =========================

      setAiCategory(data.category);

      setCategoryConfidence(
        data.confidence_cat
      );

      // =========================
      // VERIFICATION
      // =========================

      setVerification(data.verification);

      setVerificationConfidence(
        data.confidence_ver
      );

      // =========================
      // RISK FLAGS
      // =========================

      const flags = [];

      if (data.sensational) {
        flags.push("Sensational");
      }

      if (data.shouting) {
        flags.push("Shouting");
      }

      if (data.source) {
        flags.push("Unsourced");
      }

      setRiskFlags(flags);

      // =========================
      // RISK LEVEL
      // =========================

      let level = "LOW RISK";

      if (data.risk) {
        level = "HIGH RISK";
      } else if (flags.length === 1) {
        level = "MEDIUM RISK";
      }

      setRiskLevel(level);

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
    if (!title.trim()) {
      setSubmitError("Please enter a title.");
      return;
    }

    if (!sourcePlatform) {
      setSubmitError("Please select the source platform.");
      return;
    }

    if (!link.trim()) {
      setSubmitError("Please enter the source link.");
      return;
    }

    if (!text.trim()) {
      setSubmitError("Please enter a claim.");
      return;
    }

    if (!aiCategory) {
      setSubmitError(
        "Please analyze the claim before submitting."
      );
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
          title: title.trim(),
          text: text.trim(),
          sourcePlatform,
          link: link.trim(),

          category: aiCategory,
          categoryConfidence,

          verification,
          verificationConfidence,

          riskLevel,
          riskFlags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit claim."
        );
      }

      console.log("CLAIM SUBMITTED:", data);

      setSubmittedClaim(data.claim);

    } catch (err) {
      console.error("SUBMIT ERROR:", err);

      setSubmitError(
        err.message ||
          "Unable to submit the claim."
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
          data.message ||
            "Failed to delete claim."
        );
      }

      handleClear();

    } catch (err) {
      console.error("DELETE ERROR:", err);

      setSubmitError(
        err.message ||
          "Unable to delete the claim."
      );
    }
  }

  // =========================
  // CLEAR
  // =========================

  function handleClear() {
    setTitle("");
    setSourcePlatform("");
    setLink("");
    setText("");

    setAiCategory("");
    setCategoryConfidence(null);

    setVerification("");
    setVerificationConfidence(null);

    setRiskLevel("");
    setRiskFlags([]);

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
              Truth
              <span className="text-[var(--lime)]">
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
              public TruthLens feed.
            </p>

          </div>

          {/* CLAIM CARD */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-10">

            {/* STATUS */}

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

            {/* TITLE */}

            <div className="mt-8">

              <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                Title
              </p>

              <h2 className="mt-3 text-2xl md:text-3xl font-black">
                {submittedClaim.title}
              </h2>

            </div>

            {/* SOURCE */}

            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                  Source Platform
                </p>

                <h2 className="mt-3 text-xl font-black">
                  {submittedClaim.sourcePlatform}
                </h2>

              </div>

              <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                  Source Link
                </p>

                <a
                  href={submittedClaim.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-sm text-[var(--lime)] break-all hover:underline"
                >
                  {submittedClaim.link}
                </a>

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

            {/* AI RESULTS */}

            <div className="grid md:grid-cols-2 gap-6 mt-8">

              {/* CATEGORY */}

              <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                  AI Predicted Category
                </p>

                <h2 className="mt-3 text-3xl font-black text-[var(--lime)]">
                  {submittedClaim.category}
                </h2>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  Confidence:{" "}
                  {submittedClaim.categoryConfidence != null
                    ? `${(
                        submittedClaim.categoryConfidence * 100
                      ).toFixed(1)}%`
                    : "--"}
                </p>

              </div>

              {/* VERIFICATION */}

              <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                  AI Verification
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  {submittedClaim.verification}
                </h2>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  Confidence:{" "}
                  {submittedClaim.verificationConfidence != null
                    ? `${(
                        submittedClaim.verificationConfidence * 100
                      ).toFixed(1)}%`
                    : "--"}
                </p>

              </div>

              {/* RISK */}

              <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                  Risk Assessment
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  {submittedClaim.riskLevel}
                </h2>

              </div>

              {/* FLAGS */}

              <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                  Risk Flags
                </p>

                <p className="mt-3 text-lg font-bold">
                  {submittedClaim.riskFlags?.length > 0
                    ? submittedClaim.riskFlags.join(" · ")
                    : "No risk flags detected"}
                </p>

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
            Truth
            <span className="text-[var(--lime)]">
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
            category, verification status, and risk signals
            using the TruthLens trained AI models.
          </p>

        </div>

        {/* ANALYSIS CARD */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-10">

          {/* TITLE */}

          <label className="block text-sm font-bold mb-3">
            Claim Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
              setSubmitError("");
            }}
            placeholder="Enter a short title for the claim..."
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-[var(--ink)]
              px-5
              py-4
              text-[var(--cream)]
              placeholder:text-[var(--muted)]
              outline-none
              focus:border-[var(--lime)]
              transition
            "
          />

          {/* SOURCE PLATFORM */}

          <div className="mt-6">

            <label className="block text-sm font-bold mb-3">
              Source Platform
            </label>

            <select
              value={sourcePlatform}
              onChange={(e) => {
                setSourcePlatform(e.target.value);
                setError("");
                setSubmitError("");
              }}
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-[var(--ink)]
                px-5
                py-4
                text-[var(--cream)]
                outline-none
                focus:border-[var(--lime)]
                transition
              "
            >
              <option value="">
                Select source platform
              </option>

              <option value="WhatsApp">
                WhatsApp
              </option>

              <option value="Reddit">
                Reddit
              </option>

              <option value="X">
                X
              </option>

              <option value="Instagram">
                Instagram
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* SOURCE LINK */}

          <div className="mt-6">

            <label className="block text-sm font-bold mb-3">
              Source Link
            </label>

            <input
              type="url"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                setError("");
                setSubmitError("");
              }}
              placeholder="https://example.com/source"
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-[var(--ink)]
                px-5
                py-4
                text-[var(--cream)]
                placeholder:text-[var(--muted)]
                outline-none
                focus:border-[var(--lime)]
                transition
              "
            />

            <p className="mt-2 text-xs text-[var(--muted)]">
              Add the original source URL used for the claim.
            </p>

          </div>

          {/* CLAIM TEXT */}

          <div className="mt-6">

            <label className="block text-sm font-bold mb-3">
              Claim / News Text
            </label>

            <textarea
              value={text}
              onChange={(e) => {

                setText(e.target.value);

                setAiCategory("");
                setCategoryConfidence(null);

                setVerification("");
                setVerificationConfidence(null);

                setRiskLevel("");
                setRiskFlags([]);

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

          </div>

          {/* CHARACTER COUNT */}

          <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">

            <span>
              Your claim will be analyzed by the trained AI models.
            </span>

            <span>
              {text.length}
            </span>

          </div>

          {/* INFO */}

          <div className="mt-8 rounded-2xl border border-[var(--lime)]/20 bg-[var(--lime)]/5 p-5">

            <p className="text-sm leading-6 text-[var(--muted)]">
              TruthLens analyzes the submitted content using
              trained TensorFlow models to predict the category
              and verification status, while also detecting
              potential risk signals.
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
            disabled={analyzing}
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

              {/* RESULT HEADER */}

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--lime)] font-bold">
                    AI Analysis Complete
                  </p>

                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Prediction generated by the TruthLens
                    TensorFlow models.
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

                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Confidence:{" "}
                    {categoryConfidence !== null
                      ? `${(
                          categoryConfidence * 100
                        ).toFixed(1)}%`
                      : "--"}
                  </p>

                </div>

                {/* VERIFICATION */}

                <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                  <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                    Verification
                  </p>

                  <h2 className="mt-3 text-3xl md:text-4xl font-black">
                    {verification}
                  </h2>

                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Confidence:{" "}
                    {verificationConfidence !== null
                      ? `${(
                          verificationConfidence * 100
                        ).toFixed(1)}%`
                      : "--"}
                  </p>

                </div>

                {/* RISK */}

                <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                  <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                    Risk Assessment
                  </p>

                  <h2 className="mt-3 text-3xl md:text-4xl font-black">
                    {riskLevel}
                  </h2>

                </div>

                {/* FLAGS */}

                <div className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6">

                  <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                    Risk Flags
                  </p>

                  <p className="mt-3 text-lg font-bold">
                    {riskFlags.length > 0
                      ? riskFlags.join(" · ")
                      : "No risk flags detected"}
                  </p>

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