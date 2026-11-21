import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-2xl font-extrabold">No encontramos esta página</h1>
      <p className="mt-2 text-ink-2">Puede que la instalación haya cambiado de nombre o que la ciudad aún no esté disponible.</p>
      <Link href="/" className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Volver al inicio</Link>
    </main>
  );
}
