import { SubscriptionEntitlementQuery } from '@/convex/query.config';
import { redirect } from 'next/navigation';
import { combinedSlug } from '@/lib/utils';

const DashboardPage = async () => {
    const { profile: profileName } = await SubscriptionEntitlementQuery()
    redirect(`/dashboard/${combinedSlug(profileName!)}`)
}
export default DashboardPage