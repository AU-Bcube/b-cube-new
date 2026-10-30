import Image from "next/image";

interface ReviewCardProps {
  name: string;
  studentId: string;
  content: string;
}

export default function ReviewCard({ name, studentId, content }: ReviewCardProps) {
  return (
    <div data-no-grid className="glass flex w-full flex-col px-6 pt-5 pb-5 md:px-8.5">
      <div className="flex items-center gap-2.5 py-2.5">
        <p className="text-xl font-bold leading-7 text-on-surface md:text-2xl">
          {name}
        </p>
        <div className="flex items-center gap-2">
          <Image
            src="/haksamo.svg"
            alt="학번"
            width={20}
            height={20}
            className="opacity-40"
          />
          <p className="text-base font-medium leading-5 text-on-surface/40 md:text-lg">
            {studentId}학번
          </p>
        </div>
      </div>
      <p className="whitespace-pre-line pt-2.5 text-base font-medium leading-[1.4] text-on-surface md:text-lg md:leading-[22.75px]">
        {content}
      </p>
    </div>
  );
}
