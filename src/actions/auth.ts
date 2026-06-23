'use server';

import { setSession, clearSession, getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';

export async function registerCustomer(prevState: any, formData: FormData) {
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const phone = formData.get('phone')?.toString();
  const password = formData.get('password')?.toString();

  if (!name || !email || !password) {
    return { error: 'Nama, Email, dan Password harus diisi.' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'Email sudah terdaftar.' };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash: password, // plaintext for prototype simplicity
      role: 'CUSTOMER'
    }
  });

  return { success: 'Akun berhasil dibuat! Silakan masuk menggunakan email dan password Anda.' };
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) return { error: 'Email dan Password wajib diisi.' };

  // Hardcode explicit admin bypass for easy testing if no admin present
  if (email === 'admin@padel.com' && password === 'admin') {
    await setSession({ userId: 'admin', role: 'SUPER_ADMIN', name: 'Super Admin' });
    redirect('/admin');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.passwordHash !== password) {
    return { error: 'Email atau password salah.' };
  }

  await setSession({
    userId: user.id,
    role: user.role as any,
    name: user.name,
  });

  if (user.role === 'SUPER_ADMIN') redirect('/admin');
  if (user.role === 'VENDOR_ADMIN') redirect('/vendor');
  redirect('/');
}

export async function logout() {
  await clearSession();
  redirect('/');
}

export async function changePassword(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Anda harus login.' };

  const currentPassword = formData.get('currentPassword')?.toString();
  const newPassword = formData.get('newPassword')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Semua kolom wajib diisi.' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Konfirmasi password baru tidak cocok.' };
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.passwordHash !== currentPassword) {
    return { error: 'Password saat ini salah.' };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { passwordHash: newPassword }
  });

  return { success: 'Password berhasil diubah.' };
}

export async function requestPasswordReset(prevState: any, formData: FormData) {
  const email = formData.get('email')?.toString();
  if (!email) return { error: 'Email wajib diisi.' };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Return success anyway for security (don't reveal if email exists)
    return { success: 'Jika email terdaftar, instruksi reset akan dikirim.' };
  }

  const token = randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 3600000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry }
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  // LOGGING TO CONSOLE because no email service configured
  console.log('\n--- FORGOT PASSWORD RESET LINK ---');
  console.log('User:', email);
  console.log('Link:', resetUrl);
  console.log('----------------------------------\n');

  return { success: 'Instruksi reset telah dikirim ke email (Lihat log terminal untuk link).' };
}

export async function resetPassword(prevState: any, formData: FormData) {
  const token = formData.get('token')?.toString();
  const newPassword = formData.get('newPassword')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();

  if (!token || !newPassword || !confirmPassword) return { error: 'Data tidak lengkap.' };
  if (newPassword !== confirmPassword) return { error: 'Password tidak cocok.' };

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() }
    }
  });

  if (!user) return { error: 'Token tidak valid atau sudah kadaluarsa.' };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  });

  return { success: 'Password berhasil diperbarui. Silakan login.' };
}
