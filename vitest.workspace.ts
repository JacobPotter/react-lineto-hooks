import {defineWorkspace} from 'vitest/config'

export default defineWorkspace([
    // If you want to keep running your existing tests in Node.js, uncomment the next line.
    // 'vite.config.ts',
    {
        extends: 'vite.config.ts',

        test: {
            browser: {
                enabled: true,
                name: 'chromium',
                provider: 'playwright',
                // https://playwright.dev
                providerOptions: {playwright: {launch: {devtools: true}}},

            },
            css: true,
            setupFiles: ['./lib/setupTests.ts'],
            includeTaskLocation: true,


        },

    },
])
