import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {STUDIO_BASEPATH} from '~/sanity/constants'
import {locate} from '~/sanity/presentation/locate'
import schema from '~/sanity/schemaTypes'
import {defaultDocumentNode, structure} from '~/sanity/structure'

export default defineConfig({
  projectId: 'hch455k6',
  dataset: 'production',
  name: 'sanity-remix',
  title: 'Sanity Remix',
  plugins: [
    structureTool({structure, defaultDocumentNode}),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/resource/preview',
        },
      },
      locate,
    }),
    visionTool(),
  ],
  basePath: STUDIO_BASEPATH,
  schema: {
    types: schema,
  },
})
