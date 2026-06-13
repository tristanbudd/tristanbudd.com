import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

interface SettingModel {
  findUnique(args: { where: { key: string } }): Promise<{ value: string } | null>;
  upsert(args: {
    where: { key: string };
    update: { value: string };
    create: { key: string; value: string };
  }): Promise<{ value: string }>;
}

interface PrismaClientWithSetting {
  setting: SettingModel;
  $transaction(actions: Promise<unknown>[]): Promise<unknown>;
}

// Cast prisma via unknown to avoid local IDE out-of-sync type caching warnings for newly created schemas
const db = prisma as unknown as PrismaClientWithSetting;

export async function GET() {
  try {
    const [modeSetting, keySetting] = await Promise.all([
      db.setting.findUnique({ where: { key: "maintenance_mode" } }),
      db.setting.findUnique({ where: { key: "maintenance_bypass_key" } }),
    ]);

    const isEnvForced = process.env.MAINTENANCE_MODE === "true";
    const maintenanceMode = isEnvForced ? true : modeSetting ? modeSetting.value === "true" : false;

    const bypassKey =
      keySetting && keySetting.value ? keySetting.value : process.env.MAINTENANCE_BYPASS_KEY || "";

    return NextResponse.json({ maintenanceMode, bypassKey, isEnvForced });
  } catch (error) {
    console.error("GET /api/maintenance error:", error);
    const isEnvForced = process.env.MAINTENANCE_MODE === "true";
    return NextResponse.json({
      maintenanceMode: isEnvForced,
      bypassKey: process.env.MAINTENANCE_BYPASS_KEY || "",
      isEnvForced,
    });
  }
}

export async function POST(request: NextRequest) {
  // Authentication check
  const adminSession = request.cookies.get("admin_session")?.value;
  const ownerAccount = process.env.ADMIN_OWNER_ACCOUNT || "tristanbudd";

  if (adminSession !== ownerAccount) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { maintenanceMode, bypassKey } = await request.json();

    if (typeof maintenanceMode !== "boolean" || typeof bypassKey !== "string") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const trimmedKey = bypassKey.trim();
    if (trimmedKey.length < 3) {
      return NextResponse.json(
        { error: "Bypass key must be at least 3 characters long." },
        { status: 400 }
      );
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedKey)) {
      return NextResponse.json(
        { error: "Bypass key can only contain alphanumeric characters, hyphens, and underscores." },
        { status: 400 }
      );
    }

    await db.$transaction([
      db.setting.upsert({
        where: { key: "maintenance_mode" },
        update: { value: String(maintenanceMode) },
        create: { key: "maintenance_mode", value: String(maintenanceMode) },
      }),
      db.setting.upsert({
        where: { key: "maintenance_bypass_key" },
        update: { value: trimmedKey },
        create: { key: "maintenance_bypass_key", value: trimmedKey },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/maintenance error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
