import os
import asyncio
import logging

logger = logging.getLogger(__name__)


async def send_enquiry_notification(enquiry: dict) -> bool:
    """Send admin notification for a new enquiry via Resend. Gracefully
    no-ops when RESEND_API_KEY is not configured."""
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    notify_email = os.environ.get("ADMIN_NOTIFY_EMAIL", "").strip()
    sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev").strip()

    if not api_key or not notify_email:
        logger.info("Resend not configured; skipping email notification.")
        return False

    try:
        import resend
        resend.api_key = api_key

        html = f"""
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
            <tr><td style="background:#111111;padding:24px;">
              <h2 style="color:#ffffff;margin:0;font-size:18px;">New Project Enquiry — Apexora Studio</h2>
            </td></tr>
            <tr><td style="padding:24px;color:#111111;">
              <p style="margin:0 0 12px;"><strong>Name:</strong> {enquiry.get('name','')}</p>
              <p style="margin:0 0 12px;"><strong>Email:</strong> {enquiry.get('email','')}</p>
              <p style="margin:0 0 12px;"><strong>Company:</strong> {enquiry.get('company','') or '—'}</p>
              <p style="margin:0 0 12px;"><strong>Website:</strong> {enquiry.get('website','') or '—'}</p>
              <p style="margin:0 0 12px;"><strong>Phone:</strong> {enquiry.get('phone','') or '—'}</p>
              <p style="margin:0 0 12px;"><strong>Budget:</strong> {enquiry.get('budget','') or '—'}</p>
              <p style="margin:16px 0 8px;"><strong>Message:</strong></p>
              <p style="margin:0;color:#374151;line-height:1.6;">{enquiry.get('message','')}</p>
            </td></tr>
            <tr><td style="background:#F9FAFB;padding:16px 24px;color:#6B7280;font-size:12px;">
              Sent from apexora.studio contact form
            </td></tr>
          </table>
        </div>
        """
        params = {
            "from": sender,
            "to": [notify_email],
            "subject": f"New enquiry from {enquiry.get('name','a visitor')}",
            "html": html,
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Enquiry email sent: {result}")
        return True
    except Exception as e:
        logger.error(f"Failed to send enquiry email: {e}")
        return False
