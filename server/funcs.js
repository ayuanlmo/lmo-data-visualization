module.exports = {
    _getSuccessMessage: (data = {}) => {
        return {
            data: data,
            message: 'success',
            code: 200,
            _t: new Date().getTime()
        };
    },
    _getTemplateList: async (r) => {
        await require('fs').readdir('./static/DataVisualizationTemplate', (err, data) => {
            const _ = [];

            data.forEach(i => {
                _.push(
                    {
                        id: `lmo_data_visualization_template_${i}`,
                        url: `/static/DataVisualizationTemplate/${i}/index.html`,
                        cover: `/static/DataVisualizationTemplate/${i}/cover.png`,
                        ...require('./const/templateIndex')[i]
                    }
                );
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