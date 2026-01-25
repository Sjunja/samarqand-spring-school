interface EmailEnv {
  MAIL_FROM: string;
  MAIL_FROM_NAME?: string;
  MAIL_REPLY_TO?: string;
  SCHOOL_EMAIL?: string;
}

type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
  cc?: string;
};

const MAIL_ENDPOINT = 'https://api.mailchannels.net/tx/v1/send';

export const sendEmail = async (env: EmailEnv, params: SendEmailParams) => {
  if (!env.MAIL_FROM) {
    console.warn('MAIL_FROM is not configured, skipping email send.');
    return { ok: false, error: 'MAIL_FROM not configured' };
  }

  const payload: Record<string, unknown> = {
    personalizations: [
      {
        to: [{ email: params.to }],
        ...(params.cc ? { cc: [{ email: params.cc }] } : {}),
      },
    ],
    from: {
      email: env.MAIL_FROM,
      name: env.MAIL_FROM_NAME || 'Samarqand School',
    },
    subject: params.subject,
    content: [
      { type: 'text/plain', value: params.text },
      { type: 'text/html', value: params.html },
    ],
  };

  if (env.MAIL_REPLY_TO) {
    payload.reply_to = { email: env.MAIL_REPLY_TO };
  }

  const response = await fetch(MAIL_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('MailChannels error:', response.status, errorText);
    return { ok: false, error: errorText };
  }

  return { ok: true };
};
