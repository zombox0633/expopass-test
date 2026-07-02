export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-7 p-4 text-center">
      <p className="text-foreground/60 text-sm font-bold tracking-[0.18em] uppercase">404</p>

      <h1 className="text-5xl font-semibold tracking-tight uppercase sm:text-7xl">not_found</h1>

      <p className="text-foreground/60 max-w-md text-sm">
        The page you are looking for does not exist or has been moved.
      </p>
    </div>
  );
}
