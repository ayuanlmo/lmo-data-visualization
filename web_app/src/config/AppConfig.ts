export type AppConfigStorage = 'local' | 'session';

const AppConfig = {
    appName: 'lmo-Data-Visualization',
    appAuthor: 'ayuanlmo',
    title: 'lmo-Data-Visualization',
    storageOptions: {
        namespace: '_lmo_',
        storage: 'local' as AppConfigStorage
    },
    pages: {
        welcome: true
    },
    openSource: {
        github: 'https://github.com/ayuanlmo/lmo-data-visualization'
    }
} as const;

export default AppConfig;
