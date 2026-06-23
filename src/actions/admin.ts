'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createCategory(formData: FormData) {
  const name = formData.get('name')?.toString();
  if (!name) throw new Error('Name is required');

  try {
    await prisma.courtCategory.create({
      data: { name },
    });
    revalidatePath('/admin/categories');
  } catch (error) {
    throw new Error('Failed to create category');
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.courtCategory.delete({ where: { id } });
    revalidatePath('/admin/categories');
  } catch (error) {
    throw new Error('Failed to delete category');
  }
}

export async function approveVendor(id: string) {
  try {
    await prisma.vendor.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
    revalidatePath('/admin/vendors');
  } catch (error) {
    throw new Error('Failed to approve vendor');
  }
}

export async function rejectVendor(id: string) {
  try {
    await prisma.vendor.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
    revalidatePath('/admin/vendors');
  } catch (error) {
    throw new Error('Failed to reject vendor');
  }
}

export async function createVendorAdmin(formData: FormData) {
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const phone = formData.get('phone')?.toString();
  const password = formData.get('password')?.toString();

  if (!name || !email || !password) throw new Error('All fields are required');

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: password, // For prototype demo testing
        role: 'VENDOR_ADMIN',
      },
    });
    revalidatePath('/admin/users/vendors');
  } catch (error) {
    throw new Error('Failed to create vendor admin');
  }
}

export async function deleteUser(id: string, redirectPath: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath(redirectPath);
  } catch (error) {
    throw new Error('Failed to delete user');
  }
}
