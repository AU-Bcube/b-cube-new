import Image from "next/image";

interface ReviewCardProps {
  name: string;
  studentId: string;
  content: string;
}

export default function ReviewCard({ name, studentId, content }: ReviewCardProps) {
  return (
    <div data-no-grid className="glass flex w-full flex-col px-6 py-4 md:px-8.5 md:py-5">
      <div className="flex items-center gap-2 py-1.5">
        <p className="text-sm font-bold leading-6 text-on-surface md:text-base">
          {name}
        </p>
        <div className="flex items-center gap-1.5">
          <Image
            src="/haksamo.svg"
            alt="학번"
            width={16}
            height={16}
            className="opacity-40"
          />
          <p className="text-sm font-medium leading-5 text-on-surface/40 md:text-base">
            {studentId}학번
          </p>
        </div>
      </div>
      <p className="whitespace-pre-line pt-2 text-sm font-medium leading-[1.6] text-on-surface/75 md:text-base">
        {content}
      </p>
    </div>
  );
}
