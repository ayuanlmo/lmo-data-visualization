import defaultConfigs from "../../scripts/defaultConfigs.js";

export default {
    data: null,
    defaultData: null,
    config: {
        text: {
            mainTitle: {
                color: '#fff',
                value: '主标题',
                display: true,
                fontSize: 20,
                align: 'left',
                width: 100,
                height: 100,
                x: 0,
                y: 0
            }
        }
    },
    titleAnimateName: 'rubberBand',
    titleAnimateDuration: 2000,
    themeColor: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
    ...defaultConfigs,
    themeColorKey: 0,
    background: {
        color: '#0C2856',
        image: '',
        arrange: '0% 0% / 100% 100%'
    },
    duration: 5000
}
