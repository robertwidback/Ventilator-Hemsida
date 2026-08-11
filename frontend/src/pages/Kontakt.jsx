import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpRight, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { Reveal, MaskedLine } from "@/components/Reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PEOPLE = [
  { name: "Robert Widbäck", role: "VD", phone: "070-233 07 55", email: "robert.widback@ventilator.se" },
  { name: "Oscar Bojnäs", role: "Servicechef", phone: "076-885 20 30", email: "oscar.bojnas@ventilator.se" },
];

export default function Kontakt() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Tack för ditt meddelande! Vi återkommer så snart vi kan.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Något gick fel. Försök igen eller ring oss på 08-681 14 40.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="kontakt-page">
      {/* HERO */}
      <section className="grain relative flex min-h-[60svh] items-end overflow-hidden bg-vent-dark" data-testid="kontakt-hero">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-44 lg:px-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-vent-green">Kontakt</p>
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tighter text-white sm:text-7xl lg:text-8xl" data-testid="kontakt-heading">
            <MaskedLine delay={0.15}>Kontakta oss</MaskedLine>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40" data-testid="kontakt-content">
        <div className="grid gap-20 lg:grid-cols-2">
          {/* FORM */}
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-vent-navy sm:text-4xl">Skicka ett meddelande</h2>
            <p className="mt-4 text-base text-vent-navy/70">Fyll i formuläret så återkommer vi till dig så snart som möjligt.</p>
            <form onSubmit={submit} className="mt-10 space-y-6" data-testid="contact-form">
              <div>
                <label htmlFor="name" className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60">Namn *</label>
                <Input
                  id="name"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={update("name")}
                  data-testid="contact-name-input"
                  className="h-12 rounded-none border-vent-navy/20 bg-white focus-visible:ring-vent-blue"
                  placeholder="Ditt namn"
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60">E-post *</label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    data-testid="contact-email-input"
                    className="h-12 rounded-none border-vent-navy/20 bg-white focus-visible:ring-vent-blue"
                    placeholder="namn@foretag.se"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60">Telefon</label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    data-testid="contact-phone-input"
                    className="h-12 rounded-none border-vent-navy/20 bg-white focus-visible:ring-vent-blue"
                    placeholder="070-123 45 67"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-vent-navy/60">Meddelande *</label>
                <Textarea
                  id="message"
                  required
                  minLength={5}
                  rows={6}
                  value={form.message}
                  onChange={update("message")}
                  data-testid="contact-message-input"
                  className="rounded-none border-vent-navy/20 bg-white focus-visible:ring-vent-blue"
                  placeholder="Berätta om ditt projekt eller din fråga"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                data-testid="contact-submit-button"
                className="group inline-flex items-center gap-2 bg-vent-blue px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-vent-navy disabled:opacity-60"
              >
                {sending ? (
                  <>
                    Skickar…
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Skicka
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </form>
          </Reveal>

          {/* INFO */}
          <div className="space-y-16">
            <Reveal delay={0.1}>
              <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-vent-blue">Här finns vi</h2>
              <div className="mt-6 space-y-5 text-base text-vent-navy/80" data-testid="contact-info">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-vent-green" />
                  <span>
                    Ventilator<br />
                    Lövholmsvägen 9<br />
                    100 74 Stockholm
                  </span>
                </p>
                <a href="tel:086811440" data-testid="contact-phone-link" className="flex items-center gap-3 transition-colors hover:text-vent-blue">
                  <Phone className="h-4 w-4 text-vent-green" /> 08-681 14 40
                </a>
                <a href="mailto:info@ventilator.se" data-testid="contact-email-link" className="flex items-center gap-3 transition-colors hover:text-vent-blue">
                  <Mail className="h-4 w-4 text-vent-green" /> info@ventilator.se
                </a>
                <p className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-vent-green" />
                  <span>
                    Förfrågningar ventilation:{" "}
                    <a href="mailto:service@ventilator.se" data-testid="contact-service-email" className="underline underline-offset-4 transition-colors hover:text-vent-blue">
                      service@ventilator.se
                    </a>
                  </span>
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-vent-blue">Kontaktpersoner</h2>
              <div className="mt-6 grid gap-px bg-vent-navy/10 sm:grid-cols-2" data-testid="contact-persons">
                {PEOPLE.map((p) => (
                  <div key={p.email} className="bg-vent-ice p-8" data-testid={`contact-person-${p.name.split(" ")[0].toLowerCase()}`}>
                    <h3 className="font-display text-xl font-bold tracking-tight text-vent-navy">{p.name}</h3>
                    <p className="mt-1 font-mono text-xs uppercase tracking-widest text-vent-blue">{p.role}</p>
                    <a href={`tel:${p.phone.replace(/[\s-]/g, "")}`} className="mt-4 block text-sm text-vent-navy/80 transition-colors hover:text-vent-blue">
                      {p.phone}
                    </a>
                    <a href={`mailto:${p.email}`} className="mt-1 block break-all text-sm text-vent-navy/80 transition-colors hover:text-vent-blue">
                      {p.email}
                    </a>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grain bg-vent-navy p-10 text-white" data-testid="careers-block">
                <h2 className="font-display text-2xl font-bold tracking-tight">Vill du bli en av oss?</h2>
                <p className="mt-3 text-sm text-white/70">Vi letar alltid efter duktiga medarbetare.</p>
                <a
                  href="http://ventilator.se/karriar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="careers-link"
                  className="group mt-6 inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:border-vent-green hover:bg-vent-green"
                >
                  Se lediga tjänster
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
