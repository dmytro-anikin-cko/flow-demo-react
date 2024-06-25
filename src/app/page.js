import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Link className="link link-primary" href={'/checkout'}>Proceed to payment</Link>
      </div>
    </main>
  );
}
