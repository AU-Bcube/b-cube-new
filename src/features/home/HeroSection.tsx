'use client';

import { useState, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import type { CubeRequest, Keyword } from './ThreeCube';
import styles from './HeroSection.module.css';

const ThreeCube = dynamic(() => import('./ThreeCube'), { ssr: false });

type Mode = 'broader' | 'better' | 'together';

const keywords: Keyword[] = ['Product', 'Content', 'Data', 'Teamwork', 'Network', 'Tech'];

const headlines: [Mode, string][] = [
  ['broader', 'Build Broader'],
  ['better', 'Build Better'],
  ['together', 'Build Together'],
];

export default function HeroSection() {
  const [mode, setMode] = useState<Mode>('together');
  const [activeKeyword, setActiveKeyword] = useState<Keyword | null>(null);
  const [cubeRequest, setCubeRequest] = useState<CubeRequest | null>(null);
  const [cubeBusy, setCubeBusy] = useState(true);

  const chooseKeyword = (value: Keyword) => {
    if (cubeBusy) return;
    setCubeRequest((current) => ({ id: (current?.id ?? 0) + 1, keyword: value }));
  };

  return (
    <section className={styles.hero} id="top">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <h1 className={styles.headline} aria-label="Build Broader, Build Better, Build Together">
            {headlines.map(([value, label], index) => (
              <button
                key={value}
                className={mode === value ? styles.selected : ''}
                style={{ '--line-delay': `${index * 110}ms` } as CSSProperties}
                onClick={() => setMode(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </h1>
          <p className={styles.eyebrow}>아주대학교 경영인텔리전스학과 IT 기획·개발 소학회</p>
          <p className={styles.description}>
            비큐브는 최신 IT 기술에 대한 이해를 바탕으로 웹 및 앱 서비스를 직접 기획하고 개발하는
            소학회입니다. 아이디어를 구현하는 과정에서 기획 능력과 개발 능력을 함께 성장시킬 수
            있습니다.
          </p>
          <div className={styles.chips} aria-label="키워드 선택">
            {keywords.map((item) => (
              <button
                key={item}
                type="button"
                className={activeKeyword === item ? styles.selected : ''}
                disabled={cubeBusy}
                onClick={() => chooseKeyword(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.cubeRegion}>
          <ThreeCube
            request={cubeRequest}
            onBusyChange={setCubeBusy}
            onSettled={setActiveKeyword}
            onUserMove={() => setActiveKeyword(null)}
          />
        </div>
      </div>
    </section>
  );
}
