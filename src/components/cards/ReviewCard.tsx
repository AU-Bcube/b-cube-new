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
        <p className="text-[15px] font-bold leading-5 text-on-surface">{name}</p>
        <div className="flex items-center gap-1.25">
          <Image
            src="/haksamo.svg"
            alt="학번"
            width={13}
            height={14}
            className="opacity-70"
          />
          <p className="text-[11px] font-medium leading-4 text-on-surface/40">
            {studentId}학번
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-2.5">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="whitespace-pre-line text-xs font-medium leading-[18.6px] text-on-surface"
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
