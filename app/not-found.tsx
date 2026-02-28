import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_20%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_52%,_#f7f5ef_100%)]">
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-full rounded-[2rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-8 shadow-[0_24px_80px_rgba(37,99,235,0.1)] sm:p-10">
          <p className="text-xs font-medium tracking-[0.24em] text-[#2563EB] uppercase">
            Not Found
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            That project does not exist.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#475569] sm:text-base">
            This project could not be found. Head back home to open another
            project or start a new one.
          </p>
          <div className="mt-6">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#2563EB] px-6 text-white hover:bg-[#DBEAFE] hover:text-[#1D4ED8]"
            >
              <Link href="/">Back to projects</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
