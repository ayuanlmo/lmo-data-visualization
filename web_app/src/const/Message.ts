export type MessageTypes =
    'UPDATE_COLOR_MODE'
    | 'UPDATE_DURATION'
    | 'UPDATE_TEXT'
    | 'UPDATE_COLOR'
    | 'PREVIEW'
    | 'UPDATE_DATA'
    | 'UPDATE_BACKGROUND_IMAGE'
    | 'UPDATE_THEME_COLOR'
    | 'UPDATE_ANIMATE_NAME';


//更新标题动画
export const UPDATE_ANIMATE_NAME: MessageTypes = 'UPDATE_ANIMATE_NAME';
//更新主题颜色
export const UPDATE_THEME_COLOR: MessageTypes = 'UPDATE_THEME_COLOR';
//更新背景
export const UPDATE_BACKGROUND_IMAGE: MessageTypes = 'UPDATE_BACKGROUND_IMAGE';
//更新数据
export const UPDATE_DATA: MessageTypes = 'UPDATE_DATA';
//预览
export const PREVIEW: MessageTypes = 'PREVIEW';
//更新颜色配置
export const UPDATE_COLOR: MessageTypes = 'UPDATE_COLOR';
//更新文字配置
export const UPDATE_TEXT: MessageTypes = 'UPDATE_TEXT';
//更新持续时间
export const UPDATE_DURATION: MessageTypes = 'UPDATE_DURATION';
//更新颜色类型
export const UPDATE_COLOR_MODE: MessageTypes = 'UPDATE_COLOR_MODE';
