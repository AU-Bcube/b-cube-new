import Image from "next/image";

interface ProfileCardProps {
  name: string;
  studentId: string;
  introduction: string;
  imagePath: string;
}

export default function ProfileCard({
  name,
  studentId,
  introduction,
  imagePath,
}: ProfileCardProps) {
  return (
    <div className="flex w-full max-w-[360px] overflow-hidden rounded-xl border border-border bg-surface-light transition-all duration-300 hover:-translate-y-0.5 hover:border-on-surface-dim/20">
      <div className="flex h-full w-full flex-col items-center gap-3 p-8">
        <div className="relative aspect-square w-[130px] overflow-hidden rounded-full ring-2 ring-border md:w-[160px]">
          <Image src={imagePath} alt={name} fill className="object-cover" />
        </div>
        <p className="mt-3 text-center text-lg font-bold tracking-tight text-on-surface">
          {name}
        </p>
        <div className="flex items-center gap-1.5">
          <Image
            src="/haksamo.svg"
            alt="학번"
            width={18}
            height={18}
            className="opacity-40"
          />
          <p className="text-sm text-muted">
            {studentId}학번
          </p>
        </div>
        <div className="mt-1 w-full rounded-lg bg-surface/60 px-4 py-3">
          <p className="text-center text-sm leading-relaxed text-on-surface-dim">
            {introduction}
          </p>
        </div>
      </div>
    </div>
  );
}
