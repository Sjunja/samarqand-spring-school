import { hashPassword } from './auth.lib';
import { sendEmail } from './email.lib';
import { corsHeaders, jsonResponse } from './shared.lib';

interface Env {
  DB: D1Database;
  REGISTRATION_FILES: R2Bucket;
  MAIL_FROM: string;
  MAIL_FROM_NAME?: string;
  MAIL_REPLY_TO?: string;
  SCHOOL_EMAIL?: string;
}

const generateFilePath = (email: string, filename: string, prefix: string) => {
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  const extension = filename.split('.').pop() || 'file';
  const fileId = crypto.randomUUID();
  return `${prefix}/${safeEmail}/${fileId}.${extension}`;
};

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return jsonResponse({ success: false, error: 'Unsupported content type' }, 415);
  }

  const form = await request.formData();
  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');
  const participationType = String(form.get('participationType') || '').trim();
  const participationPackage = String(form.get('participationPackage') || '').trim();
  const participantCategory = String(form.get('participantCategory') || '').trim();

  const consentData = String(form.get('consentData') || '') === 'true';
  const consentRules = String(form.get('consentRules') || '') === 'true';
  const consentMedia = String(form.get('consentMedia') || '') === 'true';

  if (!name || !email || !password || !participationType || !participantCategory) {
    return jsonResponse({ success: false, error: 'Missing required fields' }, 400);
  }
  if (password.length < 8) {
    return jsonResponse({ success: false, error: 'Password too short' }, 400);
  }

  if (!consentData || !consentRules) {
    return jsonResponse({ success: false, error: 'Consent required' }, 400);
  }

  const pricing = calculatePricing(participationType, participationPackage, participantCategory);
  if (!pricing) {
    return jsonResponse({ success: false, error: 'Invalid pricing selection' }, 400);
  }

  let membershipProofPath: string | null = null;
  let membershipProofName: string | null = null;
  const proof = form.get('membershipProof');

  if (participantCategory === 'apu-member' && !(proof instanceof File)) {
    return jsonResponse({ success: false, error: 'Membership proof required' }, 400);
  }

  if (proof instanceof File && proof.size > 0) {
    membershipProofName = proof.name;
    membershipProofPath = generateFilePath(email, proof.name, 'membership');
    try {
      await env.REGISTRATION_FILES.put(membershipProofPath, proof.stream(), {
        httpMetadata: { contentType: proof.type || 'application/octet-stream' },
      });
    } catch (error) {
      console.error('R2 upload error:', error);
      return jsonResponse({ success: false, error: 'File upload failed' }, 500);
    }
  }

  const birthdate = String(form.get('birthdate') || '').trim() || null;
  const phone = String(form.get('phone') || '').trim() || null;
  const telegram = String(form.get('telegram') || '').trim() || null;
  const city = String(form.get('city') || '').trim() || null;
  const country = String(form.get('country') || '').trim() || null;
  const organization = String(form.get('organization') || '').trim() || null;
  const position = String(form.get('position') || '').trim() || null;
  const specialty = String(form.get('specialty') || '').trim() || null;
  const specialtyOther = String(form.get('specialtyOther') || '').trim() || null;
  const experienceRaw = String(form.get('experience') || '').trim();
  const parsedExperience = Number(experienceRaw);
  const experience = Number.isFinite(parsedExperience) ? parsedExperience : null;

  const userId = crypto.randomUUID();
  const registrationId = crypto.randomUUID();
  const paymentId = crypto.randomUUID();
  const { hash, salt } = await hashPassword(password);

  let invoiceNumber: string | null = null;
  try {
    const countResult = await env.DB.prepare('select count(*) as count from payments').first();
    const count = typeof countResult?.count === 'number' ? countResult.count : Number(countResult?.count ?? 0);
    const sequence = count + 1;
    const year = new Date().getFullYear();
    invoiceNumber = `INV-${year}-${String(sequence).padStart(4, '0')}`;
  } catch (error) {
    console.error('Invoice sequence error:', error);
  }

  try {
    await env.DB.prepare(
      'insert into users (id, email, password_hash, password_salt, role, name, registration_id) values (?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(userId, email, hash, salt, 'participant', name, registrationId)
      .run();

    const stmt = env.DB.prepare(
      `insert into registrations (
        id,
        user_id,
        name,
        birthdate,
        email,
        phone,
        telegram,
        city,
        country,
        organization,
        position,
        specialty,
        specialty_other,
        experience,
        participation_type,
        participation_package,
        participant_category,
        membership_proof_path,
        membership_proof_name,
        consent_data,
        consent_rules,
        consent_media
      ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    await stmt.bind(
      registrationId,
      userId,
      name,
      birthdate,
      email,
      phone,
      telegram,
      city,
      country,
      organization,
      position,
      specialty,
      specialtyOther,
      experience,
      participationType,
      participationPackage || null,
      participantCategory,
      membershipProofPath,
      membershipProofName,
      consentData ? 1 : 0,
      consentRules ? 1 : 0,
      consentMedia ? 1 : 0
    ).run();

    await env.DB.prepare(
      `insert into payments (
        id,
        registration_id,
        status,
        amount,
        currency,
        invoice_number,
        updated_at
      ) values (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        paymentId,
        registrationId,
        'pending',
        pricing.amount,
        pricing.currency,
        invoiceNumber,
        new Date().toISOString()
      )
      .run();
  } catch (error) {
    if (membershipProofPath) {
      try {
        await env.REGISTRATION_FILES.delete(membershipProofPath);
      } catch (cleanupError) {
        console.error('R2 cleanup error:', cleanupError);
      }
    }
    try {
      await env.DB.prepare('delete from users where id = ?').bind(userId).run();
      await env.DB.prepare('delete from payments where id = ?').bind(paymentId).run();
      await env.DB.prepare('delete from registrations where id = ?').bind(registrationId).run();
    } catch (cleanupError) {
      console.error('DB cleanup error:', cleanupError);
    }
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes('unique')) {
      return jsonResponse({ success: false, error: 'Email already registered' }, 409);
    }
    console.error('D1 insert error:', error);
    return jsonResponse({ success: false, error: 'Database error' }, 500);
  }

  const invoiceUrl = new URL(`/invoice/${paymentId}`, request.url).toString();
  const subject = 'Регистрация получена: Самаркандская школа 2026';
  const text = [
    `Здравствуйте, ${name}!`,
    '',
    'Ваша регистрация получена. Для подтверждения участия необходимо оплатить взнос.',
    `Сумма: ${pricing.amount} ${pricing.currency}`,
    invoiceNumber ? `Счет: ${invoiceNumber}` : null,
    `Ссылка на счет: ${invoiceUrl}`,
    '',
    'Оплата производится на расчетный счет Ассоциации психиатров Узбекистана.',
    '',
    'Реквизиты (UZS):',
    'ННО "O`ZBEKISTON PSIXIATRLARI ASSOTSIATSIYASI"',
    'г. Ташкент, ул. Мехржон 35',
    'р/с 20212000205048580001',
    'ОПЕРУ ЧАКБ «DAVR BANK»',
    'МФО: 00981',
    'ИНН: 207293171',
    '',
    'Реквизиты (валюта):',
    'ННО "O`ZBEKISTON PSIXIATRLARI ASSOTSIATSIYASI"',
    'г. Ташкент, ул. Мехржон 35',
    'р/с вал: 20212840905048580001',
    'ОПЕРУ ЧАКБ «DAVR BANK»',
    'МФО: 00981',
    'ИНН: 207293171',
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <p>Здравствуйте, ${name}!</p>
    <p>Ваша регистрация получена. Для подтверждения участия необходимо оплатить взнос.</p>
    <p><strong>Сумма:</strong> ${pricing.amount} ${pricing.currency}</p>
    ${invoiceNumber ? `<p><strong>Счет:</strong> ${invoiceNumber}</p>` : ''}
    <p><a href="${invoiceUrl}">Ссылка на счет</a></p>
    <hr />
    <p><strong>Оплата производится на расчетный счет Ассоциации психиатров Узбекистана.</strong></p>
    <p>Реквизиты (UZS):<br/>
      ННО "O'ZBEKISTON PSIXIATRLARI ASSOTSIATSIYASI"<br/>
      г. Ташкент, ул. Мехржон 35<br/>
      р/с 20212000205048580001<br/>
      ОПЕРУ ЧАКБ «DAVR BANK»<br/>
      МФО: 00981<br/>
      ИНН: 207293171
    </p>
    <p>Реквизиты (валюта):<br/>
      ННО "O'ZBEKISTON PSIXIATRLARI ASSOTSIATSIYASI"<br/>
      г. Ташкент, ул. Мехржон 35<br/>
      р/с вал: 20212840905048580001<br/>
      ОПЕРУ ЧАКБ «DAVR BANK»<br/>
      МФО: 00981<br/>
      ИНН: 207293171
    </p>
  `;

  await sendEmail(env, {
    to: email,
    subject,
    text,
    html,
    cc: env.SCHOOL_EMAIL,
  });

  return jsonResponse({ success: true });
};

const PRICING = {
  'in-person': {
    basic: { uz: 1500000, intl: 250 },
    premium: { uz: 2500000, intl: 350 },
  },
  online: {
    starter: { uz: 2000000, intl: 300 },
  },
} as const;

const DISCOUNT_RATE = 0.1;

const calculatePricing = (participationType: string, participationPackage: string, participantCategory: string) => {
  if (!participationType || !participationPackage || !participantCategory) {
    return null;
  }
  const pricingByType = PRICING[participationType as keyof typeof PRICING];
  if (!pricingByType) return null;
  const pricing = pricingByType[participationPackage as keyof typeof pricingByType];
  if (!pricing) return null;

  if (participantCategory === 'international') {
    return { amount: pricing.intl, currency: 'USD' };
  }

  const baseAmount = pricing.uz;
  const discount = participantCategory === 'apu-member'
    ? Math.round(baseAmount * DISCOUNT_RATE)
    : 0;

  return { amount: baseAmount - discount, currency: 'UZS' };
};
