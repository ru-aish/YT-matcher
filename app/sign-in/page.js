import AuthForm from '../_components/AuthForm'

export const metadata = {
  title: 'Sign in · YT Matcher',
  description: 'Sign in to your YT Matcher account.',
}

export default async function SignInPage({ searchParams }) {
  const sp = await searchParams
  const role = sp?.role === 'brand' ? 'brand' : 'creator'
  return <AuthForm mode="in" initialRole={role} />
}
