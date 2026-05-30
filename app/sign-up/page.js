import AuthForm from '../_components/AuthForm'

export const metadata = {
  title: 'Create your account · YT Matcher',
  description: 'Join YT Matcher as a creator or a brand.',
}

export default async function SignUpPage({ searchParams }) {
  const sp = await searchParams
  const role = sp?.role === 'brand' ? 'brand' : 'creator'
  return <AuthForm mode="up" initialRole={role} />
}
