import React from "react";
import {Button} from "@hi-ui/hiui";

export interface IDesignHeaderProps {
    readonly onBlack?: () => void;
    readonly onSave?: () => void;
    readonly onPreview?: () => void;
    readonly onSynthesis?: () => void;
}

function DesignHeader(props: IDesignHeaderProps): React.JSX.Element {
    const {
        onBlack,
        onSave,
        onPreview,
        onSynthesis
    } = props;

    return (
        <div className={'data-visualization-design-header app_position_relative app_none_user_select'}>
            <div onClick={(): void => {
                onBlack && onBlack();
            }} className={'data-visualization-design-header-black app_flex_box app_cursor_pointer'}>
                <div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_4_90)">
                            <path
                                d="M12.5396 8.0008C12.5396 8.41476 12.2015 8.75059 11.7846 8.75059L6.65433 8.75033L8.82584 10.9062C8.89592 10.9756 8.95155 11.0582 8.98951 11.1492C9.02748 11.2402 9.04703 11.3378 9.04703 11.4364C9.04703 11.535 9.02748 11.6326 8.98951 11.7236C8.95155 11.8146 8.89592 11.8972 8.82584 11.9665C8.68394 12.1075 8.49193 12.1865 8.29189 12.1862C8.09192 12.1865 7.89997 12.1076 7.75808 11.9667L4.30177 8.53528C4.3003 8.53382 4.29857 8.53288 4.2971 8.53142C4.19049 8.42619 4.11817 8.29118 4.08966 8.14412C4.06584 8.02341 4.07229 7.89867 4.10841 7.78105C4.14454 7.66343 4.20923 7.55659 4.2967 7.47006C4.29937 7.46739 4.30257 7.46553 4.30537 7.46299L7.75808 4.03468C7.90013 3.89395 8.092 3.815 8.29196 3.815C8.49191 3.815 8.68379 3.89395 8.82584 4.03468C8.89588 4.10406 8.95148 4.18663 8.98943 4.27763C9.02738 4.36862 9.04691 4.46623 9.04691 4.56482C9.04691 4.66341 9.02738 4.76103 8.98943 4.85202C8.95148 4.94302 8.89588 5.02559 8.82584 5.09497L6.65433 7.25088L11.7846 7.25115C12.2016 7.25115 12.5396 7.58685 12.5396 8.0008ZM15.3078 6.88812C14.9037 6.99277 14.4915 6.75347 14.3858 6.35297C13.9428 4.67421 12.8677 3.26729 11.3586 2.39138C9.8496 1.5152 8.08751 1.27536 6.39689 1.71531C2.90631 2.62375 0.810659 6.18272 1.7255 9.64877C2.64087 13.1143 6.22517 15.1947 9.71455 14.2856C12.1744 13.6461 14.0529 11.6262 14.5003 9.13949C14.5736 8.73206 14.9663 8.45956 15.3765 8.53342C15.787 8.60621 16.0603 8.99564 15.9868 9.40333C15.4364 12.4633 13.1243 14.949 10.0972 15.7361C9.43083 15.9101 8.745 15.9983 8.05632 15.9985C4.48428 15.9985 1.21235 13.6172 0.264715 10.029C-0.861169 5.76303 1.7179 1.38282 6.01399 0.26493C8.09458 -0.277148 10.2637 0.0186888 12.1208 1.09684C13.978 2.175 15.3013 3.90656 15.8466 5.97275C15.9524 6.37337 15.7111 6.78306 15.3078 6.88812Z"
                                fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_4_90">
                                <rect width="16" height="16" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <div className={'black'}>返回</div>
            </div>
            <div className={'data-visualization-design-header-option'}>
                <Button onClick={
                    (): void => {
                        onSave && onSave();
                    }
                } size={'sm'} type="secondary">保存为自定义模板</Button>
                <Button onClick={
                    (): void => {
                        onPreview && onPreview();
                    }
                } size={'sm'} type="secondary">预览</Button>
                <Button onClick={(): void => {
                    onSynthesis && onSynthesis();
                }} size={'sm'} type="primary">合成</Button>
            </div>
        </div>
    );
}

export default DesignHeader;