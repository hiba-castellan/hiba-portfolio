"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const STATS = [
  {
    value: 15,
    suffix: "+",
    label: "Technologies",
    sublabel: "ML, DS & Dev Stack",
    color: "#f0a0c0",
  },
  {
    value: 4,
    suffix: "+",
    label: "AI/ML Projects",
    sublabel: "Built & Deployed",
    color: "#c4a8e8",
  },
  {
    value: 3,
    suffix: "",
    label: "Specialisations",
    sublabel: "ML · DS · Computer Vision",
    color: "#98dcc8",
  },
  {
    value: 100,
    suffix: "%",
    label: "Passion",
    sublabel: "For Intelligent Systems",
    color: "#e0c878",
  },
];

function Counter({
  target,
  suffix,
  color,
  started,
}: {
  target: number;
  suffix: string;
  color: string;
  started: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <span
      className="text-4xl md:text-5xl font-bold tabular-nums"
      style={{ color, textShadow: `0 0 30px ${color}60` }}
    >
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section ref={ref} className="py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="relative flex flex-col items-center text-center p-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${stat.color}20`,
              boxShadow: inView ? `0 0 30px ${stat.color}10` : "none",
              transition: "box-shadow 1s ease",
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: 40,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
              }}
            />
            <Counter
              target={stat.value}
              suffix={stat.suffix}
              color={stat.color}
              started={inView}
            />
            <p className="mt-2 text-sm font-semibold text-white/80">{stat.label}</p>
            <p className="mt-0.5 text-xs text-white/35">{stat.sublabel}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
