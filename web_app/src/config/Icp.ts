export interface SiteInfoConfig {
    icpFilingNo: string; // ICP备案号
    publicSecurityNetworkFilingNo: string; // 公安备案号
}

const config: SiteInfoConfig = {
    icpFilingNo: '冀ICP备00000000号',
    publicSecurityNetworkFilingNo: '冀公网安备51000000000000号'
};

export default config;
