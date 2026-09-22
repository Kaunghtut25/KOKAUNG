"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import { useClientRole } from "@/lib/useClientRole";

interface TeamDepartment {
  _id?: string; id?: string;
  nameEn: string; nameMm: string;
  sortOrder: number;
}

interface TeamMember {
  _id?: string; id?: string;
  departmentId: string;
  nameEn: string; nameMm: string;
  positionEn: string; positionMm: string;
  photoUrl: string;
  linkedinUrl: string;
  sortOrder: number;
  active: boolean;
}

function emptyDept(): TeamDepartment {
  return { nameEn: "", nameMm: "", sortOrder: 0 };
}
function emptyMember(deptId = ""): TeamMember {
  return { departmentId: deptId, nameEn: "", nameMm: "", positionEn: "", positionMm: "", photoUrl: "", linkedinUrl: "", sortOrder: 0, active: true };
}

export default function AdminTeamPage() {
  const isViewer = useClientRole() === "viewer";
  const { t, lang } = useI18n();
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const [departments, setDepartments] = useState<TeamDepartment[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [mode, setMode] = useState<"dept" | "member">("dept");
  const [editing, setEditing] = useState<TeamDepartment | TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [activeDeptTab, setActiveDeptTab] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setDepartments(Array.isArray(data.departments) ? data.departments : []);
      setMembers(Array.isArray(data.members) ? data.members : []);
      if (!activeDeptTab && data.departments?.length) setActiveDeptTab(data.departments[0].id || data.departments[0]._id || "");
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const openNewDept = () => { setMode("dept"); setEditing({ ...emptyDept() }); setModal(true); };
  const openEditDept = (d: TeamDepartment) => { setMode("dept"); setEditing({ ...d }); setModal(true); };
  const openNewMember = (deptId: string) => { setMode("member"); setEditing({ ...emptyMember(deptId) }); setModal(true); };
  const openEditMember = (m: TeamMember) => { setMode("member"); setEditing({ ...m }); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const isDept = mode === "dept";
      const collection = isDept ? "team_departments" : "team_members";
      const typeParam = isDept ? "department" : "member";
      const id = (editing as any)._id || (editing as any).id;
      const url = id ? `/api/team?id=${id}&type=${typeParam}` : `/api/team`;
      const method = id ? "PUT" : "POST";
      const body = isDept
        ? (() => { const d = editing as TeamDepartment; return { type: typeParam, nameEn: d.nameEn, nameMm: d.nameMm, sortOrder: d.sortOrder }; })()
        : (() => { const m = editing as TeamMember; return { type: typeParam, departmentId: m.departmentId, nameEn: m.nameEn, nameMm: m.nameMm, positionEn: m.positionEn, positionMm: m.positionMm, photoUrl: m.photoUrl, linkedinUrl: m.linkedinUrl, sortOrder: m.sortOrder, active: m.active }; })();
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      if (res.ok) { await load(); closeModal(); }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const del = async (id: string, type: "department" | "member") => {
    const msg = type === "department" ? t("admin.team.confirmDelDept") : t("admin.team.confirmDelMember");
    if (!confirm(msg)) return;
    try {
      await fetch(`/api/team?id=${id}&type=${type}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      await load();
    } catch (e) { console.error(e); }
  };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) { setUploadMsg(t("admin.common.imgOnly")); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadMsg(t("admin.dest.dropDims")); return; }
    setUploading(true); setUploadMsg("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      const url = data?.uploads?.[0]?.url;
      if (!url) { setUploadMsg(t("admin.common.uploadFailed")); return; }
      if (editing && mode === "member") setEditing({ ...(editing as TeamMember), photoUrl: url });
      setUploadMsg(t("admin.dest.dropDone"));
    } catch (e) { console.error(e); setUploadMsg(t("admin.common.uploadFailed")); }
    setUploading(false);
  };

  const onDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) uploadImage(f); };

  const deptMembers = (deptId: string) => members.filter(m => m.departmentId === deptId).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const sortedDepts = [...departments].sort((a,b) => (a.sortOrder||0) - (b.sortOrder||0));

  if (loading) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-white/60 text-lg">{t("admin.dest.loading")}</div></div>;

  return (
    <div className="min-h-screen bg-[#0A1628] p-6">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {t("admin.team.title")}
          </h1>
        </div>
        {!isViewer && (
          <button onClick={openNewDept} className="px-5 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all flex items-center gap-2">
            <span>👥</span> {t("admin.team.addDept")}
          </button>
        )}
      </div>

      {/* ─── Department Tabs + Content ─── */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-white/10 p-4 flex flex-wrap gap-2 overflow-x-auto">
          {sortedDepts.length === 0 ? (
            <span className="text-white/50 text-sm">{t("admin.team.empty")}</span>
          ) : (
            sortedDepts.map(d => {
              const id = d.id || d._id || "";
              const isActive = activeDeptTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveDeptTab(id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#D4AF37] text-deepblue-dark shadow-lg"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {lang === "mm" ? d.nameMm : d.nameEn}
                </button>
              );
            })
          )}
        </div>

        {/* Department Content */}
        {activeDeptTab && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{lang === "mm" ? departments.find(d => (d.id||d._id)===activeDeptTab)?.nameMm : departments.find(d => (d.id||d._id)===activeDeptTab)?.nameEn}</h2>
              {!isViewer && (
                <button onClick={() => openNewMember(activeDeptTab || "")} className="px-4 py-2 rounded-lg bg-gold/10 text-gold text-sm font-medium hover:bg-gold/20 transition-colors flex items-center gap-2">
                  <span>+</span> {t("admin.team.addMember")}
                </button>
              )}
            </div>

            {/* Members Table (zoom-safe) */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.team.thPhoto")}</th>
                    <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.team.thName")}</th>
                    <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.team.thPosition")}</th>
                    <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.team.thSort")}</th>
                    <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.team.thActions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {deptMembers(activeDeptTab).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-white/50">
                        <span className="text-3xl block mb-2">👤</span>
                        {t("admin.team.empty").replace("departments", "members").replace("Department", "Member")}
                      </td>
                    </tr>
                  ) : (
                    deptMembers(activeDeptTab).map((m: any) => (
                      <tr key={m.id || m._id} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                        <td className="p-4">
                          <div className="w-12 h-12 rounded-lg border border-white/10 bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {m.photoUrl ? (
                              <Image alt={lang === "mm" ? m.nameMm : m.nameEn} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} src={m.photoUrl} width={48} height={48} sizes="48px" />
                            ) : <span className="text-white/20 text-lg">👤</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-white font-medium block">{lang === "mm" ? m.nameMm : m.nameEn}</span>
                          {m.linkedinUrl && (
                            <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline">LinkedIn</a>
                          )}
                        </td>
                        <td className="p-4 text-white/70 text-sm">{lang === "mm" ? m.positionMm : m.positionEn}</td>
                        <td className="p-4 text-white/60">{m.sortOrder}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {!isViewer && (<>
                              <button onClick={() => openEditMember(m)} className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors">{t("admin.common.edit")}</button>
                              <button onClick={() => del(m.id || m._id || "", "member")} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">{t("admin.common.delete")}</button>
                            </>)}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Departments Table (when no tab selected or for overview) */}
        {sortedDepts.length > 0 && !activeDeptTab && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.team.thDept")}</th>
                    <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.team.thMembers")}</th>
                    <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.team.thSort")}</th>
                    <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.team.thActions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDepts.map((d: any) => {
                    const mems = deptMembers(d.id || d._id || "");
                    return (
                      <tr key={d.id || d._id} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer" onClick={() => setActiveDeptTab(d.id || d._id || "")}>
                        <td className="p-4">
                          <span className="text-white font-medium">{lang === "mm" ? d.nameMm : d.nameEn}</span>
                        </td>
                        <td className="p-4 text-white/70">{mems.length} {t("admin.team.thMembers")}</td>
                        <td className="p-4 text-white/60">{d.sortOrder}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {!isViewer && (<>
                              <button onClick={(e)=>{e.stopPropagation();openEditDept(d)}} className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors">{t("admin.common.edit")}</button>
                              <button onClick={(e)=>{e.stopPropagation();del(d.id || d._id || "", "department")}} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">{t("admin.common.delete")}</button>
                            </>)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ─── Add/Edit Modal ─── */}
      {modal && editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1E35] border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-white font-semibold mb-4">
              {mode === "dept" ? ((editing as TeamDepartment)._id || (editing as TeamDepartment).id ? t("admin.team.editDept") : t("admin.team.newDept")) : ((editing as TeamMember)._id || (editing as TeamMember).id ? t("admin.team.editMember") : t("admin.team.newMember"))}
            </h2>
            <div className="space-y-3">
              {mode === "dept" ? (
                <>
                  <div>
                    <label className="text-white/60 text-xs block mb-1">{t("admin.team.deptNameEn")}</label>
                    <input type="text" className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={(editing as TeamDepartment).nameEn} onChange={e => setEditing({ ...editing, nameEn: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs block mb-1">{t("admin.team.deptNameMm")}</label>
                    <input type="text" className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={(editing as TeamDepartment).nameMm} onChange={e => setEditing({ ...editing, nameMm: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs block mb-1">{t("admin.team.deptSort")}</label>
                    <input type="number" className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={(editing as TeamDepartment).sortOrder} onChange={e => setEditing({ ...editing, sortOrder: Number(e.target.value) })} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-white/60 text-xs block mb-1">{t("admin.team.fNameEn")}</label>
                    <input type="text" className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={(editing as TeamMember).nameEn} onChange={e => setEditing({ ...editing, nameEn: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs block mb-1">{t("admin.team.fNameMm")}</label>
                    <input type="text" className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={(editing as TeamMember).nameMm} onChange={e => setEditing({ ...editing, nameMm: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs block mb-1">{t("admin.team.fPositionEn")}</label>
                    <input type="text" className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={(editing as TeamMember).positionEn} onChange={e => setEditing({ ...editing, positionEn: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs block mb-1">{t("admin.team.fPositionMm")}</label>
                    <input type="text" className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={(editing as TeamMember).positionMm} onChange={e => setEditing({ ...editing, positionMm: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs block mb-1">{t("admin.team.fPhoto")}</label>
                    <div onDragOver={e => e.preventDefault()} onDrop={onDrop} className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${uploading ? "border-blue-400 bg-blue-500/10" : "border-white/10 hover:border-gold/50"}`}>
                      <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} className="hidden" id="member-photo-upload" />
                      <label htmlFor="member-photo-upload" className="cursor-pointer block">
                        <div className="text-white/60 text-sm mb-1">{uploading ? t("admin.dest.dropUploading") : t("admin.dest.dropHint")}</div>
                        <div className="text-white/40 text-xs">{t("admin.dest.dropDims")}</div>
                        {(editing as TeamMember).photoUrl && !uploading && (
                          <div className="mt-2 flex justify-center gap-2">
                            <Image alt="" src={(editing as TeamMember).photoUrl} width={80} height={80} className="rounded-lg object-cover" />
                            <div className="flex flex-col gap-1">
                              <button type="button" onClick={() => setEditing({ ...(editing as TeamMember), photoUrl: "" })} className="text-xs text-red-400 hover:underline">{t("admin.dest.dropRemove")}</button>
                              <button type="button" onClick={() => document.getElementById("member-photo-upload")?.click()} className="text-xs text-gold hover:underline">{t("admin.dest.dropReplace")}</button>
                            </div>
                          </div>
                        )}
                      </label>
                      {uploadMsg && <div className="mt-2 text-xs text-center">{uploadMsg}</div>}
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs block mb-1">{t("admin.team.fLinkedin")}</label>
                    <input type="url" className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={(editing as TeamMember).linkedinUrl} onChange={e => setEditing({ ...editing, linkedinUrl: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs block mb-1">{t("admin.team.fSortOrder")}</label>
                    <input type="number" className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={(editing as TeamMember).sortOrder} onChange={e => setEditing({ ...editing, sortOrder: Number(e.target.value) })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="member-active" className="w-4 h-4 accent-gold" checked={(editing as TeamMember).active} onChange={e => setEditing({ ...editing, active: e.target.checked })} />
                    <label htmlFor="member-active" className="text-white/80 text-sm">{t("admin.team.fActive")}</label>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button onClick={closeModal} className={btnGhost}>{t("admin.common.cancel")}</button>
                <button onClick={save} disabled={saving} className={btnGold}>{saving ? t("admin.common.saving") : t("admin.common.save")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors";
const labelCls = "block text-white/60 text-xs font-medium mb-1 uppercase tracking-wider";
const cardCls = "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6";
const btnGold = "px-4 py-2 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all";
const btnGhost = "px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm hover:border-white/25 transition-all";