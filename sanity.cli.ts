import {defineCliConfig} from 'sanity/cli'

// We can assume this file will only
// be read in a Node.js environment
// where process is defined
export default defineCliConfig({
  api: {
    projectId: 'hch455k6',
    dataset: 'production',
  },
})
