// code/samarqand-school/functions/api/shared.lib.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var jsonResponse = (payload, status = 200) => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
};

// code/samarqand-school/functions/api/auth.lib.ts
var SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
var PASSWORD_ITERATIONS = 1e5;
var PASSWORD_KEY_LENGTH = 32;
var encoder = new TextEncoder();
var toBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
};
var hashPassword = async (password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256"
    },
    key,
    PASSWORD_KEY_LENGTH * 8
  );
  return {
    salt: toBase64(salt.buffer),
    hash: toBase64(hash)
  };
};

// code/samarqand-school/functions/api/email.lib.ts
var MAIL_ENDPOINT = "https://api.mailchannels.net/tx/v1/send";
var sendEmail = async (env, params) => {
  if (!env.MAIL_FROM) {
    console.warn("MAIL_FROM is not configured, skipping email send.");
    return { ok: false, error: "MAIL_FROM not configured" };
  }
  const payload = {
    personalizations: [
      {
        to: [{ email: params.to }],
        ...params.cc ? { cc: [{ email: params.cc }] } : {}
      }
    ],
    from: {
      email: env.MAIL_FROM,
      name: env.MAIL_FROM_NAME || "Samarqand School"
    },
    subject: params.subject,
    content: [
      { type: "text/plain", value: params.text },
      { type: "text/html", value: params.html }
    ]
  };
  if (env.MAIL_REPLY_TO) {
    payload.reply_to = { email: env.MAIL_REPLY_TO };
  }
  const response = await fetch(MAIL_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("MailChannels error:", response.status, errorText);
    return { ok: false, error: errorText };
  }
  return { ok: true };
};

// code/samarqand-school/functions/api/registration.ts
var generateFilePath = (email, filename, prefix) => {
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
  const extension = filename.split(".").pop() || "file";
  const fileId = crypto.randomUUID();
  return `${prefix}/${safeEmail}/${fileId}.${extension}`;
};
var isFile = (value) => typeof File !== "undefined" && value instanceof File;
var onRequest = async ({ request, env }) => {
  const debug = request.headers.get("x-debug") === "1";
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return jsonResponse({ success: false, error: "Unsupported content type" }, 415);
    }
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const participationType = String(form.get("participationType") || "").trim();
    const participationPackage = String(form.get("participationPackage") || "").trim();
    const participantCategory = String(form.get("participantCategory") || "").trim();
    const consentData = String(form.get("consentData") || "") === "true";
    const consentRules = String(form.get("consentRules") || "") === "true";
    const consentMedia = String(form.get("consentMedia") || "") === "true";
    if (!name || !email || !password || !participationType || !participantCategory) {
      return jsonResponse({ success: false, error: "Missing required fields" }, 400);
    }
    if (password.length < 8) {
      return jsonResponse({ success: false, error: "Password too short" }, 400);
    }
    if (!consentData || !consentRules) {
      return jsonResponse({ success: false, error: "Consent required" }, 400);
    }
    const pricing = calculatePricing(participationType, participationPackage, participantCategory);
    if (!pricing) {
      return jsonResponse({ success: false, error: "Invalid pricing selection" }, 400);
    }
    let membershipProofPath = null;
    let membershipProofName = null;
    const proof = form.get("membershipProof");
    if (participantCategory === "apu-member" && !isFile(proof)) {
      return jsonResponse({ success: false, error: "Membership proof required" }, 400);
    }
    if (isFile(proof) && proof.size > 0) {
      membershipProofName = proof.name;
      membershipProofPath = generateFilePath(email, proof.name, "membership");
      try {
        await env.REGISTRATION_FILES.put(membershipProofPath, proof.stream(), {
          httpMetadata: { contentType: proof.type || "application/octet-stream" }
        });
      } catch (error) {
        console.error("R2 upload error:", error);
        return jsonResponse({ success: false, error: "File upload failed" }, 500);
      }
    }
    const birthdate = String(form.get("birthdate") || "").trim() || null;
    const phone = String(form.get("phone") || "").trim() || null;
    const telegram = String(form.get("telegram") || "").trim() || null;
    const city = String(form.get("city") || "").trim() || null;
    const country = String(form.get("country") || "").trim() || null;
    const organization = String(form.get("organization") || "").trim() || null;
    const position = String(form.get("position") || "").trim() || null;
    const specialty = String(form.get("specialty") || "").trim() || null;
    const specialtyOther = String(form.get("specialtyOther") || "").trim() || null;
    const experienceRaw = String(form.get("experience") || "").trim();
    const parsedExperience = Number(experienceRaw);
    const experience = Number.isFinite(parsedExperience) ? parsedExperience : null;
    const userId = crypto.randomUUID();
    const registrationId = crypto.randomUUID();
    const paymentId = crypto.randomUUID();
    const { hash, salt } = await hashPassword(password);
    let invoiceNumber = null;
    try {
      const countResult = await env.DB.prepare("select count(*) as count from payments").first();
      const count = typeof countResult?.count === "number" ? countResult.count : Number(countResult?.count ?? 0);
      const sequence = count + 1;
      const year = (/* @__PURE__ */ new Date()).getFullYear();
      invoiceNumber = `INV-${year}-${String(sequence).padStart(4, "0")}`;
    } catch (error) {
      console.error("Invoice sequence error:", error);
    }
    try {
      await env.DB.prepare(
        "insert into users (id, email, password_hash, password_salt, role, name, registration_id) values (?, ?, ?, ?, ?, ?, ?)"
      ).bind(userId, email, hash, salt, "participant", name, registrationId).run();
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
      ).bind(
        paymentId,
        registrationId,
        "pending",
        pricing.amount,
        pricing.currency,
        invoiceNumber,
        (/* @__PURE__ */ new Date()).toISOString()
      ).run();
    } catch (error) {
      if (membershipProofPath) {
        try {
          await env.REGISTRATION_FILES.delete(membershipProofPath);
        } catch (cleanupError) {
          console.error("R2 cleanup error:", cleanupError);
        }
      }
      try {
        await env.DB.prepare("delete from users where id = ?").bind(userId).run();
        await env.DB.prepare("delete from payments where id = ?").bind(paymentId).run();
        await env.DB.prepare("delete from registrations where id = ?").bind(registrationId).run();
      } catch (cleanupError) {
        console.error("DB cleanup error:", cleanupError);
      }
      const message = error instanceof Error ? error.message : String(error);
      if (message.toLowerCase().includes("unique")) {
        return jsonResponse({ success: false, error: "Email already registered" }, 409);
      }
      console.error("D1 insert error:", error);
      return jsonResponse({ success: false, error: "Database error" }, 500);
    }
    const invoiceUrl = new URL(`/invoice/${paymentId}`, request.url).toString();
    const subject = "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0430: \u0421\u0430\u043C\u0430\u0440\u043A\u0430\u043D\u0434\u0441\u043A\u0430\u044F \u0448\u043A\u043E\u043B\u0430 2026";
    const text = [
      `\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, ${name}!`,
      "",
      "\u0412\u0430\u0448\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0430. \u0414\u043B\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u0443\u0447\u0430\u0441\u0442\u0438\u044F \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u043E\u043F\u043B\u0430\u0442\u0438\u0442\u044C \u0432\u0437\u043D\u043E\u0441.",
      `\u0421\u0443\u043C\u043C\u0430: ${pricing.amount} ${pricing.currency}`,
      invoiceNumber ? `\u0421\u0447\u0435\u0442: ${invoiceNumber}` : null,
      `\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u0441\u0447\u0435\u0442: ${invoiceUrl}`,
      "",
      "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 \u0440\u0430\u0441\u0447\u0435\u0442\u043D\u044B\u0439 \u0441\u0447\u0435\u0442 \u0410\u0441\u0441\u043E\u0446\u0438\u0430\u0446\u0438\u0438 \u043F\u0441\u0438\u0445\u0438\u0430\u0442\u0440\u043E\u0432 \u0423\u0437\u0431\u0435\u043A\u0438\u0441\u0442\u0430\u043D\u0430.",
      "",
      "\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B (UZS):",
      '\u041D\u041D\u041E "O`ZBEKISTON PSIXIATRLARI ASSOTSIATSIYASI"',
      "\u0433. \u0422\u0430\u0448\u043A\u0435\u043D\u0442, \u0443\u043B. \u041C\u0435\u0445\u0440\u0436\u043E\u043D 35",
      "\u0440/\u0441 20212000205048580001",
      "\u041E\u041F\u0415\u0420\u0423 \u0427\u0410\u041A\u0411 \xABDAVR BANK\xBB",
      "\u041C\u0424\u041E: 00981",
      "\u0418\u041D\u041D: 207293171",
      "",
      "\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B (\u0432\u0430\u043B\u044E\u0442\u0430):",
      '\u041D\u041D\u041E "O`ZBEKISTON PSIXIATRLARI ASSOTSIATSIYASI"',
      "\u0433. \u0422\u0430\u0448\u043A\u0435\u043D\u0442, \u0443\u043B. \u041C\u0435\u0445\u0440\u0436\u043E\u043D 35",
      "\u0440/\u0441 \u0432\u0430\u043B: 20212840905048580001",
      "\u041E\u041F\u0415\u0420\u0423 \u0427\u0410\u041A\u0411 \xABDAVR BANK\xBB",
      "\u041C\u0424\u041E: 00981",
      "\u0418\u041D\u041D: 207293171"
    ].filter(Boolean).join("\n");
    const html = `
      <p>\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, ${name}!</p>
      <p>\u0412\u0430\u0448\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0430. \u0414\u043B\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u0443\u0447\u0430\u0441\u0442\u0438\u044F \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u043E\u043F\u043B\u0430\u0442\u0438\u0442\u044C \u0432\u0437\u043D\u043E\u0441.</p>
      <p><strong>\u0421\u0443\u043C\u043C\u0430:</strong> ${pricing.amount} ${pricing.currency}</p>
      ${invoiceNumber ? `<p><strong>\u0421\u0447\u0435\u0442:</strong> ${invoiceNumber}</p>` : ""}
      <p><a href="${invoiceUrl}">\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u0441\u0447\u0435\u0442</a></p>
      <hr />
      <p><strong>\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 \u0440\u0430\u0441\u0447\u0435\u0442\u043D\u044B\u0439 \u0441\u0447\u0435\u0442 \u0410\u0441\u0441\u043E\u0446\u0438\u0430\u0446\u0438\u0438 \u043F\u0441\u0438\u0445\u0438\u0430\u0442\u0440\u043E\u0432 \u0423\u0437\u0431\u0435\u043A\u0438\u0441\u0442\u0430\u043D\u0430.</strong></p>
      <p>\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B (UZS):<br/>
        \u041D\u041D\u041E "O'ZBEKISTON PSIXIATRLARI ASSOTSIATSIYASI"<br/>
        \u0433. \u0422\u0430\u0448\u043A\u0435\u043D\u0442, \u0443\u043B. \u041C\u0435\u0445\u0440\u0436\u043E\u043D 35<br/>
        \u0440/\u0441 20212000205048580001<br/>
        \u041E\u041F\u0415\u0420\u0423 \u0427\u0410\u041A\u0411 \xABDAVR BANK\xBB<br/>
        \u041C\u0424\u041E: 00981<br/>
        \u0418\u041D\u041D: 207293171
      </p>
      <p>\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B (\u0432\u0430\u043B\u044E\u0442\u0430):<br/>
        \u041D\u041D\u041E "O'ZBEKISTON PSIXIATRLARI ASSOTSIATSIYASI"<br/>
        \u0433. \u0422\u0430\u0448\u043A\u0435\u043D\u0442, \u0443\u043B. \u041C\u0435\u0445\u0440\u0436\u043E\u043D 35<br/>
        \u0440/\u0441 \u0432\u0430\u043B: 20212840905048580001<br/>
        \u041E\u041F\u0415\u0420\u0423 \u0427\u0410\u041A\u0411 \xABDAVR BANK\xBB<br/>
        \u041C\u0424\u041E: 00981<br/>
        \u0418\u041D\u041D: 207293171
      </p>
    `;
    await sendEmail(env, {
      to: email,
      subject,
      text,
      html,
      cc: env.SCHOOL_EMAIL
    });
    return jsonResponse({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Registration fatal error:", error);
    return jsonResponse(
      debug ? { success: false, error: "Server error", detail: message } : { success: false, error: "Server error" },
      500
    );
  }
};
var PRICING = {
  "in-person": {
    basic: { uz: 15e5, intl: 250 },
    premium: { uz: 25e5, intl: 350 }
  },
  online: {
    starter: { uz: 2e6, intl: 300 }
  }
};
var DISCOUNT_RATE = 0.1;
var calculatePricing = (participationType, participationPackage, participantCategory) => {
  if (!participationType || !participationPackage || !participantCategory) {
    return null;
  }
  const pricingByType = PRICING[participationType];
  if (!pricingByType) return null;
  const pricing = pricingByType[participationPackage];
  if (!pricing) return null;
  if (participantCategory === "international") {
    return { amount: pricing.intl, currency: "USD" };
  }
  const baseAmount = pricing.uz;
  const discount = participantCategory === "apu-member" ? Math.round(baseAmount * DISCOUNT_RATE) : 0;
  return { amount: baseAmount - discount, currency: "UZS" };
};
export {
  onRequest
};
