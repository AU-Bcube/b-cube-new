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
    <div data-no-grid className="group flex w-full max-w-90 overflow-hidden glass hover:border-primary-light/20 hover:bg-white/6">
      <div className="flex h-full w-full flex-col items-center gap-3 p-8">
        <div className="relative aspect-square w-35 overflow-hidden rounded-full ring-1 ring-white/10 transition-all duration-300 group-hover:ring-primary-light/30 md:w-42.5">
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
            className="opacity-40"
          />
          <p className="text-sm font-medium text-on-surface/40">
            {studentId}학번
          </p>
        </div>
        <div className="mt-2 w-full rounded-xl border border-white/6 bg-white/3 px-5 py-3">
          <p className="text-center text-sm font-medium leading-relaxed text-on-surface/50">
            {introduction}
          </p>
        </div>
      </div>
    </div>
  );
}
