import type {LoaderFunctionArgs} from '@remix-run/node'
import {useFetcher, useLoaderData} from '@remix-run/react'
import {useEffect, useState} from 'react'

import {Records} from '~/components/Records'
import {client} from '~/sanity/client'
import {RECORDS_QUERY} from '~/sanity/queries'
import type {RecordStub} from '~/types/record'

export const loader = async ({request}: LoaderFunctionArgs) => {
  let syncTags: string[] | undefined = []
  let lastLiveEventId: string | null = new URL(request.url).searchParams.get(
    'lastLiveEventId',
  )

  const initial = await client
    .fetch<
      RecordStub[]
    >(RECORDS_QUERY, {}, {filterResponse: false, lastLiveEventId})
    .then((res) => {
      syncTags = res.syncTags
      return res.result
    })

  if (!initial) {
    throw new Response('Not found', {status: 404})
  }

  return {initial, syncTags}
}

export default function Index() {
  const {initial, syncTags} = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof loader>()
  const [data, setData] = useState(initial)

  useEffect(() => {
    const subscription = client.live.events().subscribe((event) => {
      if (
        event.type === 'message' &&
        event.tags.some((t) => syncTags.includes(t))
      ) {
        // This will perform a GET request to the current URL with a search param
        // But it will not revalidate the loader, the updated data is returned to fetcher.data
        fetcher.submit({lastLiveEventId: event.id}, {method: 'GET'})
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetcher, syncTags])

  // Fetcher does not revalidate, so we need to do it manually
  useEffect(() => {
    if (fetcher.data) {
      setData(fetcher.data.initial)
    }
  }, [fetcher.data])

  return <Records records={data} />
}
