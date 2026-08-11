# PRD – Ventilator företagshemsida (redesign av ventilator.se)

## Ursprungligt problem
Användaren (Ventilator, luftbehandlingsföretag grundat 1931, del av Energivärden-gruppen) ville ha en ny, "fräschare" version av sin befintliga hemsida ventilator.se – med bibehållen struktur, varumärke och texter. Flersidig webbplats, företagsmässig/seriös + modern/minimalistisk stil, kontaktformulär som skickar meddelanden till e-post.

## Arkitektur
- **Frontend:** React 19 + Tailwind + framer-motion (scroll-reveals, masked line-reveal) + lenis (smooth scroll). Sidor: Hem, Om oss, Tjänster, Referenser, Hållbarhet, Kontakt.
- **Backend:** FastAPI, `/api/contact` (validerar, sparar i MongoDB `contact_messages`, skickar e-post via Resend om RESEND_API_KEY är satt).
- **Databas:** MongoDB via MONGO_URL.
- **Design:** /app/design_guidelines.json – mörkblå #005087, mörk navy #0A1F35/#0B1120, grön accent #00A859. Typsnitt: Cabinet Grotesk (rubriker), Inter (brödtext), JetBrains Mono (accenter).

## Användarpersonas
- Fastighetsägare/beställare som söker entreprenad eller service inom ventilation
- Arkitekter/konsulter som behöver projekteringsstöd
- Presumtiva medarbetare (karriärlänk)

## Kärnkrav (statiska)
1. Flersidig struktur speglande ventilator.se
2. Varumärkestrogen design (blått, seriöst, modernt)
3. Kontaktformulär med e-postleverans
4. Kontaktpersoner, adress, telefon
5. Referensprojekt och hållbarhetsinnehåll (Agenda 2030)

## Implementerat
- 2026-08-11: Komplett ny webbplats (6 sidor) med kinetisk hero, parallax, marquee, manifest-kapitel, tjänstelista, referenskort med riktiga projektbilder, hållbarhetssida, kontaktsida med formulär (POST /api/contact → MongoDB + Resend-ready). Lenis smooth scroll, framer-motion reveals, glassmorphism-header, mobilmeny.
- 2026-08-11: Tog bort allt innehåll om renrum; tjänsten "Renrumssystem" ersatt med "Samordnade installationer".
- 2026-08-11: Kundens logotyp (logga.gif) infogad i sidhuvudet, ersätter textbaserad logotyp.
- 2026-08-11: Ny flik "Nyheter" (/nyheter + /nyheter/:id) med nyhetsflöde från MongoDB. Adminpanel /admin med JWT-inloggning (info@ventilator.se) för att skapa/redigera/ta bort/publicera nyheter. Fyra befintliga nyheter från gamla ventilator.se seedade.

## Pågående / backlog
- **P0:** RESEND_API_KEY saknas – e-postleverans avstängd (meddelanden sparas i DB). Användaren måste skapa nyckel på resend.com och be mig lägga in den, samt bekräfta mottagaradress (nu info@ventilator.se).
- **P1:** Logotyp-fil från kund (nu textbaserad logotyp). Google Maps-karta på kontaktsidan. Karriärsida (länkar nu till gamla siten).
- **P2:** Fler referensprojekt med undersidor, nyhetsflöde, sökfunktion.

## Nästa steg
1. Lägg in Resend-nyckel + verifiera domänen ventilator.se för avsändare
2. Ersätt textlogotyp med kundens logofil
3. Lägg till karta och ev. fler kontaktpersoner
