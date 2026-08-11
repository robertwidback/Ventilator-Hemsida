import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "./Nyheter";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const emptyJob = { title: "", category: "", location: "Stockholm", employment_type: "Heltid", preamble: "", body: "", date: "", published: true };

export const AdminJobs = ({ token, onAuthFail }) => {
  const [jobs, setJobs] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyJob);
  const [saving, setSaving] = useState(false);

  const authHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const loadJobs = () => {
    axios
      .get(`${API}/admin/jobs`, authHeaders())
      .then((res) => setJobs(res.data))
      .catch(() => onAuthFail());
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNew = () => {
    setForm({ ...emptyJob, date: new Date().toISOString().slice(0, 10) });
    setEditing("new");
  };

  const startEdit = (job) => {
    setForm({
      title: job.title,
      category: job.category,
      location: job.location,
      employment_type: job.employment_type,
      preamble: job.preamble,
      body: job.body,
      date: job.date,
      published: job.published,
    });
    setEditing(job.id);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") {
        await axios.post(`${API}/admin/jobs`, form, authHeaders());
        toast.success("Tjänsten är publicerad!");
      } else {
        await axios.put(`${API}/admin/jobs/${editing}`, form, authHeaders());
        toast.success("Tjänsten är uppdaterad!");
      }
      setEditing(null);
      loadJobs();
    } catch {
      toast.error("Kunde inte spara. Kontrollera fälten och försök igen.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (job) => {
    if (!window.confirm(`Ta bort "${job.title}"? Det går inte att ångra.`)) return;
    try {
      await axios.delete(`${API}/admin/jobs/${job.id}`, authHeaders());
      toast.success("Tjänsten är borttagen.");
      loadJobs();
    } catch {
      toast.error("Kunde inte ta bort tjänsten.");
    }
  };

  const fieldCls = "h-12 rounded-none border-vent-navy/20 focus-visible:ring-vent-blue";
  const labelCls = "mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60";

  if (editing !== null) {
    return (
      <form onSubmit={save} className="mt-10 space-y-6 bg-white p-8 shadow-sm ring-1 ring-vent-navy/10 lg:p-12" data-testid="admin-job-form">
        <h2 className="font-display text-2xl font-bold text-vent-navy">
          {editing === "new" ? "Ny tjänst" : "Redigera tjänst"}
        </h2>
        <div>
          <label htmlFor="job-title" className={labelCls}>Titel *</label>
          <Input id="job-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="job-title-input" className={fieldCls} placeholder="T.ex. Servicetekniker" />
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="job-category" className={labelCls}>Kategori</label>
            <Input id="job-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} data-testid="job-category-input" className={fieldCls} placeholder="T.ex. Ventilation" />
          </div>
          <div>
            <label htmlFor="job-location" className={labelCls}>Ort</label>
            <Input id="job-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} data-testid="job-location-input" className={fieldCls} placeholder="Stockholm" />
          </div>
          <div>
            <label htmlFor="job-type" className={labelCls}>Omfattning</label>
            <Input id="job-type" value={form.employment_type} onChange={(e) => setForm({ ...form, employment_type: e.target.value })} data-testid="job-type-input" className={fieldCls} placeholder="Heltid" />
          </div>
        </div>
        <div>
          <label htmlFor="job-date" className={labelCls}>Publiceringsdatum</label>
          <Input id="job-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} data-testid="job-date-input" className={fieldCls} />
        </div>
        <div>
          <label htmlFor="job-preamble" className={labelCls}>Kort beskrivning</label>
          <Textarea id="job-preamble" rows={2} value={form.preamble} onChange={(e) => setForm({ ...form, preamble: e.target.value })} data-testid="job-preamble-input" className="rounded-none border-vent-navy/20 focus-visible:ring-vent-blue" placeholder="Kort sammanfattning som visas i listan" />
        </div>
        <div>
          <label htmlFor="job-body" className={labelCls}>Annonstext *</label>
          <Textarea id="job-body" required rows={12} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} data-testid="job-body-input" className="rounded-none border-vent-navy/20 focus-visible:ring-vent-blue" placeholder="Beskriv rollen, krav och vad ni erbjuder. Tom rad skapar nytt stycke." />
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-vent-navy" data-testid="job-published-toggle">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="h-5 w-5 accent-vent-blue"
          />
          Publicerad (synlig på webbplatsen)
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} data-testid="job-save-button" className="inline-flex items-center gap-2 bg-vent-blue px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-vent-navy disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Spara"}
          </button>
          <button type="button" onClick={() => setEditing(null)} data-testid="job-cancel-button" className="border border-vent-navy/20 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-vent-navy transition-colors hover:bg-vent-ice">
            Avbryt
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-10" data-testid="admin-jobs-section">
      <button
        onClick={startNew}
        data-testid="admin-new-job-button"
        className="inline-flex items-center gap-2 bg-vent-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-vent-navy"
      >
        <Plus className="h-4 w-4" /> Ny tjänst
      </button>
      {jobs === null ? (
        <div className="flex justify-center py-20" data-testid="admin-jobs-loading">
          <Loader2 className="h-8 w-8 animate-spin text-vent-blue" />
        </div>
      ) : (
        <div className="mt-6 space-y-4" data-testid="admin-jobs-list">
          {jobs.length === 0 && <p className="py-10 text-center text-vent-navy/60">Inga tjänster ännu. Skapa din första!</p>}
          {jobs.map((j) => (
            <div key={j.id} className="flex flex-wrap items-center gap-4 bg-white p-6 shadow-sm ring-1 ring-vent-navy/10" data-testid={`admin-job-row-${j.id}`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="truncate font-display text-lg font-bold text-vent-navy">{j.title}</h3>
                  {j.published ? (
                    <span className="inline-flex items-center gap-1 bg-vent-green/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-vent-green"><Eye className="h-3 w-3" /> Publicerad</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-vent-navy/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-vent-navy/50"><EyeOff className="h-3 w-3" /> Utkast</span>
                  )}
                </div>
                <p className="mt-1 font-mono text-xs text-vent-navy/50">
                  {[j.category, j.location, formatDate(j.date)].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button onClick={() => startEdit(j)} data-testid={`admin-edit-job-${j.id}`} className="inline-flex items-center gap-2 border border-vent-navy/20 px-4 py-2.5 text-sm font-semibold text-vent-navy transition-colors hover:bg-vent-ice">
                <Pencil className="h-4 w-4" /> Ändra
              </button>
              <button onClick={() => remove(j)} data-testid={`admin-delete-job-${j.id}`} className="inline-flex items-center gap-2 border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Ta bort
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
