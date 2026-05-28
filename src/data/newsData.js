// src/data/newsData.js
// ─────────────────────────────────────────────────────────────────────────────
// Central source of truth for all news / press release entries.
// Both NewsPress.jsx (index) and NewsArticle.jsx (detail page) import from here.
//
// To add a new post:
//   1. Copy the template below, paste at the TOP of NEWS_ITEMS (before id: 6).
//   2. Give it a unique id (increment the highest existing id).
//   3. Set featured: true only if you want it as the hero card (set the old one to false).
//   4. Drop any image in /public and reference it as image: '/filename.png'.
//
// Template:
// {
//   id: 7,
//   type: 'Press Release',       // 'Press Release' | 'Announcement' | 'Media Advisory'
//   date: 'June X, 2026',
//   headline: '...',
//   excerpt: 'Short 1–2 sentence summary shown on the card.',
//   image: '/PR2.png',           // optional — remove line if no image
//   body: `Full text here.
//
// Blank line = new paragraph.`,
//   tags: ['Advocacy'],          // pick from existing or add new
//   featured: false,
// },
// ─────────────────────────────────────────────────────────────────────────────

export const NEWS_ITEMS = [
  {
    id: 6,
    type: 'Press Release',
    date: 'May 28, 2026',
    headline: 'PUP REVO 2026 Returns in Benefit of Bantay Bata 163 and World Vision Philippines',
    excerpt:
      'After a six-year hiatus, the PUP Communication Society brings back its flagship advocacy event on June 20, 2026, at the PUP Main Campus Oval, rallying students and the public around child protection advocacy.',
    image: '/PR1.png',
    body: `Manila, Philippines — After six years, PUP REVO returns — and this time, its stage is set for the children. The Polytechnic University of the Philippines Communication Society (PUP CommSoc) is mounting PUP REVO 2026, one of the university's largest post-pandemic benefit concerts, with proceeds going directly to child protection programs run by ABS-CBN Foundation Bantay Bata 163 and World Vision Philippines.

A student-led initiative continuing PUP CommSoc's tradition of using creative platforms for grassroots advocacy, PUP REVO 2026 arrives at a critical moment. Across the Philippines, many children remain vulnerable to abuse, exploitation, and online harm, often in environments where they should feel safest. Many cases go unreported due to fear, stigma, and limited access to protection systems.

First held in 2020 in support of Lumad communities in Mindanao, PUP REVO has since evolved into a platform where music meets mobilization. Its 2026 edition shifts focus toward child protection and the creation of safer spaces for Filipino children.

One of PUP's largest post-pandemic benefit concerts for child protection advocacy

With the theme "Sound Against Silence," the concert confronts a reality the Philippines can no longer afford to ignore. The country has been consistently cited among those with the highest cases of online sexual exploitation of children (OSEC), and reports indicate that a significant number of Filipino children experience some form of violence in their lifetime. The initiative seeks to turn awareness into action, encouraging public participation in advocacy and direct support for protection programs.

The concert brings together 12 bands and artists, featuring a mix of established OPM performers and rising Filipino acts, including select Yellow Room Music (YRM) artists such as Mayonnaise, Soapdish, SUD, Julia Daniel, and Leila; alongside Frank Ely and Ian Quiruz of Evosound Philippines, Shanne Dandan, Brando Bal, Bita and the Botflies, and The Sun. Quest, ambassador of World Vision Philippines, will also perform at the event. The performances will be anchored on both artistry and advocacy, aiming to deepen public engagement on child protection issues.

Part of the proceeds from PUP REVO 2026 will directly support child protection programs and safe space initiatives implemented by ABS-CBN Bantay Bata 163 and World Vision Philippines, both recognized for their long-standing work in child welfare and protection.

Open to the public

PUP REVO 2026 invites students, alumni, and the wider community to take part through attendance, awareness sharing, and direct support for partner initiatives. Organizers say the concert's return reflects a renewed commitment to student-led action, transforming awareness into sustained social impact.

Tickets are now available at PUPREVO2026.ME.

For updates, artist announcements, and event details, follow the official Facebook page of the PUP Communication Society: https://www.facebook.com/pupcommsoc

About PUP REVO. PUP REVO is the flagship advocacy concert of the PUP Communication Society at the Polytechnic University of the Philippines. First launched in 2020, the event uses music and public engagement as instruments for social advocacy.

About ABS-CBN Foundation Bantay Bata 163. Bantay Bata 163 is a child protection hotline and program dedicated to the welfare, rights, and protection of Filipino children.

About World Vision Philippines. World Vision Philippines is a Christian humanitarian organization committed to child well-being, working alongside communities and families across the country.`,
    tags: ['Advocacy', 'Launch'],
    featured: true,
  },
  {
    id: 1,
    type: 'Press Release',
    date: 'May 15, 2026',
    headline: 'PUP Communication Society Unveils Full Artist Lineup for REVO 2026',
    excerpt:
      'The PUP Communication Society officially reveals the complete performing lineup for PUP REVO 2026: Sound Against Silence, headlined by Mayonnaise, SUD, and Soapdish.',
    body: `The PUP Communication Society is thrilled to announce the complete artist lineup for PUP REVO 2026: Sound Against Silence — a benefit concert to be held on June 20, 2026 at the PUP Main Campus Oval, Manila.

Headlining the event are fan favorites Mayonnaise, SUD, and Soapdish, joined by Frank Ely, Ian Quiruz, Julia Daniel, Shanne Dandan, Brando Bal, Bita and the Botflies, and The Sun.

Proceeds from ticket sales will benefit ABS-CBN Foundation – Bantay Bata 163 and World Vision Philippines.

"This lineup embodies everything REVO stands for — powerful voices, meaningful music, and collective action," said the organizing committee.

Tickets are available now at puprevo2026.me.`,
    tags: ['Lineup', 'Artists'],
    featured: false,
  },
  {
    id: 2,
    type: 'Announcement',
    date: 'May 8, 2026',
    headline: 'Ticket Sales Now Open — Limited Slots Available',
    excerpt:
      'Online ticket sales for PUP REVO 2026 are officially open. PUP students get a discounted rate; public and alumni tickets are also available while supplies last.',
    body: `PUP Communication Society announces that ticket sales for PUP REVO 2026: Sound Against Silence are now live at puprevo2026.me.

Two ticket tiers are available:
• PUP Student — discounted rate exclusively for enrolled PUP students
• Public / Alumni — open to the general public and PUP alumni

All tickets are non-refundable. Physical tickets must be claimed at designated booths prior to venue entry upon presentation of your e-ticket.

Slots are strictly limited. The committee encourages early purchase to secure your place at the event.`,
    tags: ['Tickets', 'Sales'],
    featured: false,
  },
  {
    id: 3,
    type: 'Press Release',
    date: 'April 28, 2026',
    headline: 'PUP REVO 2026 Partners with ABS-CBN Foundation and World Vision Philippines',
    excerpt:
      'The PUP Communication Society formalizes its charity partnerships, directing a portion of all ticket revenue to two leading child welfare organizations.',
    body: `The PUP Communication Society has officially confirmed its charitable partnerships for PUP REVO 2026: Sound Against Silence.

A portion of all ticket sales will be donated to:
• ABS-CBN Foundation – Bantay Bata 163, dedicated to protecting children from abuse and neglect
• World Vision Philippines, committed to the long-term well-being of children and communities in need

"Music has always been a vehicle for change," the organizing team stated. "REVO 2026 is our way of turning passion into purpose."

For media inquiries, contact puprevo.commsoc@gmail.com.`,
    tags: ['Advocacy', 'Charity'],
    featured: false,
  },
  {
    id: 4,
    type: 'Media Advisory',
    date: 'April 14, 2026',
    headline: 'Media Accreditation Open for PUP REVO 2026: Sound Against Silence',
    excerpt:
      'Journalists, bloggers, and content creators covering PUP REVO 2026 may now apply for media accreditation through the official PUP Communication Society channels.',
    body: `The PUP Communication Society invites media representatives and content creators to apply for accreditation to cover PUP REVO 2026: Sound Against Silence on June 20, 2026.

Accredited press will receive:
• Designated press area access
• Event media kit
• High-resolution photo assets

To apply, send an email to puprevo.commsoc@gmail.com with the subject line "Media Accreditation – [Your Outlet Name]" and include your name, publication/channel, and press ID or portfolio link.

Deadline for applications: June 5, 2026.`,
    tags: ['Media', 'Press'],
    featured: false,
  },
  {
    id: 5,
    type: 'Announcement',
    date: 'March 30, 2026',
    headline: 'PUP REVO 2026 Officially Announced — June 20 at PUP Main Campus Oval',
    excerpt:
      'The PUP Communication Society marks the launch of REVO 2026: Sound Against Silence, a day of OPM music, advocacy, and PUP pride at the Main Campus Oval in Manila.',
    body: `The PUP Communication Society proudly announces PUP REVO 2026: Sound Against Silence — a benefit concert celebrating OPM music, student advocacy, and PUP pride.

Event Details:
• Date: June 20, 2026
• Time: Gates open at 8:00 AM; Program starts at 9:00 AM
• Venue: PUP Main Campus Oval, Manila

The event will feature live OPM performances, sponsor booths, food concessionaires, and official merchandise. All proceeds support child welfare advocacy through partner organizations.

Follow the official PUP Communication Society social media pages for artist reveals, ticket updates, and event reminders.`,
    tags: ['Launch', 'Event'],
    featured: false,
  },
]

export const TYPE_COLORS = {
  'Press Release':  { bg: '#FF3B30', color: '#fff' },
  'Announcement':   { bg: '#FFD700', color: '#000' },
  'Media Advisory': { bg: '#1A4FD6', color: '#fff' },
}

export const ALL_TAGS = ['All', ...Array.from(new Set(NEWS_ITEMS.flatMap(n => n.tags)))]
