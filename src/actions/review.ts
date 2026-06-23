'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function submitReview(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Anda harus login.' };

  const bookingId = formData.get('bookingId')?.toString();
  const rating = parseInt(formData.get('rating')?.toString() || '0');
  const reviewText = formData.get('reviewText')?.toString();

  if (!bookingId || rating < 1 || rating > 5) {
    return { error: 'Rating tidak valid.' };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { court: true }
  });

  if (!booking || booking.customerId !== session.userId) {
    return { error: 'Pesanan tidak ditemukan.' };
  }

  // Check if already reviewed
  const existing = await prisma.vendorReview.findUnique({
    where: { bookingId }
  });

  if (existing) return { error: 'Pesanan ini sudah diberi rating.' };

  await prisma.vendorReview.create({
    data: {
      bookingId,
      customerId: session.userId,
      vendorId: booking.court.vendorId,
      rating,
      reviewText,
    }
  });

  revalidatePath('/bookings');
  return { success: true };
}
