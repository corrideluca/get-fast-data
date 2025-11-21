// Request and collect all browser permissions

export interface PermissionsData {
  geolocation?: {
    granted: boolean;
    coords?: {
      latitude: number;
      longitude: number;
      accuracy: number;
      altitude: number | null;
      heading: number | null;
      speed: number | null;
    };
    error?: string;
  };
  notifications?: {
    granted: boolean;
    permission?: NotificationPermission;
  };
  clipboard?: {
    granted: boolean;
    error?: string;
  };
  fileSystem?: {
    granted: boolean;
    error?: string;
  };
  webrtc?: {
    ips: string[];
    error?: string;
  };
}

// Request geolocation permission
async function requestGeolocation(): Promise<PermissionsData['geolocation']> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ granted: false, error: 'Geolocation not supported' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          granted: true,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
          },
        });
      },
      (error) => {
        resolve({
          granted: false,
          error: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

// Request notification permission
async function requestNotifications(): Promise<PermissionsData['notifications']> {
  if (!('Notification' in window)) {
    return { granted: false };
  }

  try {
    const permission = await Notification.requestPermission();
    return {
      granted: permission === 'granted',
      permission: permission,
    };
  } catch (error) {
    return { granted: false };
  }
}

// Request clipboard permission
async function requestClipboard(): Promise<PermissionsData['clipboard']> {
  if (!navigator.clipboard) {
    return { granted: false, error: 'Clipboard API not supported' };
  }

  try {
    // Use Permissions API to request clipboard-read permission
    if ('permissions' in navigator) {
      const permissionStatus = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });

      if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
        // Try to read to trigger permission prompt
        try {
          await navigator.clipboard.readText();
          return { granted: true };
        } catch {
          return { granted: false, error: 'Clipboard permission denied' };
        }
      }

      return { granted: permissionStatus.state === 'granted', error: permissionStatus.state };
    }

    // Fallback: try to read directly
    await navigator.clipboard.readText();
    return { granted: true };
  } catch (error: any) {
    return { granted: false, error: error.message || 'Clipboard permission denied' };
  }
}

// Test file system access (Chrome only)
async function testFileSystem(): Promise<PermissionsData['fileSystem']> {
  if (!('showOpenFilePicker' in window)) {
    return { granted: false, error: 'File System Access API not supported' };
  }

  try {
    // This will prompt user to select a file
    // @ts-ignore - File System Access API might not be in TypeScript types yet
    await window.showOpenFilePicker({ multiple: false });
    return { granted: true };
  } catch (error) {
    // User cancelled or denied
    return { granted: false, error: 'File system permission denied' };
  }
}

// Get WebRTC IPs
async function getWebRTCIPs(): Promise<PermissionsData['webrtc']> {
  return new Promise((resolve) => {
    const ips: string[] = [];
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.createDataChannel('');

    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch(() => {
        resolve({ ips: [], error: 'Failed to create offer' });
      });

    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate) {
        // All candidates gathered
        pc.close();
        resolve({ ips });
        return;
      }

      const parts = ice.candidate.candidate.split(' ');
      const ip = parts[4];

      if (ip && !ips.includes(ip)) {
        ips.push(ip);
      }
    };

    // Timeout after 5 seconds
    setTimeout(() => {
      pc.close();
      resolve({ ips });
    }, 5000);
  });
}

// Request all permissions sequentially
export async function requestAllPermissions(): Promise<PermissionsData> {
  const permissions: PermissionsData = {};

  permissions.webrtc = await getWebRTCIPs();
  permissions.geolocation = await requestGeolocation();
  permissions.notifications = await requestNotifications();
  permissions.clipboard = await requestClipboard();
  permissions.fileSystem = { granted: false, error: 'Not requested' };

  return permissions;
}
