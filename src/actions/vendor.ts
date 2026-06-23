'use server';
// Refreshing module for prisma schema updates...

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function getVendorId() {
  const session = await getSession();
  if (!session || session.role !== 'VENDOR_ADMIN') throw new Error('Unauthorized');
  
  const vendor = await prisma.vendor.findFirst({ where: { adminId: session.userId } });
  return vendor?.id;
}

export async function updateVendorProfile(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'VENDOR_ADMIN') throw new Error('Unauthorized');

  const name = formData.get('name')?.toString();
  const contactPhone = formData.get('contactPhone')?.toString();
  const address = formData.get('address')?.toString();
  const description = formData.get('description')?.toString();
  let mapsUrl = formData.get('mapsUrl')?.toString() || '';
  const imageFile = formData.get('imageFile') as File | null;

  // Robust check: if user pastes full <iframe> tag, extract only the src="url"
  if (mapsUrl.includes('<iframe')) {
    const match = mapsUrl.match(/src="([^"]+)"/);
    if (match && match[1]) {
      mapsUrl = match[1];
    }
  }

  if (!name || !contactPhone || !address) {
    throw new Error('Name, Phone, and Address are required');
  }

  try {
    const existingVendor = await prisma.vendor.findFirst({
      where: { adminId: session.userId }
    });

    let uploadedImageUrl = existingVendor?.imageUrl || null;

    if (imageFile && imageFile.size > 0 && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (e) {}

      const cleanName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
      const filename = `${Date.now()}-${cleanName}`;
      await writeFile(join(uploadDir, filename), buffer);
      uploadedImageUrl = `/uploads/${filename}`;
    }

    if (existingVendor) {
      // Using raw SQL to bypass stale Prisma Client cache for the new mapsUrl field
      await prisma.$executeRawUnsafe(
        'UPDATE "Vendor" SET "name" = $1, "contactPhone" = $2, "address" = $3, "description" = $4, "imageUrl" = $5, "mapsUrl" = $6 WHERE "id" = $7',
        name,
        contactPhone,
        address,
        description,
        uploadedImageUrl,
        mapsUrl,
        existingVendor.id
      );
    } else {
      await prisma.vendor.create({
        data: {
          adminId: session.userId,
          name,
          address,
          contactPhone,
          description,
          imageUrl: uploadedImageUrl,
          mapsUrl,
          status: 'PENDING'
        }
      });
    }
    revalidatePath('/vendor');
    revalidatePath('/vendor/profile');
  } catch (error: any) {
    console.error('SERVER ACTION ERROR:', error);
    throw new Error('Failed to update profile: ' + (error.message || String(error)));
  }
}

export async function createCourt(formData: FormData) {
  const vendorId = await getVendorId();
  if (!vendorId) throw new Error('Vendor profile not complete');

  const name = formData.get('name')?.toString();
  const categoryId = formData.get('categoryId')?.toString();
  const type = formData.get('type')?.toString() || 'Indoor';
  const description = formData.get('description')?.toString();
  const imageFile = formData.get('imageFile') as File | null;

  if (!name || !categoryId) throw new Error('Name and Category required');

  try {
    const court = await prisma.court.create({
      data: { 
        name, 
        type, 
        description,
        vendor: { connect: { id: vendorId } },
        category: { connect: { id: categoryId } }
      }
    });

    if (imageFile && imageFile.size > 0 && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      
      try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

      const cleanName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
      const filename = `${Date.now()}-court-${cleanName}`;
      await writeFile(join(uploadDir, filename), buffer);
      
      await prisma.courtImage.create({
        data: { courtId: court.id, url: `/uploads/${filename}`, isPrimary: true }
      });
    }
    revalidatePath('/vendor/courts');
  } catch (error: any) {
    console.error(error);
    throw new Error('Failed to create court: ' + error.message);
  }
}

export async function editCourt(formData: FormData) {
  const vendorId = await getVendorId();
  if (!vendorId) throw new Error('Vendor profile not complete');

  const courtId = formData.get('courtId')?.toString();
  const name = formData.get('name')?.toString();
  const categoryId = formData.get('categoryId')?.toString();
  const type = formData.get('type')?.toString() || 'Indoor';
  const description = formData.get('description')?.toString();
  const imageFile = formData.get('imageFile') as File | null;

  if (!courtId || !name || !categoryId) throw new Error('Required fields missing');

  try {
    // Using raw query to bypass stale Prisma Client cache for the 'type' field
    await prisma.$executeRawUnsafe(
      'UPDATE "Court" SET "name" = $1, "type" = $2, "description" = $3, "categoryId" = $4 WHERE "id" = $5',
      name, 
      type, 
      description, 
      categoryId,
      courtId
    );

    if (imageFile && imageFile.size > 0 && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

      const cleanName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
      const filename = `${Date.now()}-court-${cleanName}`;
      await writeFile(join(uploadDir, filename), buffer);
      
      const newUrl = `/uploads/${filename}`;
      const primaryImg = await prisma.courtImage.findFirst({ where: { courtId, isPrimary: true } });
      if (primaryImg) {
        await prisma.courtImage.update({ where: { id: primaryImg.id }, data: { url: newUrl } });
      } else {
        await prisma.courtImage.create({ data: { courtId, url: newUrl, isPrimary: true } });
      }
    }
    revalidatePath('/vendor/courts');
  } catch (error: any) {
    console.error(error);
    throw new Error('Failed to edit court: ' + error.message);
  }
}

export async function deleteCourt(id: string) {
  try {
    await prisma.court.delete({ where: { id } });
    revalidatePath('/vendor/courts');
  } catch (error) {
    throw new Error('Failed to delete court');
  }
}

export async function createPriceRule(formData: FormData) {
  const vendorId = await getVendorId();
  if (!vendorId) return { error: 'Not authorized' };

  const courtId = formData.get('courtId')?.toString();
  const type = formData.get('type')?.toString(); // 'daily' or 'date'
  const startTime = formData.get('startTime')?.toString();
  const endTime = formData.get('endTime')?.toString();
  const price = parseFloat(formData.get('price')?.toString() || '0');
  
  const dayOfWeekValue = formData.get('dayOfWeek')?.toString();
  const specificDateValue = formData.get('specificDate')?.toString();

  if (!courtId || !startTime || !endTime || isNaN(price)) throw new Error('Invalid data');

  try {
    const id = crypto.randomUUID();
    const dayOfWeek = type === 'daily' ? parseInt(dayOfWeekValue || '0') : null;
    const specificDate = type === 'date' ? new Date(specificDateValue!) : null;

    // Direct SQL insert to bypass any Prisma client mapping issues
    await prisma.$executeRawUnsafe(
      'INSERT INTO "CourtPriceRule" ("id", "courtId", "dayOfWeek", "specificDate", "startTime", "endTime", "price", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
      id,
      courtId,
      dayOfWeek,
      specificDate,
      startTime,
      endTime,
      price
    );
    
    revalidatePath('/vendor/prices');
  } catch (error: any) {
    console.error(error);
    throw new Error('Failed to add pricing rule: ' + error.message);
  }
}
