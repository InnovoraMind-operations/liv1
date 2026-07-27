import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t backdrop-blur-md px-6 py-4 mt-auto"
      style={{
        borderColor: "rgba(30,69,48,0.5)",
        backgroundColor: "rgba(10,31,21,0.85)",
      }}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Brand / Version */}
        <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
          <span className="font-mono text-xs font-bold tracking-widest uppercase" style={{ color: "#8A9E8E" }}>
            AI-SOC Core Engine v0.1.0
          </span>
          <span className="hidden md:inline" style={{ color: "#1E4530" }}>|</span>
          <span className="font-mono text-[10px]" style={{ color: "#3D5C46" }}>
            &copy; {currentYear} &middot; RESTRICTED SYSTEM
          </span>
        </div>

        {/* Links + system status */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 text-xs font-medium" style={{ color: "#3D5C46" }}>
            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-amber-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors duration-200 hover:text-amber-400"
            >
              Terms of Service
            </Link>
          </div>

          <div className="hidden md:block w-px h-4" style={{ backgroundColor: "#1E4530" }} />

          {/* System operational pill — gold */}
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1 border"
            style={{
              backgroundColor: "rgba(212,175,55,0.05)",
              borderColor: "rgba(212,175,55,0.2)",
            }}
          >
            <div className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ backgroundColor: "#D4AF37" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: "#D4AF37" }}
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.65)" }}>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
