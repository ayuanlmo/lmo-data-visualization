export type TConfigTextType = {
    color: string;
    value: string;
    display: boolean;
    fontSize: number;
    align: string;
    width: number;
    height: number;
    x: number;
    y: number;
    key?: string;
};
export type TConfigOtherConfigItemValueType = boolean | number | string;
export type TConfigOtherConfigItemType = {
    label: string;
    key: string;
    type: "switch" | "input" | "input-number" | "color" | "select";
    value: TConfigOtherConfigItemValueType;
} & ({
    type: "select";
    options: Array<{ label: string; value: string; }>
} | {
    type: Exclude<"switch" | "input" | "input-number" | "color", "select">; options?: undefined
});
export type TThemeTypes = 'Gradient' | 'Single' | 'Theme';
export type TClarityTypes = '1080P' | '2K' | '4K';
export type TThemeConfig = {
    type: TThemeTypes;
    configs: Array<TThemeTypes>;
    value: Array<string>;
};
export type TOtherConfigGroup = Array<{
    label: string;
    configs: Array<TConfigOtherConfigItemType>;
}>
export type TOtherConfig = {
    label?: string;
    configs?: Array<TConfigOtherConfigItemType>;
    group?: TOtherConfigGroup;
    values: {
        [key: string]: TConfigOtherConfigItemValueType;
    };
} & ({ configs: Array<TConfigOtherConfigItemType>; group?: never; } | {
    group: TOtherConfigGroup;
    configs?: never;
    label?: never;
});

export interface IConfig {
    text: {
        mainTitle: TConfigTextType;
        subTitle: TConfigTextType;
        fromSource: TConfigTextType;
        [key: string]: TConfigTextType;
    };
    theme: TThemeConfig;
    background: {
        type: string;
        color: string;
        image: string;
        arrangement: string;
    };
    video: {
        duration: number;
        fps: number;
        clarity: TClarityTypes;
    };
    audio: {
        path: string;
        full: boolean;
        volume: number;
    };
}

export interface ITemplateConfig {
    data?: Array<any>;
    config: IConfig;
    otherConfig: TOtherConfig;
    id?: string;
}
