export default {
    COPY_TEMPLATE: {
        TEMP: './static/temp/',
        THIS: './static/temp/',
        ORIGIN: './static/DataVisualizationTemplate'
    },
    LOG: {
        PATH: './static/log/'
    },
    SYNTHESIS: {
        CURRENT_TEMPLATE: '/static/temp/$y/index.html\n',
        SERVER: '/static/temp/$y/index.html',
        OUTPUT: 'static/output/$y.mp4'
    },
    PROCESS_AUDIO: {
        PATH: 'static/output/$y.mp4',
        OUTPUT:'static/output/$y264.mp4'
    }
};