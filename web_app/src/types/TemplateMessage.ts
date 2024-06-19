export type TTemplateTextConfigAlignType = 'left' | 'center' | 'right';

export type TTemplateMessageType =
    'TEMPLATE_RENDER'
    | 'TEMPLATE_RENDER_FINISH'
    | 'TEMPLATE_RENDER_ERROR'
    | 'TEMPLATE_FULL_CONFIG'
    | 'TEMPLATE_SELECT_TEXT_ELEMENT'
    | 'TEMPLATE_SELECT_TEXT_CLOSE'
    | 'TEMPLATE_DATA'
    | 'GET_TEMPLATE_DATA'
    | 'GET_CONFIG';

export type TDesignAppMessageType =
    'SET_DATA' // 设置数据
    | 'SET_TEXT_CONFIG' // 设置文字配置
    | 'SET_COLOR_MODE' // 设置颜色模式
    | 'SET_COLOR_CONFIG' // 设置颜色配置
    | 'SET_THEME_COLOR' // 设置主题颜色
    | 'SET_BACKGROUND_IMAGE' // 设置背景图片
    | 'SET_TITLE_ANIMATE' // 设置标题动画
    | 'SET_DURATION' // 设置持续时间
    | 'GET_FULL_CONFIG' // 获取全部配置
    | 'PREVIEW_MODE' // 预览模式
    | 'PLAY_MODE' // 设计器播放模式
    | 'SET_OTHER_CONFIG' // 设置其他配置
    | 'RENDER' // 执行渲染
    | 'GET_TEMPLATE_DATA' // 获取模板数据
    | 'GET_CONFIG' // 获取模版配置
    ;

export interface ITemplateSelectTextElement {
    color: string;
    value: string;
    display: boolean;
    fontSize: number;
    align: TTemplateTextConfigAlignType;
    width: number;
    height: number;
    x: number;
    y: number;
    key: string;
}

