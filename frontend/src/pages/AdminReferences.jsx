import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const emptyRef = { title: "", tag: "", text: "", image_url: "", published: true };

export const AdminReferences = ({ token, onAuthFail }) => {
  const [refs, setRefs] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRef);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const authHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const loadRefs = () => {
    axios
      .get(`${API}/admin/references`, authHeaders())
      .then((res) => setRefs(res.data))
      .catch(() => onAuthFail());
  };

  useEffect(() => {
    loadRefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    try {
      const res = await axios.post(`${API}/admin/upload`, fd, authHeaders());
      setForm((f) => ({ ...f, image_url: res.data.url }));
      toast.success("Bilden är uppladdad!");
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Kunde inte ladda upp bilden.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") {
        await axios.post(`${API}/admin/references`, form, authHeaders());
        toast.success("Referensen är publicerad!");
      } else {
        await axios.put(`${API}/admin/references/${editing}`, form, authHeaders());
        toast.success("Referensen är uppdaterad!");
      }
      setEditing(null);
      loadRefs();
    } catch {
      toast.error("Kunde inte spara. Kontrollera fälten och försök igen.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (ref) => {
    if (!window.confirm(`Ta bort "${ref.title}"? Det går inte att ångra.`)) return;
    try {
      await axios.delete(`${API}/admin/references/${ref.id}`, authHeaders());
      toast.success("Referensen är borttagen.");
      loadRefs();
    } catch {
      toast.error("Kunde inte ta bort referensen.");
    }
  };

  const fieldCls = "h-12 rounded-none border-vent-navy/20 focus-visible:ring-vent-blue";
  const labelCls = "mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60";

  if (editing !== null) {
    return (
      <form onSubmit={save} className="mt-10 space-y-6 bg-white p-8 shadow-sm ring-1 ring-vent-navy/10 lg:p-12" data-testid="admin-reference-form">
        <h2 className="font-display text-2xl font-bold text-vent-navy">
          {editing === "new" ? "Nytt referensprojekt" : "Redigera referensprojekt"}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="ref-title" className={labelCls}>Projektnamn *</label>
            <Input id="ref-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="ref-title-input" className={fieldCls} placeholder="T.ex. Kv. Enzymet, Hagastaden" />
          </div>
          <div>
            <label htmlFor="ref-tag" className={labelCls}>Kategori</label>
            <Input id="ref-tag" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} data-testid="ref-tag-input" className={fieldCls} placeholder="T.ex. Bostäder, Skola, Kommersiellt" />
          </div>
        </div>
        <div>
          <label htmlFor="ref-image" className={labelCls}>Bild</label>
          <div className="flex gap-3">
            <Input id="ref-image" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} data-testid="ref-image-input" className={fieldCls} placeholder="Klistra in URL eller ladda upp" />
            <label
              data-testid="ref-image-upload-button"
              className={`inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 border border-vent-navy/20 px-4 text-sm font-semibold text-vent-navy transition-colors hover:bg-vent-ice ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Ladda upp
              <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={uploadImage} data-testid="ref-image-file-input" />
            </label>
          </div>
          {form.image_url && (
            <img src={form.image_url} alt="Förhandsvisning" className="mt-3 h-24 w-auto object-cover ring-1 ring-vent-navy/10" data-testid="ref-image-preview" />
          )}
        </div>
        <div>
          <label htmlFor="ref-text" className={labelCls}>Beskrivning *</label>
          <Textarea id="ref-text" required rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} data-testid="ref-text-input" className="rounded-none border-vent-navy/20 focus-visible:ring-vent-blue" placeholder="Beskriv projektet och Ventilators uppdrag" />
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-vent-navy" data-testid="ref-published-toggle">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="h-5 w-5 accent-vent-blue"
          />
          Publicerad (synlig på webbplatsen)
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} data-testid="ref-save-button" className="inline-flex items-center gap-2 bg-vent-blue px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-vent-navy disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Spara"}
          </button>
          <button type="button" onClick={() => setEditing(null)} data-testid="ref-cancel-button" className="border border-vent-navy/20 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-vent-navy transition-colors hover:bg-vent-ice">
            Avbryt
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-10" data-testid="admin-references-section">
      <button
        onClick={() => { setForm(emptyRef); setEditing("new"); }}
        data-testid="admin-new-reference-button"
        className="inline-flex items-center gap-2 bg-vent-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-vent-navy"
      >
        <Plus className="h-4 w-4" /> Nytt referensprojekt
      </button>
      {refs === null ? (
        <div className="flex justify-center py-20" data-testid="admin-references-loading">
          <Loader2 className="h-8 w-8 animate-spin text-vent-blue" />
        </div>
      ) : (
        <div className="mt-6 space-y-4" data-testid="admin-references-list">
          {refs.length === 0 && <p className="py-10 text-center text-vent-navy/60">Inga referensprojekt ännu. Skapa ditt första!</p>}
          {refs.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-4 bg-white p-6 shadow-sm ring-1 ring-vent-navy/10" data-testid={`admin-reference-row-${r.id}`}>
              {r.image_url && <img src={r.image_url} alt="" className="h-14 w-20 shrink-0 object-cover ring-1 ring-vent-navy/10" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="truncate font-display text-lg font-bold text-vent-navy">{r.title}</h3>
                  {r.published ? (
                    <span className="inline-flex items-center gap-1 bg-vent-green/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-vent-green"><Eye className="h-3 w-3" /> Publicerad</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-vent-navy/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-vent-navy/50"><EyeOff className="h-3 w-3" /> Utkast</span>
                  )}
                </div>
                {r.tag && <p className="mt-1 font-mono text-xs text-vent-navy/50">{r.tag}</p>}
              </div>
              <button onClick={() => { setForm({ title: r.title, tag: r.tag, text: r.text, image_url: r.image_url || "", published: r.published }); setEditing(r.id); }} data-testid={`admin-edit-reference-${r.id}`} className="inline-flex items-center gap-2 border border-vent-navy/20 px-4 py-2.5 text-sm font-semibold text-vent-navy transition-colors hover:bg-vent-ice">
                <Pencil className="h-4 w-4" /> Ändra
              </button>
              <button onClick={() => remove(r)} data-testid={`admin-delete-reference-${r.id}`} className="inline-flex items-center gap-2 border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Ta bort
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
