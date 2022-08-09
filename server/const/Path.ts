module.exports = {
    COPY_TEMPLATE: {
        TEMP: './static/temp/',
        THIS: './static/temp/',
        ORIGIN: './static/DataVisualizationTemplate'
    },
    LOG: {
        PATH: './static/log/'
    },
    SYNTHESIS: {
        CURRENT_TEMPLATE: '/static/temp/$t/index.html\n',
        SERVER: '/static/temp/$t/index.html',
        OUTPUT: 'static/output/$t.mp4'
    },
    PROCESS_AUDIO: {
        PATH: 'static/output/$t.mp4',
        OUTPUT:'static/output/$t264.mp4'
    }
};