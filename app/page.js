import { redirect } from 'next/navigation';

export default function HomePage() {
  const isDevBypass =
    process.env.DEV_AUTH_BYPASS === 'true' ||
    process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';

  if (isDevBypass) {
    redirect('/test-bypass?role=brand&redirect=/dashboard');
  }

  redirect('/dashboard');
}
