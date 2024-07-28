export type TThemeTypes = Readonly<'Gradient' | 'Single' | 'Theme'>;
export type TClarityTypes = Readonly<'1080P' | '2K' | '4K'>;
export type TConfigOtherConfigItemValueType = boolean | number | string;
export type TOtherConfigItemComponentType = "switch" | "input" | "input-number" | "color" | "select";

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
    readonly key?: string;
};

export type TConfigOtherConfigItemType = Readonly<{
        label: string;
        key: string;
        type: TOtherConfigItemComponentType;
        value: TConfigOtherConfigItemValueType;
    }>
    & (Readonly<{
        type: "select";
        options: Array<{
            label: string;
            value: string;
        }>;
    }>
    |
    Readonly<{
        type: Exclude<Exclude<TOtherConfigItemComponentType, "select">, "select">;
        options?: never;
    }>);

export type TThemeConfig = Readonly<{
    type: TThemeTypes;
    configs: Array<TThemeTypes>;
    value: Array<string>;
}>;

export type TOtherConfigGroup = Readonly<Array<{
    label: string;
    configs: Array<TConfigOtherConfigItemType>;
}>>;

export type TOtherConfig = {
    readonly label?: string;
    readonly configs?: Array<TConfigOtherConfigItemType>;
    readonly group?: TOtherConfigGroup;
    values: {
        [key: string]: TConfigOtherConfigItemValueType;
    };
} & (
    Readonly<{
        configs: Array<TConfigOtherConfigItemType>;
        group?: never;
    }>
    |
    Readonly<{
        group: TOtherConfigGroup;
        configs?: never;
        label?: never;
    }>);

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
    readonly id?: string;
}
