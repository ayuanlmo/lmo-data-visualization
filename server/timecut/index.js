const timeCut = require('timecut');

module.exports = {
    synthesis: () => {
        timeCut({
            url: 'http://localhost:8080/DataVisualizationTemplate/Histogram/index.html',
            viewport: {
                width: 1920,// sets the viewport (window size) to 800x600
                height: 1080
            },
            selector: '#app',// crops each frame to the bounding box of '#container'
            left: 0,
            top: 0,// further crops the left by 20px, and the top by 40px
            right: 0,
            bottom: 0,// and the right by 6px, and the bottom by 30px
            fps: 24,// saves 30 frames for each virtual second
            duration: 1,// for 20 virtual seconds
            output: 'video.mp4'// to video.mp4 of the current working directory
        }).then(function () {
            console.log('Done!');
        });
    }
};