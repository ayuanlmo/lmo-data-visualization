/**
 * Functions
 * @author ayuanlmo
 * @module fs-extra
 * @module path
 * Created by ayuanlmo on 2022/06
 * **/

const _FS = require('fs-extra');

module.exports = {
    __GET_SUCCESS_MESSAGE: (data = {}) => {
        return {
            data: data,
            message: 'success',
            code: 200,
            _t: new Date().getTime()
        };
    },
    async __GET_TEMPLATE_LIST(r) {
        await _FS.readdir('./static/DataVisualizationTemplate', (err, data) => {
            const _ = [];

            data.forEach(i => {
                _.push(
                    {
                        id: `lmo_data_visualization_template_${i}`,
                        url: `/static/DataVisualizationTemplate/${i}/index.html`,
                        cover: `/static/DataVisualizationTemplate/${i}/cover.png`,
                        template: `${i}`,
                        ...require('./const/templateIndex')[i]
                    }
                );
            });
            r.json(
                require('./funcs').__GET_SUCCESS_MESSAGE({
                    list: _
                })
            );
        });
    },
    __GET_MEDIA: (r) => {
        const _outputDir = './static/output';

        if (!_FS.existsSync(_outputDir)) {
            _FS.mkdir(_outputDir);
        }
        _FS.readdir('./static/output', (err, data) => {
            const _ = [];

            data.forEach(i => {
                if (i.split('.')[1] === 'mp4') {
                    _.push({
                        name: i,
                        path: `/static/output/${i}`
                    });
                }
            });
            r.json(
                require('./funcs').__GET_SUCCESS_MESSAGE({
                    list: _
                })
            );
        });
    },
    __STRINGIFY(data = {}) {
        return JSON.stringify(data);
    }
};