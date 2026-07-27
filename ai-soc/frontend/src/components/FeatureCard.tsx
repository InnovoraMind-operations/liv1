"use client";

// ---------------------------------------------------------------------------
// FeatureCard — Client Component
// Used by the landing page (app/page.tsx) which must remain a Server Component
// due to its metadata export. Event handlers are isolated here so the parent
// page file never violates the RSC boundary rule.
// ---------------------------------------------------------------------------

export function FeatureCard({
  iconColor,
  iconBg,
  iconBorder,
  title,
  subtitle,
  body,
  icon,
}: {
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  title: string;
  subtitle: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="p-8 rounded-lg backdrop-blur shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 cursor-default"
      style={{
        border: "1px solid rgba(212,175,55,0.12)",
        backgroundColor: "rgba(15,42,28,0.55)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(212,175,55,0.28)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 30px -8px rgba(212,175,55,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(212,175,55,0.12)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 mb-[1.618rem] rounded flex items-center justify-center border"
        style={{ backgroundColor: iconBg, borderColor: iconBorder }}
      >
        <svg
          className="w-6 h-6"
          style={{ color: iconColor }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icon}
        </svg>
      </div>

      <h2
        className="text-[2.618rem] font-bold mb-[1rem] leading-tight"
        style={{ color: "#F5F0E8" }}
      >
        {title}
      </h2>
      <h3
        className="text-[1.618rem] font-bold mb-[1rem] font-mono"
        style={{ color: "#D4AF37" }}
      >
        {subtitle}
      </h3>
      <p className="text-[1rem] leading-relaxed" style={{ color: "#8A9E8E" }}>
        {body}
      </p>
    </div>
  );
}
