"use client";

import { useState } from "react";
import Link from "next/link";

const claims = [
  {
    id: "1",
    text: "BREAKING!!! SHOCKING NEWS!!! Share before deleted!",
    platform: "WhatsApp",
    category: "Politics",
    flags: ["Sensational", "Shouting", "Unsourced"],
    risk: "HIGH RISK",
    status: "Unverified",
    time: "12 min ago",
  },
  {
    id: "2",
    text: "Scientists announce a major discovery related to public health.",
    platform: "X",
    category: "Health",
    flags: ["Unsourced"],
    risk: "NORMAL",
    status: "Verified True",
    time: "34 min ago",
  },
  {
    id: "3",
    text: "SHOCKING investment opportunity! Guaranteed huge returns!",
    platform: "Instagram",
    category: "Finance",
    flags: ["Sensational", "Shouting"],
    risk: "HIGH RISK",
    status: "Misleading",
    time: "1 hr ago",
  },
];

const categories = [
  "ALL",
  "POLITICS",
  "HEALTH",
  "FINANCE",
  "OTHER",
];

export default function Home() {
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const filteredClaims = claims.filter((claim) => {
    const categoryMatch =
      category === "ALL" ||
      claim.category.toUpperCase() === category;

    const statusMatch =
      status === "ALL" ||
      claim.status === status;

    return categoryMatch && statusMatch;
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--ink)] text-[var(--cream)]">

      {/* =====================================================
          BACKGROUND 3D ELEMENTS
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Olive glow */}
        <div
          className="
            absolute
            -right-32
            top-20
            h-96
            w-96
            rounded-full
            bg-[var(--lime)]
            opacity-[0.08]
            blur-3xl
          "
        />

        {/* Burgundy glow */}
        <div
          className="
            absolute
            -left-32
            top-[45%]
            h-96
            w-96
            rounded-full
            bg-[var(--pink)]
            opacity-[0.12]
            blur-3xl
          "
        />

        {/* Floating square */}
        <div
          className="
            absolute
            right-[15%]
            top-[15%]
            h-32
            w-32
            rotate-12
            border
            border-[var(--lime)]
            opacity-20
          "
        />

      </div>


      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="relative z-10 border-b border-white/10">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}

          <Link
            href="/"
            className="group flex items-center gap-3"
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[var(--lime)]
                text-xl
                font-black
                text-[var(--ink)]
                transition-transform
                duration-300
                group-hover:rotate-12
              "
            >
              T
            </div>

            <div>

              <div className="text-lg font-black tracking-tight">
                TruthLens
              </div>

              <div
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-[var(--pigeon)]
                "
              >
                Civic Intelligence
              </div>

            </div>

          </Link>


          {/* Submit button */}

          <Link
            href="/submit"
            className="
              lime-button
              rounded-full
              px-5
              py-2.5
              text-sm
              font-bold
            "
          >
            + ANALYZE Claim
          </Link>

        </div>

      </header>


      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
          pb-16
          pt-20
          md:pb-24
          md:pt-28
        "
      >

        <div
          className="
            grid
            items-center
            gap-12
            lg:grid-cols-[1.3fr_0.7fr]
          "
        >

          {/* HERO TEXT */}

          <div>

            {/* Small label */}

            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[var(--pigeon)]
                border-opacity-30
                px-4
                py-2
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-[var(--pigeon)]
              "
            >

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[var(--lime)]
                "
                style={{
                  boxShadow: "0 0 12px var(--lime)",
                }}
              />

              Live Claim Triage

            </div>


            {/* Main heading */}

            <h1
              className="
                max-w-4xl
                text-5xl
                font-black
                leading-[0.9]
                tracking-[-0.05em]
                md:text-7xl
                lg:text-8xl
              "
            >

              VERIFY

              <br />

              <span className="text-[var(--pink)]">
                INFORMATION.
              </span>

            </h1>


            {/* Description */}

            <p
              className="
                mt-8
                max-w-xl
                text-base
                leading-7
                text-[var(--pigeon)]
                md:text-lg
              "
            >
              A transparent space for identifying viral claims,
              understanding risk signals, and reviewing information
              without judging ideology.
            </p>


            {/* Hero buttons */}

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/submit"
                className="
                  lime-button
                  rounded-full
                  px-7
                  py-4
                  text-sm
                  font-black
                  uppercase
                  tracking-wider
                "
              >
               Analyze Claim →
              </Link>


              <a
                href="#feed"
                className="
                  rounded-full
                  border
                  border-[var(--pigeon)]
                  border-opacity-40
                  px-7
                  py-4
                  text-sm
                  font-bold
                  text-[var(--cream)]
                  transition
                  hover:border-[var(--pink)]
                "
              >
                Explore Feed
              </a>

            </div>

          </div>


          {/* =================================================
              3D STAT CARDS
          ================================================== */}

          <div
            className="
              perspective
              relative
              hidden
              h-[360px]
              lg:block
            "
          >

            {/* CARD 1 */}

            <div
              className="
                float
                absolute
                right-0
                top-5
                w-64
                rotate-6
                rounded-3xl
                border
                border-white/10
                bg-[var(--pigeon)]
                p-7
                text-[var(--ink)]
                shadow-2xl
              "
            >

              <p className="text-xs font-black uppercase tracking-widest">
                Claims Tracked
              </p>

              <p className="mt-8 text-6xl font-black">
                1,248
              </p>

              <div
                className="
                  mt-8
                  h-1
                  rounded-full
                  bg-[var(--ink)]
                  opacity-20
                "
              >

                <div
                  className="
                    h-full
                    w-[78%]
                    rounded-full
                    bg-[var(--lime)]
                  "
                />

              </div>

            </div>


            {/* CARD 2 */}

            <div
              className="
                float
                absolute
                bottom-5
                left-0
                z-10
                w-60
                -rotate-6
                rounded-3xl
                border
                border-white/10
                bg-[var(--pink)]
                p-7
                text-[var(--cream)]
                shadow-2xl
              "
              style={{
                animationDelay: "1s",
              }}
            >

              <p className="text-xs font-black uppercase tracking-widest">
                High Risk
              </p>

              <p className="mt-6 text-6xl font-black">
                82
              </p>

              <p className="mt-3 text-sm font-semibold">
                Claims requiring attention
              </p>

            </div>


            {/* CENTER 3D CARD */}

            <div
              className="
                absolute
                left-[38%]
                top-[40%]
                z-20
                flex
                h-28
                w-28
                rotate-12
                items-center
                justify-center
                rounded-3xl
                bg-[var(--lime)]
                text-center
                text-[var(--ink)]
              "
              style={{
                boxShadow:
                  "0 20px 50px color-mix(in srgb, var(--lime) 25%, transparent)",
              }}
            >

              <div>

                <div className="text-3xl font-black">
                  3
                </div>

                <div
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-widest
                  "
                >
                  Risk Flags
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PUBLIC FEED
      ====================================================== */}

      <section
        id="feed"
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
          pb-24
        "
      >

        {/* Feed heading */}

        <div
          className="
            mb-8
            flex
            flex-col
            justify-between
            gap-5
            md:flex-row
            md:items-end
          "
        >

          <div>

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.3em]
                text-[var(--lime)]
              "
            >
              Public Feed
            </p>

            <h2
              className="
                mt-2
                text-3xl
                font-black
                tracking-tight
                md:text-4xl
              "
            >
              Viral claims, clearly labelled.
            </h2>

          </div>


          <div className="text-sm text-[var(--pigeon)]">
            {filteredClaims.length} claims shown
          </div>

        </div>


        {/* =================================================
            FILTERS
        ================================================== */}

        <div className="mb-8 flex flex-wrap gap-2">

          {categories.map((item) => (

            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`
                rounded-full
                px-5
                py-2.5
                text-xs
                font-black
                tracking-wider
                transition-all

                ${
                  category === item
                    ? "bg-[var(--lime)] text-[var(--ink)]"
                    : "border border-[var(--pigeon)] border-opacity-30 text-[var(--pigeon)] hover:border-[var(--pink)] hover:text-[var(--pink)]"
                }
              `}
            >
              {item}
            </button>

          ))}


          {/* Status filter */}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              ml-auto
              rounded-full
              border
              border-[var(--pigeon)]
              border-opacity-30
              bg-[var(--ink)]
              px-5
              py-2.5
              text-xs
              font-bold
              text-[var(--cream)]
              outline-none
            "
          >

            <option value="ALL">
              ALL STATUS
            </option>

            <option value="Unverified">
              UNVERIFIED
            </option>

            <option value="Verified True">
              VERIFIED TRUE
            </option>

            <option value="False">
              FALSE
            </option>

            <option value="Misleading">
              MISLEADING
            </option>

          </select>

        </div>


        {/* =================================================
            CLAIM CARDS
        ================================================== */}

        <div
          className="
            grid
            gap-5
            md:grid-cols-2
            lg:grid-cols-3
          "
        >

          {filteredClaims.map((claim) => (

            <article
              key={claim.id}
              className="
                card-3d
                group
                rounded-[28px]
                border
                border-white/10
                bg-[var(--pigeon)]
                bg-opacity-[0.10]
                p-6
                backdrop-blur-xl
              "
            >

              {/* Risk + status */}

              <div className="flex items-start justify-between gap-3">

                <span
                  className={`
                    rounded-full
                    px-3
                    py-1.5
                    text-[10px]
                    font-black
                    tracking-wider

                    ${
                      claim.risk === "HIGH RISK"
                        ? "bg-[var(--pink)] text-[var(--cream)]"
                        : "bg-[var(--pigeon)] bg-opacity-20 text-[var(--pigeon)]"
                    }
                  `}
                >
                  {claim.risk}
                </span>


                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-[var(--pigeon)]
                  "
                >
                  {claim.status}
                </span>

              </div>


              {/* Claim text */}

              <p
                className="
                  mt-7
                  min-h-[120px]
                  text-lg
                  font-bold
                  leading-7
                  text-[var(--cream)]
                "
              >
                "{claim.text}"
              </p>


              {/* Platform + category */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[var(--pigeon)]
                "
              >

                <span>
                  {claim.platform}
                </span>

                <span>
                  ·
                </span>

                <span>
                  {claim.category}
                </span>

              </div>


              {/* Risk flags */}

              <div className="mt-5 flex flex-wrap gap-2">

                {claim.flags.map((flag) => (

                  <span
                    key={flag}
                    className="
                      rounded-lg
                      bg-[var(--ink)]
                      px-3
                      py-1.5
                      text-[10px]
                      font-bold
                      text-[var(--pigeon)]
                    "
                  >
                    ⚠ {flag}
                  </span>

                ))}

              </div>


              {/* Card footer */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/10
                  pt-5
                "
              >

                <span
                  className="
                    text-xs
                    text-[var(--pigeon)]
                  "
                >
                  {claim.time}
                </span>


                <Link
                  href={`/claims/${claim.id}`}
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-wider
                    text-[var(--lime)]
                    transition
                    hover:text-[var(--pink)]
                  "
                >
                  View Claim →
                </Link>

              </div>

            </article>

          ))}

        </div>


        {/* Empty state */}

        {filteredClaims.length === 0 && (

          <div
            className="
              rounded-3xl
              border
              border-dashed
              border-[var(--pigeon)]
              border-opacity-30
              py-20
              text-center
            "
          >

            <p className="text-[var(--pigeon)]">
              No claims match the selected filters.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-white/10">

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            justify-between
            gap-4
            px-6
            py-8
            text-xs
            md:flex-row
            md:items-center
          "
        >

          <div
            className="
              font-black
              tracking-widest
              text-[var(--cream)]
            "
          >
            TruthLens
          </div>

          <div className="text-[var(--pigeon)]">
            Verify information. Not ideologies.
          </div>

        </div>

      </footer>

    </main>
  );
}