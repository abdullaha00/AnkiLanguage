import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  const features = [
    {
      title: "Anki vocabulary analysis",
      description:
        "Connect to AnkiConnect, select a deck, then estimate the vocabulary already covered by your cards.",
      href: "/anki",
    },
    {
      title: "OCR from screenshots",
      description:
        "Paste a screenshot, crop a region of interest, and extract text for lookup or readability checks.",
      href: "/ocr",
    },
    {
      title: "AI tutor chat",
      description:
        "Chat to improve your language skils.",
      href: "/chat",
    },
  ];

  return (
    <main className="min-h-screen py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="rounded-3xl border bg-card p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Language Learning Project
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Word estimation from Anki cards
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Note: currently supports OCR/Anki vocab analysis for Japanese
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="group h-full transition hover:-translate-y-1 hover:shadow-md">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                  <p className="mt-4 text-sm font-medium">
                    Open tool
                    <span className="ml-1 inline-block transition group-hover:translate-x-1">
                      -&gt;
                    </span>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
