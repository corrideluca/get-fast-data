import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to parse user agent
function parseUserAgent(ua: string) {
  const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/?([\d.]+)/);
  const osMatch = ua.match(/(Windows|Mac|Linux|Android|iOS)/);

  return {
    browser: browserMatch ? browserMatch[1] : 'Unknown',
    browserVersion: browserMatch ? browserMatch[2] : 'Unknown',
    os: osMatch ? osMatch[1] : 'Unknown',
  };
}

// Helper to get location from IP (using ipapi.co free API)
async function getLocationFromIP(ip: string) {
  try {
    // Skip for localhost/private IPs
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return null;
    }

    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || null,
        city: data.city || null,
        region: data.region || null,
        timezone: data.timezone || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      };
    }
  } catch (error) {
    // Silent error handling
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get IP address from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] :
               request.headers.get('x-real-ip') ||
               '127.0.0.1';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const { browser, browserVersion, os } = parseUserAgent(userAgent);

    // Get location data from IP
    const locationData = await getLocationFromIP(ip);

    // Check if user exists by IP
    const existingUser = await prisma.user.findFirst({
      where: { ipAddress: ip }
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          visitCount: existingUser.visitCount + 1,
          lastVisit: new Date(),
          userAgent,
          browser,
          browserVersion,
          os,
          platform: body.platform || null,
          device: body.device || null,
          screenWidth: body.screenWidth || null,
          screenHeight: body.screenHeight || null,
          windowWidth: body.windowWidth || null,
          windowHeight: body.windowHeight || null,
          colorDepth: body.colorDepth || null,
          language: body.language || null,
          cookiesEnabled: body.cookiesEnabled || null,
          referrer: body.referrer || null,
          ...locationData,
        },
      });

      return NextResponse.json({
        success: true,
        userId: updatedUser.id,
        returning: true
      });
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          ipAddress: ip,
          userAgent,
          browser,
          browserVersion,
          os,
          platform: body.platform || null,
          device: body.device || null,
          screenWidth: body.screenWidth || null,
          screenHeight: body.screenHeight || null,
          windowWidth: body.windowWidth || null,
          windowHeight: body.windowHeight || null,
          colorDepth: body.colorDepth || null,
          language: body.language || null,
          cookiesEnabled: body.cookiesEnabled || null,
          referrer: body.referrer || null,
          ...locationData,
        },
      });

      return NextResponse.json({
        success: true,
        userId: newUser.id,
        returning: false
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to track user' },
      { status: 500 }
    );
  }
}
