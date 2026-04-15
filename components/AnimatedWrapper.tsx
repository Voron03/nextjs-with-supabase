"use client";

import { useEffect, useState } from "react";

export default function AnimatedWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`
        transition-all duration-700 ease-out
        ${
          show
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }
      `}
    >
      {children}
    </div>
  );
}
