export default function Home() {
  return (
    <div className="relative h-screen flex flex-col justify-center align-center">
      {/* Top horizontal line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 w-screen border-t border-dashed sm:top-20"
        style={{ zIndex: 0 }}
      />
      {/* Bottom horizontal line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 w-screen border-t border-dashed sm:bottom-20"
        style={{ zIndex: 0 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-8 h-screen border-r border-dashed sm:left-20"
        style={{ zIndex: 0 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 h-screen border-r border-dashed sm:right-20"
        style={{ zIndex: 0 }}
      />
      <header className="text-center px-8">
        <h1 className="text-4xl text-primary font-medium mb-2">SpiroStudio</h1>
        <h2 className="max-w-xl mb-8 mx-auto text-xl text-secondary">
          Create mesmerizing geometric art with the timeless beauty of
          spirographs
        </h2>
        <p className="mb-6 mx-auto max-w-2xl text-accent">
          A spirograph is a geometric drawing toy that produces beautiful
          mathematical curves. Our digital version lets you explore endless
          combinations of wheels, ratios, and colors to create stunning
          geometric masterpieces.
        </p>
        <a
          href="/create"
          className="inline-block px-6 py-3 bg-secondary text-white font-semibold rounded shadow"
        >
          Start Creating &rarr;
        </a>
      </header>
    </div>
  );
}
