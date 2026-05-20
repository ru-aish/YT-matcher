import { getCampaignDetailAction } from '../../../../campaign-actions';
import { redirect } from 'next/navigation';
import CampaignDetailClient from './CampaignDetailClient';

export const dynamic = 'force-dynamic';

export default async function CampaignDetailPage({ params }) {
  const resolvedParams = await params;
  const campaignId = resolvedParams.id;

  const res = await getCampaignDetailAction(campaignId);

  if (res.error) {
    redirect(`/dashboard?error=${encodeURIComponent(res.error)}`);
  }

  return <CampaignDetailClient data={res} />;
}
