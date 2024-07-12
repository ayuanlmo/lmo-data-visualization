import {ITemplateConfig} from "./scripts/@types/template.ts";

declare global {
    declare interface Window extends Window {
        interact: any;
        echarts: any;
        d3: any;
        captureCtx: any;
        conf: ITemplateConfig;
    }
}

declare const echarts: any;