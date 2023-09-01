interface SettingsOptions {
    colHeaders: boolean;
    rowHeaders: boolean;
    minRows: number;
    minCols: number;
    manualColumnFreeze: boolean;
    manualColumnMove: boolean;
    manualRowMove: boolean;
    manualColumnResize: boolean;
    manualRowResize: boolean;
}

export interface AppConfig {
    // 这是一个免费授权的许可证。如果您有商业行为，请使用商业许可证
    licenseKey: string;
    settings: SettingsOptions;
}

const config: AppConfig = {
    licenseKey: 'non-commercial-and-evaluation',
    settings: {
        colHeaders: true,
        rowHeaders: true,
        minRows: 29,
        minCols: 17,
        manualColumnFreeze: true,
        manualColumnMove: true,
        manualRowMove: true,
        manualColumnResize: true,
        manualRowResize: true
    }
};

export default config;
