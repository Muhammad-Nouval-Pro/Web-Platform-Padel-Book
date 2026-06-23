'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBooking(formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/login');

  const courtId = formData.get('courtId')?.toString();
  const dateStr = formData.get('date')?.toString();
  const startTime = formData.get('startTime')?.toString(); // e.g. "08:00"
  const duration = parseInt(formData.get('duration')?.toString() || '1'); // in hours
  const totalPrice = parseFloat(formData.get('totalPrice')?.toString() || '0');

  if (!courtId || !dateStr || !startTime) {
    throw new Error('Missing booking details');
  }

  const startDatetime = new Date(`${dateStr}T${startTime}:00`);
  const endDatetime = new Date(startDatetime.getTime() + duration * 60 * 60 * 1000);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check for overlapping bookings (Concurrency Validation)
      const overlap = await tx.booking.findFirst({
        where: {
          courtId,
          status: { not: 'CANCELLED' },
          OR: [
            {
              startDatetime: { lt: endDatetime },
              endDatetime: { gt: startDatetime }
            }
          ]
        }
      });

      if (overlap) {
        throw new Error('Maaf, slot waktu ini sudah dipesan oleh orang lain baru saja.');
      }

      // 2. Create the booking
      return await tx.booking.create({
        data: {
          customerId: session.userId,
          courtId,
          startDatetime,
          endDatetime,
          totalPrice,
          status: 'PENDING' // Start as pending
        }
      });
    });

    revalidatePath('/bookings');
    revalidatePath(`/venue/${courtId}`); // Revalidate venue page to show updated slots
    return { success: true, bookingId: result.id };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function simulatePayment(bookingId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  try {
    await prisma.booking.update({
      where: { id: bookingId, customerId: session.userId },
      data: { status: 'PAID' }
    });
    revalidatePath('/bookings');
    return { success: true };
  } catch (error) {
    throw new Error('Failed to process payment');
  }
}

export async function getBookedSlots(courtId: string, dateStr: string) {
  const startOfDay = new Date(`${dateStr}T00:00:00`);
  const nextDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      courtId,
      status: { not: 'CANCELLED' },
      startDatetime: { gte: startOfDay },
      endDatetime: { lte: nextDay }
    },
    select: {
      startDatetime: true,
      endDatetime: true
    }
  });

  return bookings.map(b => {
    let endHour = b.endDatetime.getHours();
    // If it's midnight of the next day, set it to 24
    if (endHour === 0 && b.endDatetime.getDate() !== b.startDatetime.getDate()) {
      endHour = 24;
    }
    return {
      start: b.startDatetime.getHours(),
      end: endHour
    };
  });
}

