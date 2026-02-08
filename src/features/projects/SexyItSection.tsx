"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TabButton from "@/components/ui/TabButton";
import type { SexyIt } from "@/types";

interface Props {
  data: SexyIt[];
}

export default function SexyItSection({ data }: Props) {
  const [visiblePosts, setVisiblePosts] = useState(6);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 overflow-hidden px-6 md:gap-16 md:px-12">
      <section className="flex w-full flex-col gap-3 md:gap-5">
        <h2 className="text-xl font-bold tracking-tight text-on-surface sm:text-4xl">
          섹시한 IT
        </h2>
        <p className="text-sm text-muted sm:text-lg">
          매달 다양한 IT관련 주제를 가지고 카드뉴스를 만들어 정보를 공유하는
          활동
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            Instagram
          </span>
          <a
            href="https://www.instagram.com/sexyit_season2/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border bg-surface-light px-3 py-1 text-sm text-on-surface-dim transition-colors hover:border-on-surface-dim/30 hover:text-on-surface"
          >
            @sexyit_season2
          </a>
          <a
            href="https://www.instagram.com/sexyit2018/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border bg-surface-light px-3 py-1 text-sm text-on-surface-dim transition-colors hover:border-on-surface-dim/30 hover:text-on-surface"
          >
            @sexyit2018
          </a>
        </div>
      </section>

      <section className="w-full">
        <div className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {data.slice(0, visiblePosts).map((card) => (
            <Link
              key={card.id}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-surface-light transition-all duration-300 hover:-translate-y-0.5 hover:border-on-surface-dim/20">
                <Image
                  src={card.imagePath}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs text-on-surface-dim">{card.date}</p>
                  <h3 className="mt-1 text-base font-bold tracking-tight text-on-surface">{card.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mb-10 flex w-full items-center justify-center md:mb-16">
        {visiblePosts < data.length && (
          <TabButton
            label="더보기"
            selected
            onClick={() => setVisiblePosts((v) => v + 6)}
          />
        )}
      </div>
    </div>
  );
}
