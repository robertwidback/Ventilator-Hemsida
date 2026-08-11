import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, LogOut, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "./Nyheter";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "vent_admin_token";

const emptyForm = { title: "", preamble: "", body: "", image_url: "", date: "", published: true };

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [posts, setPosts] = useState(null);
  const [editing, setEditing] = useState(null); // null = list, "new" or post id = form
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const authHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const loadPosts = () => {
    axios
      .get(`${API}/admin/news`, authHeaders())
      .then((res) => setPosts(res.data))
      .catch(() => {
        setToken("");
        localStorage.removeItem(TOKEN_KEY);
      });
  };

  useEffect(() => {
    if (token) loadPosts();
  }, [token]);

  const login = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem(TOKEN_KEY, res.data.token);
      setToken(res.data.token);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setLoginError(typeof detail === "string" ? detail : "Inloggningen misslyckades");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setPosts(null);
    setEditing(null);
  };

  const startNew = () => {
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setEditing("new");
  };

  const startEdit = (post) => {
    setForm({
      title: post.title,
      preamble: post.preamble,
      body: post.body,
      image_url: post.image_url || "",
      date: post.date,
      published: post.published,
    });
    setEditing(post.id);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") {
        await axios.post(`${API}/admin/news`, form, authHeaders());
        toast.success("Nyheten är publicerad!");
      } else {
        await axios.put(`${API}/admin/news/${editing}`, form, authHeaders());
        toast.success("Nyheten är uppdaterad!");
      }
      setEditing(null);
      loadPosts();
    } catch {
      toast.error("Kunde inte spara. Kontrollera fälten och försök igen.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (post) => {
    if (!window.confirm(`Ta bort "${post.title}"? Det går inte att ångra.`)) return;
    try {
      await axios.delete(`${API}/admin/news/${post.id}`, authHeaders());
      toast.success("Nyheten är borttagen.");
      loadPosts();
    } catch {
      toast.error("Kunde inte ta bort nyheten.");
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-vent-ice px-6" data-testid="admin-login-page">
        <div className="w-full max-w-md bg-white p-10 shadow-sm ring-1 ring-vent-navy/10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-vent-navy">Logga in</h1>
          <p className="mt-2 text-sm text-vent-navy/60">Hantera nyheter på ventilator.se</p>
          <form onSubmit={login} className="mt-8 space-y-5" data-testid="admin-login-form">
            <div>
              <label htmlFor="admin-email" className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60">E-post</label>
              <Input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="admin-email-input"
                className="h-12 rounded-none border-vent-navy/20 focus-visible:ring-vent-blue"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60">Lösenord</label>
              <Input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="admin-password-input"
                className="h-12 rounded-none border-vent-navy/20 focus-visible:ring-vent-blue"
              />
            </div>
            {loginError && (
              <p className="bg-red-50 px-4 py-3 text-sm text-red-700" data-testid="admin-login-error">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              data-testid="admin-login-button"
              className="inline-flex w-full items-center justify-center gap-2 bg-vent-blue px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-vent-navy disabled:opacity-60"
            >
              {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : "Logga in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vent-ice" data-testid="admin-dashboard">
      <div className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-vent-navy" data-testid="admin-heading">Nyheter</h1>
            <p className="mt-1 text-sm text-vent-navy/60">Lägg till, ändra eller ta bort nyheter på webbplatsen.</p>
          </div>
          <div className="flex gap-3">
            {editing === null && (
              <button
                onClick={startNew}
                data-testid="admin-new-post-button"
                className="inline-flex items-center gap-2 bg-vent-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-vent-navy"
              >
                <Plus className="h-4 w-4" /> Ny nyhet
              </button>
            )}
            <button
              onClick={logout}
              data-testid="admin-logout-button"
              className="inline-flex items-center gap-2 border border-vent-navy/20 px-5 py-3 text-sm font-semibold text-vent-navy transition-colors hover:bg-white"
            >
              <LogOut className="h-4 w-4" /> Logga ut
            </button>
          </div>
        </div>

        {editing !== null ? (
          <form onSubmit={save} className="mt-10 space-y-6 bg-white p-8 shadow-sm ring-1 ring-vent-navy/10 lg:p-12" data-testid="admin-post-form">
            <h2 className="font-display text-2xl font-bold text-vent-navy">
              {editing === "new" ? "Ny nyhet" : "Redigera nyhet"}
            </h2>
            <div>
              <label htmlFor="post-title" className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60">Rubrik *</label>
              <Input id="post-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="post-title-input" className="h-12 rounded-none border-vent-navy/20 focus-visible:ring-vent-blue" placeholder="T.ex. Nytt uppdrag i Stockholm!" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="post-date" className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60">Datum</label>
                <Input id="post-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} data-testid="post-date-input" className="h-12 rounded-none border-vent-navy/20 focus-visible:ring-vent-blue" />
              </div>
              <div>
                <label htmlFor="post-image" className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60">Bild-URL (valfritt)</label>
                <Input id="post-image" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} data-testid="post-image-input" className="h-12 rounded-none border-vent-navy/20 focus-visible:ring-vent-blue" placeholder="https://…" />
              </div>
            </div>
            <div>
              <label htmlFor="post-preamble" className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60">Ingress</label>
              <Textarea id="post-preamble" rows={2} value={form.preamble} onChange={(e) => setForm({ ...form, preamble: e.target.value })} data-testid="post-preamble-input" className="rounded-none border-vent-navy/20 focus-visible:ring-vent-blue" placeholder="Kort sammanfattning som visas i nyhetslistan" />
            </div>
            <div>
              <label htmlFor="post-body" className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60">Brödtext *</label>
              <Textarea id="post-body" required rows={10} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} data-testid="post-body-input" className="rounded-none border-vent-navy/20 focus-visible:ring-vent-blue" placeholder="Skriv nyhetstexten här. Tom rad skapar nytt stycke." />
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-vent-navy" data-testid="post-published-toggle">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-5 w-5 accent-vent-blue"
              />
              Publicerad (synlig på webbplatsen)
            </label>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} data-testid="post-save-button" className="inline-flex items-center gap-2 bg-vent-blue px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-vent-navy disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Spara"}
              </button>
              <button type="button" onClick={() => setEditing(null)} data-testid="post-cancel-button" className="border border-vent-navy/20 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-vent-navy transition-colors hover:bg-vent-ice">
                Avbryt
              </button>
            </div>
          </form>
        ) : posts === null ? (
          <div className="flex justify-center py-20" data-testid="admin-loading">
            <Loader2 className="h-8 w-8 animate-spin text-vent-blue" />
          </div>
        ) : (
          <div className="mt-10 space-y-4" data-testid="admin-posts-list">
            {posts.length === 0 && <p className="py-10 text-center text-vent-navy/60">Inga nyheter ännu. Skapa din första!</p>}
            {posts.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-4 bg-white p-6 shadow-sm ring-1 ring-vent-navy/10" data-testid={`admin-post-row-${p.id}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate font-display text-lg font-bold text-vent-navy">{p.title}</h3>
                    {p.published ? (
                      <span className="inline-flex items-center gap-1 bg-vent-green/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-vent-green"><Eye className="h-3 w-3" /> Publicerad</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-vent-navy/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-vent-navy/50"><EyeOff className="h-3 w-3" /> Utkast</span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-xs text-vent-navy/50">{formatDate(p.date)}</p>
                </div>
                <button onClick={() => startEdit(p)} data-testid={`admin-edit-${p.id}`} className="inline-flex items-center gap-2 border border-vent-navy/20 px-4 py-2.5 text-sm font-semibold text-vent-navy transition-colors hover:bg-vent-ice">
                  <Pencil className="h-4 w-4" /> Ändra
                </button>
                <button onClick={() => remove(p)} data-testid={`admin-delete-${p.id}`} className="inline-flex items-center gap-2 border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
                  <Trash2 className="h-4 w-4" /> Ta bort
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
