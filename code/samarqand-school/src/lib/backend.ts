const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_BACKEND = import.meta.env.PROD || Boolean(import.meta.env.VITE_API_BASE_URL);

export interface RegistrationFormData {
  name: string;
  birthdate: string;
  email: string;
  password?: string;
  phone: string;
  telegram: string;
  city: string;
  country: string;
  organization: string;
  position: string;
  specialty: string;
  specialtyOther: string;
  experience: string;
  participationType: string;
  participationPackage?: string;
  participantCategory: string;
  membershipProof: File | null;
  consentData: boolean;
  consentRules: boolean;
  consentMedia: boolean;
}

export interface News {
  id: string;
  title_en: string;
  title_ru: string;
  title_uz: string;
  content_en: string;
  content_ru: string;
  content_uz: string;
  published_at: string;
  is_published: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string | null;
  registrationId: string | null;
}

export interface ParticipantOverview {
  user: AuthUser;
  registration: Record<string, unknown> | null;
  payment: Record<string, unknown> | null;
  submissions: Record<string, unknown>[];
}

const buildUrl = (path: string) => {
  if (!API_BASE_URL) {
    return path;
  }
  const normalizedBase = API_BASE_URL.endsWith('/')
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  return `${normalizedBase}${path}`;
};

export async function submitRegistration(data: RegistrationFormData): Promise<{ success: boolean; error?: string }> {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('birthdate', data.birthdate);
  formData.append('email', data.email);
  formData.append('password', data.password ?? '');
  formData.append('phone', data.phone);
  formData.append('telegram', data.telegram);
  formData.append('city', data.city);
  formData.append('country', data.country);
  formData.append('organization', data.organization);
  formData.append('position', data.position);
  formData.append('specialty', data.specialty);
  formData.append('specialtyOther', data.specialtyOther);
  formData.append('experience', data.experience);
  formData.append('participationType', data.participationType);
  formData.append('participationPackage', data.participationPackage ?? '');
  formData.append('participantCategory', data.participantCategory);
  formData.append('consentData', String(data.consentData));
  formData.append('consentRules', String(data.consentRules));
  formData.append('consentMedia', String(data.consentMedia));

  if (data.membershipProof) {
    formData.append('membershipProof', data.membershipProof, data.membershipProof.name);
  }

  try {
    const response = await fetch(buildUrl('/api/registration'), {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 409) {
        return { success: false, error: 'Email already registered' };
      }
      return { success: false, error: 'Request failed' };
    }

    const payload = await response.json().catch(() => ({}));
    if (payload?.success) {
      return { success: true };
    }
    return { success: false, error: payload?.error || 'Request failed' };
  } catch (error) {
    console.error('Registration submit error:', error);
    return { success: false, error: 'Connection error' };
  }
}

export async function getRegistrationCount(): Promise<number> {
  try {
    const response = await fetch(buildUrl('/api/registration-count'), { credentials: 'include' });
    if (!response.ok) {
      return 0;
    }
    const payload = await response.json().catch(() => ({}));
    if (typeof payload?.count === 'number') {
      return payload.count;
    }
    return 0;
  } catch (error) {
    console.error('Registration count error:', error);
    return 0;
  }
}

export async function getPublishedNews(): Promise<News[]> {
  try {
    const response = await fetch(buildUrl('/api/news'), { credentials: 'include' });
    if (!response.ok) {
      return [];
    }
    const payload = await response.json().catch(() => []);
    return Array.isArray(payload) ? payload : [];
  } catch (error) {
    console.error('News fetch error:', error);
    return [];
  }
}

export const isBackendConfigured = USE_BACKEND;

export async function login(email: string, password: string, role?: string) {
  const response = await fetch(buildUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
    credentials: 'include',
  });

  if (!response.ok) {
    return { success: false, error: 'Invalid credentials' };
  }

  const payload = await response.json().catch(() => ({}));
  return payload?.success ? payload : { success: false, error: payload?.error || 'Login failed' };
}

export async function logout() {
  await fetch(buildUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(buildUrl('/api/auth/me'), { credentials: 'include' });
  if (!response.ok) {
    return null;
  }
  const payload = await response.json().catch(() => ({}));
  return payload?.user || null;
}

export async function getParticipantOverview(): Promise<ParticipantOverview | null> {
  const response = await fetch(buildUrl('/api/participant/overview'), { credentials: 'include' });
  if (!response.ok) {
    return null;
  }
  const payload = await response.json().catch(() => ({}));
  return payload?.success ? payload : null;
}

export async function uploadPaymentReceipt(paymentId: string, file: File) {
  const formData = new FormData();
  formData.append('paymentId', paymentId);
  formData.append('receipt', file, file.name);

  const response = await fetch(buildUrl('/api/participant/receipt'), {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  return response.ok;
}

export async function submitMaterial(type: string, title: string, file: File) {
  const formData = new FormData();
  formData.append('type', type);
  formData.append('title', title);
  formData.append('file', file, file.name);

  const response = await fetch(buildUrl('/api/participant/submissions'), {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  return response.ok;
}

export async function getAdminRegistrations() {
  const response = await fetch(buildUrl('/api/admin/registrations'), { credentials: 'include' });
  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    return [];
  }
  const payload = await response.json().catch(() => ({}));
  return payload?.registrations || [];
}

export async function confirmPayment(paymentId: string) {
  const response = await fetch(buildUrl('/api/admin/payments/confirm'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId }),
    credentials: 'include',
  });
  return response.ok;
}

export async function rejectPayment(paymentId: string, reason: string) {
  const response = await fetch(buildUrl('/api/admin/payments/reject'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, reason }),
    credentials: 'include',
  });
  return response.ok;
}

export async function getAdminSubmissions() {
  const response = await fetch(buildUrl('/api/admin/submissions'), { credentials: 'include' });
  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    return [];
  }
  const payload = await response.json().catch(() => ({}));
  return payload?.submissions || [];
}

export async function getDevSummary() {
  const response = await fetch(buildUrl('/api/dev/summary'), { credentials: 'include' });
  if (!response.ok) {
    return null;
  }
  return response.json().catch(() => null);
}

export async function createDevUser(email: string, password: string, role: string, name: string) {
  const response = await fetch(buildUrl('/api/dev/create-user'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role, name }),
    credentials: 'include',
  });
  return response.ok;
}

export async function impersonateUser(userId: string) {
  const response = await fetch(buildUrl('/api/dev/impersonate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
    credentials: 'include',
  });
  return response.ok;
}

export async function getAdminNews() {
  const response = await fetch(buildUrl('/api/admin/news'), { credentials: 'include' });
  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    return [];
  }
  const payload = await response.json().catch(() => ({}));
  return payload?.news || [];
}

export async function createNews(data: {
  title_en: string;
  title_ru: string;
  title_uz: string;
  content_en: string;
  content_ru: string;
  content_uz: string;
  is_published: boolean;
}) {
  const response = await fetch(buildUrl('/api/admin/news'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    return { success: false };
  }
  const payload = await response.json().catch(() => ({}));
  return payload?.success ? { success: true, id: payload.id } : { success: false };
}

export async function updateNews(id: string, data: {
  title_en?: string;
  title_ru?: string;
  title_uz?: string;
  content_en?: string;
  content_ru?: string;
  content_uz?: string;
  is_published?: boolean;
}) {
  const response = await fetch(buildUrl('/api/admin/news'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
    credentials: 'include',
  });
  return response.ok;
}

export async function deleteNews(id: string) {
  const response = await fetch(buildUrl(`/api/admin/news?id=${encodeURIComponent(id)}`), {
    method: 'DELETE',
    credentials: 'include',
  });
  return response.ok;
}
