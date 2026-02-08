"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import Image from "next/image";

type Tab =
  | "designton"
  | "sexyit"
  | "study"
  | "etc"
  | "activities"
  | "interview"
  | "executives"
  | "photo"
  | "contact";

const TABS: { key: Tab; label: string }[] = [
  { key: "designton", label: "디자인톤" },
  { key: "sexyit", label: "섹시한 IT" },
  { key: "study", label: "스터디" },
  { key: "etc", label: "기타" },
  { key: "activities", label: "주요활동" },
  { key: "interview", label: "인터뷰" },
  { key: "executives", label: "운영진" },
  { key: "photo", label: "활동사진" },
  { key: "contact", label: "연락처" },
];

type Item = Record<string, unknown>;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState<Tab>("designton");
  const [msg, setMsg] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [recruitSettings, setRecruitSettings] = useState({
    isRecruiting: false,
    recruitMessage: "",
    recruitLink: "",
  });
  const [recruitLoading, setRecruitLoading] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => { if (res.ok) setAuthed(true); })
      .finally(() => setChecking(false));
  }, []);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw }),
      });
      if (res.ok) setAuthed(true);
      else setMsg("로그인 실패");
    } catch {
      setMsg("네트워크 오류");
    }
    setLoginLoading(false);
  };

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
  };

  const fetchItems = useCallback(async (t: Tab) => {
    try {
      const res = await fetch(`/api/${t}`);
      if (!res.ok) { setItems([]); return; }
      const data = await res.json();
      setItems(Array.isArray(data) ? data : [data]);
      if (t === "contact") {
        const c = Array.isArray(data) ? data[0] : data;
        if (c) {
          const recruiting = c.isRecruiting ?? false;
          setRecruitSettings({
            isRecruiting: recruiting,
            recruitMessage: c.recruitMessage || (recruiting
              ? "B-CUBE와 함께할 새로운 멤버를 모집하고 있습니다.\n모집 마감: 2025년 3월 15일"
              : "지금은 모집 기간이 아닙니다.\n다음 모집은 2025년 9월에 예정되어 있습니다."),
            recruitLink: c.recruitLink ?? "",
          });
        }
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchItems(tab);
  }, [authed, tab, fetchItems]);

  const deleteItem = async (itemId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/${tab}/${itemId}`, { method: "DELETE" });
    fetchItems(tab);
  };

  const saveRecruitSettings = async () => {
    if (recruitSettings.isRecruiting && !recruitSettings.recruitLink.trim()) {
      setMsg("모집 중 상태에서는 지원 링크를 입력해야 합니다.");
      return;
    }
    setRecruitLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recruitSettings),
      });
      if (res.ok) {
        setMsg("모집 설정 저장 완료");
      } else {
        const err = await res.json().catch(() => null);
        setMsg(`모집 설정 저장 실패: ${err?.error || res.status}`);
      }
    } catch {
      setMsg("오류 발생");
    }
    setRecruitLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const formData = new FormData(e.currentTarget);
    try {
      if (tab === "contact") {
        const body = Object.fromEntries(formData);
        const res = await fetch("/api/contact", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        setMsg(data.message || "연락처 수정 완료");
      } else {
        const res = await fetch(`/api/${tab}`, { method: "POST", body: formData });
        const data = await res.json();
        setMsg(data.message || data.error || "완료");
      }
      (e.target as HTMLFormElement).reset();
      setShowAdd(false);
      fetchItems(tab);
    } catch {
      setMsg("오류 발생");
    }
    setLoading(false);
  };

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    setLoading(true);
    setMsg("");
    const formData = new FormData(e.currentTarget);

    try {
      let res: Response;
      if (tab === "contact") {
        res = await fetch("/api/contact", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(formData)),
        });
      } else {
        const hasFile = Array.from(formData.entries()).some(
          ([, v]) => v instanceof File && v.size > 0
        );
        if (hasFile) {
          res = await fetch(`/api/${tab}/${editItem.id}`, { method: "PATCH", body: formData });
        } else {
          const body: Record<string, string> = {};
          formData.forEach((v, k) => {
            if (typeof v === "string") body[k] = v;
          });
          res = await fetch(`/api/${tab}/${editItem.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        }
      }
      const data = await res.json();
      setMsg(data.message || "수정 완료");
      setEditItem(null);
      fetchItems(tab);
    } catch {
      setMsg("오류 발생");
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f1e]">
        <p className="text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f1e]">
        <form
          onSubmit={login}
          className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-[#111827] p-8 shadow-2xl"
        >
          <h1 className="text-center text-2xl font-bold text-white">
            B-CUBE Admin
          </h1>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디"
            className="rounded-lg bg-[#1e293b] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
            className="rounded-lg bg-[#1e293b] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            disabled={loginLoading}
            className="rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginLoading ? "로그인 중..." : "로그인"}
          </button>
          {msg && <p className="text-center text-red-400">{msg}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0f1e] text-white">
      {/* Fixed Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-4">
        <h1 className="text-xl font-bold">B-CUBE Admin</h1>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
          >
            사이트 보기
          </a>
          <button
            onClick={logout}
            className="rounded-lg bg-red-600/20 px-4 py-2 text-sm text-red-400 hover:bg-red-600/30"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Fixed Sidebar */}
        <nav className="w-48 shrink-0 overflow-y-auto border-r border-white/10 p-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setEditItem(null); setShowAdd(false); setMsg(""); }}
              className={`mb-1 w-full rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${
                tab === t.key
                  ? "bg-blue-600/20 font-semibold text-blue-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {msg && (
            <div className="mb-4 rounded-lg bg-blue-600/10 px-4 py-3 text-sm text-blue-300">
              {msg}
              <button onClick={() => setMsg("")} className="float-right text-blue-400 hover:text-white">
                ✕
              </button>
            </div>
          )}

          {/* Edit Modal */}
          {editItem && (
            <div className="mb-6 rounded-xl bg-[#111827] p-6 ring-2 ring-blue-500/50">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-blue-400">수정</h2>
                <button
                  onClick={() => setEditItem(null)}
                  className="rounded-lg px-3 py-1 text-sm text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  취소
                </button>
              </div>
              <form onSubmit={handleEdit} className="grid gap-4 md:grid-cols-2">
                {renderEditFields(tab, editItem)}
                <div className="md:col-span-2">
                  <button
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "수정 중..." : "수정 저장"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Recruit Settings */}
          {!editItem && tab === "contact" && (
            <div className="mb-6 rounded-xl bg-[#111827] p-6">
              <h2 className="mb-4 text-lg font-semibold">모집 설정</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setRecruitSettings((s) => {
                      const next = !s.isRecruiting;
                      const defaults = [
                        "B-CUBE와 함께할 새로운 멤버를 모집하고 있습니다.\n모집 마감: 2025년 3월 15일",
                        "지금은 모집 기간이 아닙니다.\n다음 모집은 2025년 9월에 예정되어 있습니다.",
                      ];
                      const msg = defaults.includes(s.recruitMessage) || !s.recruitMessage
                        ? (next ? defaults[0] : defaults[1])
                        : s.recruitMessage;
                      return { ...s, isRecruiting: next, recruitMessage: msg };
                    })}
                    className={`relative h-7 w-12 rounded-full transition-colors ${recruitSettings.isRecruiting ? "bg-green-500" : "bg-gray-600"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform ${recruitSettings.isRecruiting ? "translate-x-5" : ""}`} />
                  </button>
                  <span className="text-sm text-gray-300">
                    {recruitSettings.isRecruiting ? "모집 중" : "모집 마감"}
                  </span>
                </label>
                <label className="flex flex-col gap-1.5 md:col-span-2">
                  <span className="text-sm text-gray-400">배너 멘트</span>
                  <textarea
                    rows={3}
                    value={recruitSettings.recruitMessage}
                    onChange={(e) => setRecruitSettings((s) => ({ ...s, recruitMessage: e.target.value }))}
                    className="rounded-lg bg-[#1e293b] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                {recruitSettings.isRecruiting && (
                  <label className="flex flex-col gap-1.5 md:col-span-2">
                    <span className="text-sm text-gray-400">지원 링크 (Google Form 등)</span>
                    <input
                      type="url"
                      value={recruitSettings.recruitLink}
                      onChange={(e) => setRecruitSettings((s) => ({ ...s, recruitLink: e.target.value }))}
                      placeholder="https://forms.google.com/..."
                      className="rounded-lg bg-[#1e293b] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                )}
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={saveRecruitSettings}
                    disabled={recruitLoading}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {recruitLoading ? "저장 중..." : "모집 설정 저장"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Form */}
          {!editItem && tab === "contact" && (
            <div className="mb-6 rounded-xl bg-[#111827] p-6">
              <h2 className="mb-4 text-lg font-semibold">연락처 수정</h2>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                {renderContactForm(items[0])}
                <div className="md:col-span-2">
                  <button
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "처리 중..." : "저장"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!editItem && tab !== "contact" && !showAdd && (
            <div className="mb-6">
              <button
                onClick={() => setShowAdd(true)}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                + {TABS.find((t) => t.key === tab)?.label} 추가
              </button>
            </div>
          )}

          {!editItem && tab !== "contact" && showAdd && (
            <div className="mb-6 rounded-xl bg-[#111827] p-6 ring-2 ring-green-500/30">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-green-400">
                  {TABS.find((t) => t.key === tab)?.label} 추가
                </h2>
                <button
                  onClick={() => setShowAdd(false)}
                  className="rounded-lg px-3 py-1 text-sm text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  취소
                </button>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                {renderFields(tab)}
                <div className="md:col-span-2">
                  <button
                    disabled={loading}
                    className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? "업로드 중..." : "저장"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Items List */}
          {tab !== "contact" && !editItem && (
            <div className="rounded-xl bg-[#111827] p-6">
              <h2 className="mb-4 text-lg font-semibold">
                등록된 항목 ({items.length})
              </h2>
              <div className="grid gap-3">
                {items.map((item) => (
                  <div
                    key={String(item.id)}
                    className="flex items-center justify-between rounded-lg bg-[#1e293b] p-4"
                  >
                    <div className="flex items-center gap-4">
                      {typeof item.imagePath === "string" && item.imagePath && (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={item.imagePath}
                            alt={String(item.title || item.name || "")}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {String(item.title || item.name || item.description || "")}
                        </p>
                        <p className="text-sm text-gray-400">
                          {String(item.year || item.date || item.role || "")}
                          {typeof item.participant === "string" &&
                            item.participant &&
                            ` · ${item.participant}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditItem(item)}
                        className="rounded-lg px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-600/20"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteItem(String(item.id))}
                        className="rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-red-600/20"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-center text-gray-500">
                    등록된 항목이 없습니다
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─── Field Components ─── */

function Input({
  name,
  label,
  type = "text",
  required = true,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-gray-400">{label}</span>
      {type === "textarea" ? (
        <textarea
          name={name}
          required={required}
          defaultValue={defaultValue}
          rows={3}
          className="rounded-lg bg-[#1e293b] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
          accept={type === "file" ? "image/*,.pdf,.svg" : undefined}
          className="rounded-lg bg-[#1e293b] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:text-white"
        />
      )}
    </label>
  );
}

function renderFields(tab: Tab) {
  switch (tab) {
    case "designton":
    case "etc":
      return (
        <>
          <Input name="title" label="제목" />
          <Input name="year" label="연도" />
          <Input name="participant" label="참가자" required={false} />
          <Input name="award" label="수상" required={false} />
          <Input name="imagePath" label="이미지" type="file" />
          <Input name="pdfPath" label="PDF" type="file" />
        </>
      );
    case "sexyit":
      return (
        <>
          <Input name="title" label="제목" />
          <Input name="date" label="날짜" type="date" />
          <Input name="url" label="인스타그램 URL" required={false} />
          <Input name="imagePath" label="이미지" type="file" />
        </>
      );
    case "study":
      return (
        <>
          <Input name="title" label="제목" />
          <Input name="year" label="연도" />
          <Input name="imagePath" label="이미지" type="file" />
        </>
      );
    case "activities":
      return (
        <>
          <Input name="title" label="제목" />
          <Input name="description" label="설명" type="textarea" />
          <Input name="imagePath" label="이미지" type="file" />
          <Input name="pdfPath" label="PDF" type="file" />
        </>
      );
    case "interview":
      return (
        <>
          <Input name="name" label="이름" />
          <Input name="studentId" label="학번" type="number" />
          <Input name="introduction" label="소개" type="textarea" />
          <Input name="imagePath" label="프로필 이미지" type="file" />
        </>
      );
    case "executives":
      return (
        <>
          <Input name="name" label="이름" />
          <Input name="role" label="직책" />
          <Input name="studentId" label="학번" type="number" />
          <Input name="imagePath" label="프로필 이미지" type="file" />
        </>
      );
    case "photo":
      return (
        <>
          <Input name="description" label="설명" />
          <Input name="date" label="날짜" type="date" />
          <Input name="imagePath" label="이미지" type="file" />
        </>
      );
    default:
      return null;
  }
}

function renderContactForm(item?: Item) {
  return (
    <>
      <Input name="email" label="이메일" type="email" defaultValue={item ? String(item.email || "") : ""} />
      <Input name="kakaotalkLink" label="카카오톡 링크" defaultValue={item ? String(item.kakaotalkLink || "") : ""} />
      <Input name="instagramLink" label="인스타그램 링크" defaultValue={item ? String(item.instagramLink || "") : ""} />
    </>
  );
}

function renderEditFields(tab: Tab, item: Item) {
  const v = (key: string) => String(item[key] || "");

  switch (tab) {
    case "designton":
    case "etc":
      return (
        <>
          <Input name="title" label="제목" defaultValue={v("title")} />
          <Input name="year" label="연도" defaultValue={v("year")} />
          <Input name="participant" label="참가자" required={false} defaultValue={v("participant")} />
          <Input name="award" label="수상" required={false} defaultValue={v("award")} />
          <Input name="imagePath" label="이미지 (변경 시에만)" type="file" required={false} />
          <Input name="pdfPath" label="PDF (변경 시에만)" type="file" required={false} />
        </>
      );
    case "sexyit":
      return (
        <>
          <Input name="title" label="제목" defaultValue={v("title")} />
          <Input name="date" label="날짜" type="date" defaultValue={v("date")?.split("T")[0]} />
          <Input name="url" label="인스타그램 URL" required={false} defaultValue={v("url")} />
          <Input name="imagePath" label="이미지 (변경 시에만)" type="file" required={false} />
        </>
      );
    case "study":
      return (
        <>
          <Input name="title" label="제목" defaultValue={v("title")} />
          <Input name="year" label="연도" defaultValue={v("year")} />
          <Input name="imagePath" label="이미지 (변경 시에만)" type="file" required={false} />
        </>
      );
    case "activities":
      return (
        <>
          <Input name="title" label="제목" defaultValue={v("title")} />
          <Input name="description" label="설명" type="textarea" defaultValue={v("description")} />
          <Input name="imagePath" label="이미지 (변경 시에만)" type="file" required={false} />
          <Input name="pdfPath" label="PDF (변경 시에만)" type="file" required={false} />
        </>
      );
    case "interview":
      return (
        <>
          <Input name="name" label="이름" defaultValue={v("name")} />
          <Input name="studentId" label="학번" type="number" defaultValue={v("studentId")} />
          <Input name="introduction" label="소개" type="textarea" defaultValue={v("introduction")} />
          <Input name="imagePath" label="프로필 이미지 (변경 시에만)" type="file" required={false} />
        </>
      );
    case "executives":
      return (
        <>
          <Input name="name" label="이름" defaultValue={v("name")} />
          <Input name="role" label="직책" defaultValue={v("role")} />
          <Input name="studentId" label="학번" type="number" defaultValue={v("studentId")} />
          <Input name="imagePath" label="프로필 이미지 (변경 시에만)" type="file" required={false} />
        </>
      );
    case "photo":
      return (
        <>
          <Input name="description" label="설명" defaultValue={v("description")} />
          <Input name="date" label="날짜" type="date" defaultValue={v("date")?.split("T")[0]} />
          <Input name="imagePath" label="이미지 (변경 시에만)" type="file" required={false} />
        </>
      );
    default:
      return null;
  }
}
