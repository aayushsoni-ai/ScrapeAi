import { SubscriptionEntitlementQuery } from '@/convex/query.config';
import { redirect } from 'next/navigation';
import { combinedSlug } from '@/lib/utils';

const DashboardPage = async() => {
    const {entitlement, profile: profileName} = await SubscriptionEntitlementQuery()
    if(!entitlement._valueJSON){
        // redirect(`billing/${combinedSlug(profileName!)}`)
        redirect(`/dashboard/${combinedSlug(profileName!)}`)
    }
    redirect(`/dashboard/${combinedSlug(profileName!)}`)
}
export default DashboardPage