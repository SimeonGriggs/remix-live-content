import {useRevalidator, useSearchParams} from '@remix-run/react'
import {useEffect} from 'react'

import {client} from '~/sanity/client'

export function SanityLive({syncTags = []}: {syncTags?: string[]}) {
  const revalidator = useRevalidator()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const subscription = client.live.events().subscribe((event) => {
      console.log(event)
      if (
        // If any of the event tags match our stored syncTags, refetch the data, update our local cache and sync tags and "re-render" it.
        (event.type === 'message' &&
          event.tags.some((tag) => syncTags.includes(tag))) ||
        // A restart event is sent when the `lastLiveEventId` we've been given earlier is no longer usable
        event.type === 'restart'
      ) {
        if ('id' in event) {
          setSearchParams(
            {lastLiveEventId: event.id},
            {
              preventScrollReset: true,
            },
          )
        }
        revalidator.revalidate()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return null
}
