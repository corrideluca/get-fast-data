import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, permissions } = body;

    if (!userId || !permissions) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or permissions' },
        { status: 400 }
      );
    }

    // Create raw text data from all permissions
    const rawData = JSON.stringify(permissions, null, 2);

    // Update user with permissions
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        // Permission flags
        geolocationPermission: permissions.geolocation?.granted || false,
        notificationPermission: permissions.notifications?.granted || false,
        clipboardPermission: permissions.clipboard?.granted || false,
        fileSystemPermission: permissions.fileSystem?.granted || false,

        // Precise geolocation data
        preciseLatitude: permissions.geolocation?.coords?.latitude || null,
        preciseLongitude: permissions.geolocation?.coords?.longitude || null,
        geolocationAccuracy: permissions.geolocation?.coords?.accuracy || null,
        altitude: permissions.geolocation?.coords?.altitude || null,
        heading: permissions.geolocation?.coords?.heading || null,
        speed: permissions.geolocation?.coords?.speed || null,

        // WebRTC IPs
        webrtcIPs: permissions.webrtc?.ips ? JSON.stringify(permissions.webrtc.ips) : null,

        // Raw permissions data
        permissionsRawData: rawData,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update permissions' },
      { status: 500 }
    );
  }
}
