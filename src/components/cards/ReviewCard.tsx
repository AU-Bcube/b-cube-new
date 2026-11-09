import Image from "next/image";

interface ReviewCardProps {
  name: string;
  studentId: string;
  content: string;
}

export default function ReviewCard({ name, studentId, content }: ReviewCardProps) {
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div data-no-grid className="glass flex w-full flex-col rounded-[11px] px-4.5 pt-4 pb-4.5">
      <div className="flex items-center gap-3.25">
        <p className="text-sm font-bold leading-6 text-on-surface md:text-base">
          {name}
        </p>
        <div className="flex items-center gap-1.25">
          <Image
            src="/haksamo.svg"
            alt="학번"
            width={13}
            height={14}
            className="opacity-70"
          />
          <p className="text-sm font-medium leading-5 text-on-surface/40 md:text-base">
            {studentId}학번
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-2.5">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="whitespace-pre-line text-sm font-medium leading-[1.6] text-on-surface/75 md:text-base"
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
