const fs = require('fs-extra');

module.exports = {
    _getSuccessMessage: (data = {}) => {
        return {
            data: data,
            message: 'success',
            code: 200,
            _t: new Date().getTime()
        };
    },
    async _getTemplateList(r) {
        await fs.readdir('./static/DataVisualizationTemplate', (err, data) => {
            const _ = [];
            const T_DB = new (require('./lib/sqlite/index').T_DB);

            T_DB._QUERY_TEMPLATE_LIST().then(res => {
                res.map(i => {
                    _.push({
                        id: i['T_Id'],
                        url: i['T_Path'],
                        cover: `/static/DataVisualizationTemplate/${i['T_Name']}/cover.png`,
                        template: i['T_Name'],
                        title: i['T_Title'],
                        description: i['T_Description']
                    });
                });
                r.json(
                    require('./funcs')._getSuccessMessage({
                        list: _
                    })
                );
                T_DB._CLOSE();
            });
        });
    },
    _getMedia: (r) => {
        const _outputDir = './static/output';

        if (!fs.existsSync(_outputDir)) {
            fs.mkdir(_outputDir);
        }
        fs.readdir('./static/output', (err, data) => {
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
                require('./funcs')._getSuccessMessage({
                    list: _
                })
            );
        });
    },
    _stringify(data = {}) {
        return JSON.stringify(data);
    }
};