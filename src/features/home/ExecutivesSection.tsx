import Image from "next/image";
import FadeUp from "@/components/ui/FadeUp";
import type { Executive } from "@/types";

interface ExecutivesSectionProps {
  executives: Executive[];
}

export default function ExecutivesSection({ executives }: ExecutivesSectionProps) {
  if (executives.length === 0) {
    return <p className="text-center text-on-surface-dim">회장단 정보가 없습니다.</p>;
  }

  const sorted = [...executives].sort((a, b) =>
    a.role === "회장 " || a.role === "회장" ? -1 : b.role === "회장 " || b.role === "회장" ? 1 : 0
  );

  return (
    <ul className="mt-8 flex flex-col flex-wrap items-center justify-center gap-12 md:mt-12 md:flex-row md:gap-16">
      {sorted.map((exec, index) => (
        <li key={exec.id}>
          <FadeUp delay={index}>
            <div className="flex flex-col items-center gap-4">
              <div className="relative size-32 overflow-hidden rounded-full ring-2 ring-border md:size-44">
                <Image
                  src={exec.imagePath}
                  alt={`${exec.name} 프로필`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <h5 className="text-base font-bold tracking-tight text-on-surface md:text-lg">{exec.role}</h5>
                <h6 className="text-sm text-muted md:text-base">
                  {exec.studentId}학번&nbsp;{exec.name}
                </h6>
              </div>
            </div>
          </FadeUp>
        </li>
      ))}
    </ul>
  );
}
