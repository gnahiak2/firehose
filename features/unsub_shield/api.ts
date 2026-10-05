import { getPrisma } from '../../utils/index.js';

export async function isUnsubOptedOut(userId: string): Promise<boolean> {
    const prisma = getPrisma();
    const row = await prisma.unsubOptOut.findUnique({ where: { userId } });
    return row !== null;
}

export async function setUnsubOptOut(userId: string, optedOut: boolean): Promise<boolean> {
    const prisma = getPrisma();
    if (optedOut) {
        await prisma.unsubOptOut.upsert({ where: { userId }, update: {}, create: { userId } });
    } else {
        await prisma.unsubOptOut.deleteMany({ where: { userId } });
    }
    return optedOut;
}

export async function toggleUnsubOptOut(userId: string): Promise<boolean> {
    const current = await isUnsubOptedOut(userId);
    return await setUnsubOptOut(userId, !current);
}
