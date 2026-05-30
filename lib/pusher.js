import Pusher from 'pusher';

let pusherInstance = null;

function cleanEnvVar(value) {
  if (!value) return '';
  return value.replace(/['"]/g, '').trim();
}

export function getPusherServer() {
  if (pusherInstance) {
    return pusherInstance;
  }

  const appId = cleanEnvVar(process.env.PUSHER_APP_ID || process.env.app_id);
  const key = cleanEnvVar(process.env.PUSHER_KEY || process.env.key);
  const secret = cleanEnvVar(process.env.PUSHER_SECRET || process.env.secret);
  const cluster = cleanEnvVar(process.env.PUSHER_CLUSTER || process.env.cluster);

  if (!appId || !key || !secret || !cluster) {
    return null;
  }

  pusherInstance = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });

  return pusherInstance;
}
