import React from 'react'
import Navbar from '@/components/sections/Navbar'
import { SubscriptionEntitlementQuery } from '@/convex/query.config'
import { combinedSlug } from '@/lib/utils'
import { redirect } from 'next/navigation'

type Props = {
  children: React.ReactNode
}

const WorkspaceLayout = async ({ children }: Props) => {
  const { entitlement, profile: profileName } = await SubscriptionEntitlementQuery()
  if (!entitlement._valueJSON) {
    redirect(`/billing/${combinedSlug(profileName!)}`)
  }
  return <div className='grid grid-cols-1'>
    <Navbar />
    {children}</div>

}

export default WorkspaceLayout