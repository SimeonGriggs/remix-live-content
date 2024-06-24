import type {LoaderFunctionArgs} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'

import {Records} from '~/components/Records'
import {client} from '~/sanity/client'
import {RECORDS_QUERY} from '~/sanity/queries'
import type {RecordStub} from '~/types/record'

export const loader = async ({request}: LoaderFunctionArgs) => {
  const initial = await client.fetch<RecordStub[]>(RECORDS_QUERY)

  if (!initial) {
    throw new Response('Not found', {status: 404})
  }

  return {initial}
}

export default function Index() {
  const {initial} = useLoaderData<typeof loader>()

  return <Records records={initial} />
}
