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
    <div className="flex w-full max-w-[360px] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-light/20 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-primary/5">
      <div className="flex h-full w-full flex-col items-center gap-3 p-8">
        <div className="relative aspect-square w-[140px] overflow-hidden rounded-full ring-2 ring-primary-light/20 md:w-[170px]">
          <Image src={imagePath} alt={name} fill className="object-cover" />
        </div>
        <p className="mt-4 text-center text-xl font-bold text-on-surface">
          {name}
        </p>
        <div className="flex items-center gap-1.5">
          <Image
            src="/haksamo.svg"
            alt="학번"
            width={20}
            height={20}
            className="opacity-50"
          />
          <p className="text-sm font-medium text-on-surface/40">
            {studentId}학번
          </p>
        </div>
        <div className="mt-2 w-full rounded-xl bg-white/[0.04] px-5 py-3">
          <p className="text-center text-sm font-medium leading-relaxed text-on-surface/60">
            {introduction}
          </p>
        </div>
      </div>
    </div>
  );
}
