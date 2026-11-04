export const DECODES = {
    CPU: {
        H264: 'libx264',
        H265: 'libx265',
        VP8: 'libvpx',
        VP9: 'libvpx-vp9'
    },
    INTEL: {
        H264: 'h264_qsv',
        H265: 'hevc_qsv',
        VP8: 'vp8_qsv',
        VP9: 'vp9_qsv'
    },
    VAAPI: {
        H264: 'h264_vaapi',
        H265: 'hevc_vaapi',
        VP8: 'vp8_vaapi',
        VP9: 'vp9_vaapi'
    },
    AMD: {
        H264: 'h264_amf',
        H265: 'h265_amf'
    },
    NVIDIA: {
        H264: 'h264_nvenc',
        H265: 'hevc_nvenc'
    },
    OMX: {
        H264: 'h264_videotoolbox',
        H265: 'hevc_videotoolbox'
    },
    VIDEOTOOLBOX: {
        H264: 'h264_omx'
    },
    V4L2: {
        H264: 'h264_v4l2m2m'
    }
};
