export type TTemplateTextConfigAlignType = 'left' | 'center' | 'right';

export type TTemplateMessageType =
    'TEMPLATE_RENDER'
    | 'TEMPLATE_RENDER_FINISH'
    | 'TEMPLATE_RENDER_ERROR'
    | 'TEMPLATE_FULL_CONFIG'
    | 'TEMPLATE_SELECT_TEXT_ELEMENT'

export type TDesignAppMessageType =
    'SET_DATA'
    | 'SET_TEXT_CONFIG'
    | 'SET_COLOR_MODE'
    | 'SET_COLOR_CONFIG'
    | 'SET_THEME_COLOR'
    | 'SET_BACKGROUND_IMAGE'
    | 'SET_TITLE_ANIMATE'
    | 'SET_DURATION'
    | 'GET_FULL_CONFIG'
    | 'PREVIEW_MODE'
    | 'PLAY_MODE'

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

