// supabase/functions/send-ticket-email/index.ts
// PUP REVO 2026 — Send ticket confirmation email via Resend

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'PUP REVO 2026 <tickets@puprevo2026.me>'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { record } = await req.json()

    if (record.payment_status !== 'paid') {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 })
    }

    const {
      full_name,
      email,
      ticket_code,
      amount_paid,
      ticket_type,
    } = record

    const ticketUrl = `https://puprevo2026.me/ticket/${ticket_code}`
    const PUP_STUDENT_ID = 'd3e77c78-4155-4400-bef6-a162caccf157'
    const isPUPian = record.ticket_type_id === PUP_STUDENT_ID

    const nonPupianNotice = !isPUPian ? `
      <tr>
        <td style="padding-bottom:16px;">
          <div style="background:#2a1a1a;border-radius:8px;padding:14px 18px;border-left:3px solid #FF3B30;">
            <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#FF3B30;">Important — Non-PUPian Ticket Claiming</p>
            <p style="margin:0;font-size:13px;color:rgba(250,245,233,0.8);line-height:1.6;">
              Non-PUPian goers are <strong style="color:#FAF5E9;">not allowed to enter the PUP campus.</strong> Physical ticket claiming will only be accommodated during the scheduled ticket handout dates at <strong style="color:#FAF5E9;">Lunan — Co-working Space &amp; Study Hub.</strong>
            </p>
          </div>
        </td>
      </tr>` : ''

    const representativeSection = !isPUPian ? `
      <tr>
        <td style="padding-bottom:20px;">
          <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#FAF5E9;">If you cannot claim on the scheduled date:</p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(250,245,233,0.8);line-height:1.6;">&#8226;&nbsp;<strong style="color:#FAF5E9;">Representative:</strong> Prepare the receipt of payment, proof of consent for pick-up, and this confirmation email.</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(250,245,233,0.8);line-height:1.6;">&#8226;&nbsp;<strong style="color:#FAF5E9;">Courier:</strong> Provide the last 6 digits of your e-receipt along with the name used in your registration.</td></tr>
          </table>
        </td>
      </tr>` : ''

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Confirmed — PUP REVO 2026</title>
</head>
<body style="margin:0;padding:0;background:#060D1F;font-family:Arial,sans-serif;color:#FAF5E9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#060D1F;padding:40px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

    <!-- Logo -->
    <tr><td align="center" style="padding-bottom:20px;">
      <img src="https://puprevo2026.me/logo.png" alt="PUP REVO" width="72" style="display:block;" />
    </td></tr>

    <!-- Badge -->
    <tr><td align="center" style="padding-bottom:20px;">
      <span style="display:inline-block;background:#0d2a1a;border:1px solid #4ade80;color:#4ade80;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;padding:8px 20px;border-radius:999px;">
        ✓ Registration Confirmed
      </span>
    </td></tr>

    <!-- Card -->
    <tr><td style="background:#0D1530;border:1px solid rgba(255,59,48,0.2);border-radius:16px;overflow:hidden;">

      <!-- Red header -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="background:#FF3B30;padding:24px 28px;">
          <div style="font-size:24px;font-weight:900;color:white;line-height:1.1;">PUP REVO 2026: SOUND AGAINST SILENCE</div>
          <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-top:6px;">
            June 20, 2026 &middot; 9:00 AM &middot; PUP Main Campus Oval, Manila
          </div>
        </td></tr>
      </table>

      <!-- Body -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:28px;">
        <table width="100%" cellpadding="0" cellspacing="0">

          <!-- Greeting -->
          <tr><td style="padding-bottom:16px;">
            <p style="margin:0 0 8px;font-size:15px;color:rgba(250,245,233,0.85);line-height:1.6;">Greetings of peace, <strong style="color:#FAF5E9;">${full_name}!</strong></p>
            <p style="margin:0;font-size:13px;color:rgba(250,245,233,0.75);line-height:1.7;">
              Thank you for registering for <strong style="color:#FAF5E9;">PUP REVO 2026: Sound Against Silence — A Benefit Concert for Safer Kids.</strong>
              We're happy to inform you that your registration has been successfully confirmed. Your payment has been received in full.
            </p>
          </td></tr>

          <!-- Details grid -->
          <tr><td style="padding-bottom:20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="48%" style="padding:12px;background:#1a2340;border-radius:8px;vertical-align:top;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(250,245,233,0.4);margin-bottom:4px;">Name</div>
                  <div style="font-size:14px;font-weight:600;color:#FAF5E9;">${full_name}</div>
                </td>
                <td width="4%"></td>
                <td width="48%" style="padding:12px;background:#1a2340;border-radius:8px;vertical-align:top;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(250,245,233,0.4);margin-bottom:4px;">Ticket Type</div>
                  <div style="font-size:14px;font-weight:600;color:#FAF5E9;">${isPUPian ? 'PUPian / PUP Student' : 'Non-PUPian / Alumni'}</div>
                </td>
              </tr>
              <tr><td colspan="3" style="height:8px;"></td></tr>
              <tr>
                <td width="48%" style="padding:12px;background:#1a2340;border-radius:8px;vertical-align:top;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(250,245,233,0.4);margin-bottom:4px;">Amount Paid</div>
                  <div style="font-size:14px;font-weight:600;color:#FAF5E9;">&#8369;${Number(amount_paid).toFixed(2)}</div>
                </td>
                <td width="4%"></td>
                <td width="48%" style="padding:12px;background:#1a2340;border-radius:8px;vertical-align:top;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(250,245,233,0.4);margin-bottom:4px;">Booking Reference</div>
                  <div style="font-size:14px;font-weight:700;color:#FFD700;letter-spacing:0.06em;">${ticket_code}</div>
                </td>
              </tr>
            </table>
          </td></tr>

          <!-- View ticket -->
          <tr><td style="padding-bottom:24px;" align="center">
            <a href="${ticketUrl}" style="display:inline-block;background:#FF3B30;color:white;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:8px;">View My Ticket &rarr;</a>
            <p style="margin:8px 0 0;font-size:11px;color:rgba(250,245,233,0.35);text-align:center;word-break:break-all;">${ticketUrl}</p>
          </td></tr>

          <!-- Divider -->
          <tr><td style="border-top:1px dashed rgba(255,255,255,0.1);padding-bottom:20px;"></td></tr>

          <!-- No physical ticket notice -->
          <tr><td style="padding-bottom:16px;">
            <div style="background:#2a1a1a;border-radius:8px;padding:14px 18px;border-left:3px solid #FF3B30;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#FF3B30;">NO PHYSICAL TICKET = NO ENTRY</p>
              <p style="margin:0;font-size:13px;color:rgba(250,245,233,0.8);line-height:1.6;">
                You may now proceed with ticket pick-up during our scheduled physical selling dates. Please make sure to claim within the given schedule. <strong style="color:#FAF5E9;">There will be no ticket distribution on the day of the event.</strong>
              </p>
            </div>
          </td></tr>

          <!-- Non-PUPian location notice -->
          ${nonPupianNotice}

          <!-- To claim -->
          <tr><td style="padding-bottom:20px;">
            <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#FAF5E9;">To claim your ticket, please present:</p>
            <table cellpadding="0" cellspacing="0">
              <tr><td style="padding:3px 0;font-size:13px;color:rgba(250,245,233,0.8);">&#8226;&nbsp; A copy of this confirmation email</td></tr>
              <tr><td style="padding:3px 0;font-size:13px;color:rgba(250,245,233,0.8);">&#8226;&nbsp; Your e-payment receipt</td></tr>
              <tr><td style="padding:3px 0;font-size:13px;color:rgba(250,245,233,0.8);">&#8226;&nbsp; A valid Official ID</td></tr>
            </table>
          </td></tr>

          <!-- Representative/courier (non-PUPian) -->
          ${representativeSection}

          <!-- Divider -->
          <tr><td style="border-top:1px dashed rgba(255,255,255,0.1);padding-bottom:20px;"></td></tr>

          <!-- Laking National perk -->
          <tr><td style="padding-bottom:20px;">
            <div style="background:#1a2340;border-radius:8px;padding:16px 20px;">
              <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#FFD700;">🎁 ONLINE PURCHASE EXCLUSIVE PERK</p>
              <p style="margin:0 0 12px;font-size:13px;color:rgba(250,245,233,0.8);line-height:1.6;">
                As a confirmed PUP REVO 2026 ${isPUPian ? 'attendee' : 'participant'}, you're entitled to a <strong style="color:#FAF5E9;">FREE Laking National Plus membership</strong> — cashback rewards and exclusive discounts.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr><td style="padding:2px 0;font-size:13px;color:rgba(250,245,233,0.8);">1. Visit <a href="https://lakingnational.com" style="color:#FFD700;">lakingnational.com</a> and click <strong style="color:#FAF5E9;">Register</strong></td></tr>
                <tr><td style="padding:2px 0;font-size:13px;color:rgba(250,245,233,0.8);">2. Select <strong style="color:#FAF5E9;">Laking National Plus</strong></td></tr>
                <tr><td style="padding:2px 0;font-size:13px;color:rgba(250,245,233,0.8);">3. Enter special code: <strong style="color:#FFD700;letter-spacing:0.08em;">PUPXNBS</strong></td></tr>
                <tr><td style="padding:2px 0;font-size:13px;color:rgba(250,245,233,0.8);">4. Complete your registration</td></tr>
              </table>
              <p style="margin:0 0 6px;font-size:12px;color:rgba(250,245,233,0.6);">Membership Benefits:</p>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                <tr><td style="padding:1px 0;font-size:12px;color:rgba(250,245,233,0.7);">&#8226;&nbsp; Free cashback every time you shop</td></tr>
                <tr><td style="padding:1px 0;font-size:12px;color:rgba(250,245,233,0.7);">&#8226;&nbsp; 10% OFF on imported books</td></tr>
                <tr><td style="padding:1px 0;font-size:12px;color:rgba(250,245,233,0.7);">&#8226;&nbsp; 3% OFF on select school &amp; office supplies</td></tr>
              </table>
              <p style="margin:0;font-size:11px;color:rgba(250,245,233,0.4);line-height:1.6;">
                Code is one-time use per account. Valid June 20–31, 2026 only. Includes 3-month FREE membership.
              </p>
            </div>
          </td></tr>

          <!-- Divider -->
          <tr><td style="border-top:1px dashed rgba(255,255,255,0.1);padding-bottom:20px;"></td></tr>

          <!-- Closing -->
          <tr><td>
            <p style="margin:0 0 10px;font-size:13px;color:rgba(250,245,233,0.75);line-height:1.7;">
              If you have any questions or concerns, feel free to reach out through this email or contact us at <a href="mailto:ryzacustombrado.pupcommsoc@gmail.com" style="color:#FFD700;">ryzacustombrado.pupcommsoc@gmail.com</a>.
            </p>
            <p style="margin:0 0 12px;font-size:13px;color:rgba(250,245,233,0.75);line-height:1.7;">
              Thank you for being part of a concert that goes beyond music — see you at PUP REVO 2026! 💛
            </p>
            <p style="margin:0;font-size:13px;color:rgba(250,245,233,0.6);font-style:italic;">
              In the service of the students,<br/>
              <strong style="color:#FAF5E9;font-style:normal;">PUP Communication Society</strong>
            </p>
          </td></tr>

        </table>
        </td></tr>
      </table>
    </td></tr>

    <!-- Presented by -->
    <tr><td style="padding:24px 0 0;">
      <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(250,245,233,0.35);text-align:center;">Presented by</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <img src="https://puprevo2026.me/pupxpupcommsoc.png" alt="PUP x PUP CommSoc" width="200" style="display:block;margin:0 auto;" />
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- Beneficiaries -->
    <tr><td style="padding:24px 0 0;">
      <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(250,245,233,0.35);text-align:center;">For the Benefit of</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" width="50%">
            <img src="https://puprevo2026.me/BantayBata163.png" alt="Bantay Bata 163" width="120" style="display:block;margin:0 auto;" />
          </td>
          <td align="center" width="50%">
            <img src="https://puprevo2026.me/WorldVisionPH.png" alt="World Vision PH" width="120" style="display:block;margin:0 auto;" />
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- Sponsors -->
    <tr><td style="padding:20px 0 0;">
      <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(250,245,233,0.35);text-align:center;">Our Sponsors & Partners</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <img src="https://puprevo2026.me/sponsors.png" alt="Sponsors" width="100%" style="display:block;max-width:520px;" />
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:24px 0 0;text-align:center;">
      <p style="margin:0 0 12px;font-size:12px;color:rgba(250,245,233,0.5);line-height:1.7;">Follow us on our official social media accounts for updates.</p>
      <table cellpadding="0" cellspacing="0" style="margin:0 auto 12px;">
        <tr>
          <td style="padding:0 6px;">
            <a href="https://www.facebook.com/pupcommsoc" style="display:inline-block;width:32px;height:32px;background:#1a2340;border-radius:50%;text-align:center;line-height:32px;text-decoration:none;font-size:14px;color:#FAF5E9;">f</a>
          </td>
          <td style="padding:0 6px;">
            <a href="https://www.instagram.com/pupcommsoc_/" style="display:inline-block;width:32px;height:32px;background:#1a2340;border-radius:50%;text-align:center;line-height:32px;text-decoration:none;font-size:14px;color:#FAF5E9;">ig</a>
          </td>
          <td style="padding:0 6px;">
            <a href="https://x.com/pupcommsoc_" style="display:inline-block;width:32px;height:32px;background:#1a2340;border-radius:50%;text-align:center;line-height:32px;text-decoration:none;font-size:14px;color:#FAF5E9;">x</a>
          </td>
          <td style="padding:0 6px;">
            <a href="http://tiktok.com/@pup_commsoc" style="display:inline-block;width:32px;height:32px;background:#1a2340;border-radius:50%;text-align:center;line-height:32px;text-decoration:none;font-size:14px;color:#FAF5E9;">tt</a>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 4px;font-size:11px;color:rgba(250,245,233,0.3);">&copy; 2026 PUP REVO &mdash; PUP Communication Society. All rights reserved.</p>
      <p style="margin:0 0 4px;font-size:11px;color:rgba(250,245,233,0.3);">For concerns, email <a href="mailto:puprevo.commsoc@gmail.com" style="color:rgba(250,245,233,0.4);">puprevo.commsoc@gmail.com</a></p>
      <p style="margin:0;font-size:11px;color:rgba(250,245,233,0.3);">Website: <a href="https://puprevo2026.me" style="color:#FFD700;">puprevo2026.me</a></p>
    </td></tr>

  </table>
  </td></tr>
</table>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: `Registration Confirmed! What to do next? | PUP REVO 2026`,
        html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend error:', data)
      return new Response(JSON.stringify({ error: data }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200 })

  } catch (err) {
    console.error('Function error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})