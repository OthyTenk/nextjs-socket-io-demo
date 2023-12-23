import Link from "next/link";

export default function TestPage() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between bg-neutral-800 p-24`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm text-neutral-400 lg:flex">
        This is test page
        <Link href="/chat">Play Game</Link>
        <Link href="/">Home</Link>
      </div>
    </main>
  );
}
