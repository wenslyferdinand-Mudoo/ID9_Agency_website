# ID9 Agency — Brand Voice & Website Copywriting Standard

**Owner:** Impact Digital 9 Agency  
**Applies to:** Every public page, locale, SEO field, CMS entry, form, notification, social preview and future campaign  
**Languages:** English (EN) and French (FR)  
**Status:** Editorial standard — mandatory for new and revised copy

## 1. Brand naming — non-negotiable

The brand name is a proper noun. It is never translated, localized, re-ordered or paraphrased.

Approved public forms:
- **Impact Digital 9 Agency** — full official display name.
- **ID9 Agency** — approved short form after the full name has been established.

Never write:
- “Impact numérique 9” or “Impact Numérique 9”.
- “Agence Impact Digital 9”.
- “Impact Digital 9 Agence”.
- Any translated, reordered or improvised version of the brand name.

The exact same approved brand forms must appear in EN and FR. Translation applies to surrounding sentences only. Preserve capitalization and spacing exactly.

Implementation:
- `BRAND.fullName` is the canonical full display name: `Impact Digital 9 Agency`.
- `BRAND.name` is the canonical short display name: `ID9 Agency`.
- `ID9_AGENCY` may remain in technical identifiers, repository names, environment variables and internal code identifiers. Do not expose it as the preferred public display name when “ID9 Agency” is appropriate.
- WhatsApp greetings and contact messages must use an approved brand form.

## 2. Positioning

Impact Digital 9 Agency is an independent creative and digital agency based in Haiti. It brings together brand strategy, graphic design, brand identity, marketing, photography, content production and digital services.

The website must communicate:
1. Strategic understanding before execution.
2. Creative quality grounded in a clear brief.
3. Coherence across brand identity and digital touchpoints.
4. Disciplined delivery and transparent communication.
5. Practical value without exaggerated promises.

Do not position the agency as a personal portfolio. The founder may be introduced as the agency's founder and creative lead, but agency capabilities and client value remain the primary narrative.

## 3. Voice and tone

The voice is:
- **Strategic:** connects creative work to audience, positioning and business context.
- **Confident:** clear and assured, without boasting.
- **Precise:** specific nouns and verbs; avoid vague superlatives.
- **Editorial:** concise, composed and easy to scan.
- **Human:** professional, direct and accessible.
- **International:** natural English and polished French, not literal translations.

Avoid:
- Empty claims such as “world-class”, “best in the market”, “dominant brands” or “unmatched results” unless independently evidenced.
- Unsupported staffing claims such as “senior team” or “specialist team”.
- Guaranteed growth, conversion, traction, revenue or delivery timelines.
- Overuse of “impactful”, “undeniable”, “revolutionary”, “premium” and “next-level”.
- Dense jargon when a plain professional phrase is clearer.
- Literal EN-to-FR translations that sound unnatural.

## 4. Messaging architecture

### Core proposition
**EN:** Creative and digital expertise, aligned around your brand's next stage.  
**FR:** Des expertises créatives et digitales réunies au service de la prochaine étape de votre marque.

### Supporting messages
- **Strategy:** Understand the brief, audience and business context before choosing a solution.
- **Design:** Build clear, distinctive and consistent visual systems.
- **Digital:** Create useful digital experiences that support real user needs.
- **Content:** Produce photography and content with a clear purpose and channel fit.
- **Marketing:** Connect messages, creative assets and distribution to defined objectives.

### Primary call to action
- EN: “Start a project” / “Discuss your project”
- FR: “Démarrer un projet” / “Parlons de votre projet”

Avoid promises of free audits, strategy sessions, deliverables or response times unless the offer and operational capacity are confirmed.

## 5. Page-by-page editorial direction

### Home
Lead with the agency's proposition, not a generic slogan. Explain what the agency connects, who it serves and what a prospect can discuss. Use one clear primary CTA and one secondary contact route.

### About
Explain the agency's origin, location, multidisciplinary model and working principles. Keep founder biography factual and proportionate. Do not make the founder biography the primary homepage proposition.

### Services
Describe each service in terms of the problem it addresses, the work involved and the deliverable the client can expect. Do not imply every project includes every discipline. Do not publish a fixed count of disciplines unless the service catalogue has been audited and the count is accurate.

### Projects
Use concise, factual project summaries. Identify the client's name only when publication is authorized. State the agency's actual role, services and year. Never infer missing client information or project outcomes.

### Project detail / Case Study
Use a narrative sequence: context → challenge → objectives → strategic choices → execution → deliverables → verified outcome. Separate work delivered from business results. Only publish metrics, testimonials, logos and screenshots with evidence and permission.

### Contact
Set clear expectations about the information requested and the next step. Avoid artificial urgency. Never promise a response deadline unless it is operationally guaranteed.

### Journal / Insights
Publish useful, specific perspectives on design, branding, digital products, content and marketing. Avoid generic thought-leadership claims and unsupported trend predictions.

## 6. English and French localization

- Write English and French as native editorial copy, not word-for-word translations.
- Keep the meaning, promise, scope and tone equivalent in both languages.
- Preserve the official brand name exactly in both locales.
- Keep product names, client names, social handles, URLs and technical terms unchanged when they are proper nouns.
- Use correct French accents, apostrophes, punctuation and non-breaking spaces where appropriate.
- Do not mix English phrases into French copy unless they are established industry terms or product names.
- Review all navigation, buttons, forms, validation messages, success/error states, metadata and CMS content in both locales.

## 7. Claims and evidence policy

Before publishing a claim, classify it:
- **Fact:** supported by a verifiable record (e.g. founding date, published service).
- **Capability:** a service the agency can actually deliver.
- **Outcome:** a result supported by project evidence.
- **Opinion / positioning:** clearly presented as the agency's point of view.

Rules:
- Never invent clients, testimonials, awards, metrics, team size, years of experience, delivery speed or case-study results.
- Do not describe a qualitative benefit as a measured business result.
- Label estimates and projections explicitly.
- If evidence or publication permission is missing, remove the claim or state only what is known.

## 8. Copy quality checklist

Every new or revised text must pass:
- [ ] Brand name is exactly “Impact Digital 9 Agency” or “ID9 Agency”.
- [ ] The brand name has not been translated or re-ordered.
- [ ] The copy explains a clear value or next step.
- [ ] The language is specific, concise and natural.
- [ ] Claims are supported and appropriately qualified.
- [ ] EN and FR communicate the same meaning.
- [ ] No placeholder, empty superlative or unsupported promise remains.
- [ ] CTA wording matches the action the interface actually performs.
- [ ] Spelling, punctuation, accessibility and mobile readability are reviewed.

## 9. Release requirements

- Keep copy changes in a dedicated, reviewable pull request.
- Verify all changed strings render correctly in EN and FR.
- Check layout overflow and line wrapping at mobile and desktop widths.
- Verify brand display in header, hero, footer, contact, metadata and share previews.
- Run the frontend build and relevant tests; report actual command output.
- Do not merge or deploy to production without owner approval.
