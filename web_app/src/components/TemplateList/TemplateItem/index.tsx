import React, {useEffect, useRef, useState} from "react";
import YExtendTemplate from "../../YExtendTemplate";
import {
    Button,
    Form,
    FormItem,
    FormSubmit,
    Grid,
    GridResponsiveSize,
    Input,
    Loading,
    Modal,
    Popover
} from "@hi-ui/hiui";
import Request from "../../../lib/Request";
import Notification from "../../../lib/Notification";
import {setCurrentTemplate} from "../../../lib/Store/AppStore";
import {useDispatch} from "react-redux";
import {NavigateFunction, useNavigate} from 'react-router-dom';
import {Dispatch} from "@reduxjs/toolkit";
import {ReactState} from "../../../types/ReactTypes";
import Storage from "../../../lib/Storage";
import {useTranslation} from "react-i18next";

export interface ITemplate {
    cover: string;
    gifCover: string;
    createTime: string;
    description: string;
    id: string;
    name: string;
    type: 0 | 1;
}

export interface ITemplateItemProps {
    data: ITemplate;
    onRefresh: () => void;
}

export interface EditTemplateValue {
    name: string;
    description: string;
    id?: string;
}

const TemplateItem = (props: ITemplateItemProps): React.JSX.Element => {
    const {onRefresh} = props;
    const {t} = useTranslation();
    const [data, setData]: ReactState<ITemplate> = useState(props.data);
    const colSpan: GridResponsiveSize<number> = {lg: 6, xl: 4, md: 8, sm: 12, xs: 24} as const;
    const [isHover, setIsHover]: ReactState<boolean> = useState<boolean>(false);
    const [isCustomTemplate]: ReactState<boolean> = useState<boolean>(data.type === 0);
    const [editModalVisible, setEditModalVisible]: ReactState<boolean> = useState<boolean>(false);
    const [editFormValue, setEditFormValue]: ReactState<EditTemplateValue> = useState<EditTemplateValue>({
        name: data.name,
        description: data.description
    });
    const [loading, setLoading]: ReactState<boolean> = useState<boolean>(false);
    const [gifLoading, setGifLoading]: ReactState<boolean> = useState<boolean>(true);
    const [isCopyTemplate, setIsCopyTemplate]: ReactState<boolean> = useState<boolean>(false);
    const [gifElement, setGifElement]: ReactState<React.JSX.Element | null> = useState<React.JSX.Element | null>(null);
    const popoverRef: React.Ref<{
        open: () => void;
        close: () => void;
    }> = useRef(null);
    const dispatch: Dispatch = useDispatch();
    const navigate: NavigateFunction = useNavigate();

    const closeModal = (): void => {
        setEditModalVisible(false);
        setIsCopyTemplate(false);
        setEditFormValue({
            name: data.name,
            description: data.description
        });
    };

    const getModalTitle = (): string => {
        if (isCopyTemplate)
            return t('copyTemplate');

        return t('editTemplate');
    };

    const getGifImage = (src: string, alt: string = ''): React.JSX.Element => {
        if (gifElement)
            return gifElement;

        setGifElement(
            <img
                src={src}
                alt={alt}
                className={isHover ? 'img-active' : ''}
                style={{
                    width: "420px"
                }}
                onLoad={
                    (): void => {
                        setGifLoading(false);
                    }
                }
                onMouseEnter={(): void => {
                    setIsHover(false);
                }}
            />
        );

        return gifElement as unknown as React.JSX.Element;
    };

    useEffect((): void => {
        popoverRef.current?.[isHover ? 'open' : 'close']?.();
    }, [isHover]);

    return (
        <Grid.Col span={colSpan}>
            <YExtendTemplate show={editModalVisible}>
                <Form
                    initialValues={editFormValue}
                    labelWidth={'6rem'}
                    rules={{
                        name: [{required: true, type: "string", message: t('pleaseInput')}],
                        description: [{required: true, type: "string", message: t('pleaseInput')}]
                    }}
                >
                    <Modal
                        onClose={closeModal}
                        onCancel={closeModal}
                        visible={editModalVisible}
                        title={getModalTitle()}
                        footer={[
                            <FormItem field="description" key={1} valueType="string">
                                <div style={{marginTop: '1rem'}}>
                                    <Button onClick={closeModal}>{t('cancel')}</Button>
                                    <FormSubmit
                                        type="primary"
                                        loading={loading}
                                        onClick={(): void => {
                                            setLoading(true);
                                            const Api = isCopyTemplate ? Request.copyTemplate : Request.editTemplate;

                                            Api({
                                                id: data.id, ...editFormValue
                                            }).then((): void => {
                                                Notification.message(isCopyTemplate ? t('addSuccess') : t('editSuccess'), 'success');
                                                if (!isCopyTemplate)
                                                    setData(Object.assign(data, editFormValue));
                                                else
                                                    onRefresh();
                                                closeModal();
                                            }).finally((): void => {
                                                setLoading(false);
                                            });
                                        }}
                                    >
                                        {t('confirm')}
                                    </FormSubmit>
                                </div>
                            </FormItem>
                        ]}
                    >
                        <FormItem field="name" valueType="number" label={t('templateName')}>
                            <Input onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                setEditFormValue({...editFormValue, name: e.target.value});
                            }}/>
                        </FormItem>
                        <FormItem field="description" valueType="string" label={t('templateDes')}>
                            <Input onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                setEditFormValue({...editFormValue, description: e.target.value});
                            }}/>
                        </FormItem>
                    </Modal>
                </Form>
            </YExtendTemplate>
            <div
                className={'template-item app_cursor_pointer app_position_relative'}
                style={{
                    backgroundImage: `url("${'/api' + data.cover}")`,
                    backgroundRepeat: 'no-repeat'
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>): void => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsHover(true);
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>): void => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsHover(false);
                }}
                onClick={
                    (): void => {
                        Storage.set('current_template', data);
                        dispatch(setCurrentTemplate(data));
                        navigate('/design');
                    }
                }
            >
                <img className={isHover ? 'img-active' : ''} src={'/api' + data.cover} alt={data.name}/>
                <YExtendTemplate show={!isHover}>
                    <div className={'template-item-name '}>
                        <span className={'animated fadeInDown'}>{data.name}</span>
                    </div>
                </YExtendTemplate>
                <YExtendTemplate show={isHover}>
                    <Popover innerRef={popoverRef} placement={'right'} content={
                        <div style={{
                            minWidth: '22.5rem',
                            minHeight: '12.5rem'
                        }}>
                            <Loading
                                visible={gifLoading}
                                style={{
                                    height: ' 12.5rem'
                                }}
                            >
                                {
                                    getGifImage('/api' + data.gifCover, data.name)
                                }
                            </Loading>
                        </div>
                    }>
                        <div className={'template-item-mask animated fadeIn'}>
                            <div className={'template-item-mask-option app_flex_box app_position_relative'}>
                                <div onClick={(e: React.MouseEvent<HTMLDivElement>): void => {
                                    e.stopPropagation();
                                    setIsCopyTemplate(true);
                                    setEditModalVisible(true);
                                }} className={'template-item-mask-option-item template-item-mask-option-item-primary'}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.76561 3.00047H8.68866C8.43401 3.00047 8.22764 3.20672 8.22764 3.46148C8.22764 3.71625 8.43413 3.9225 8.68866 3.9225H9.76561C9.86897 3.9225 9.95288 4.00664 9.95288 4.10976V9.7289C9.95288 9.83203 9.86886 9.91617 9.76561 9.91617H4.14659C4.04323 9.91617 3.95932 9.83203 3.95932 9.7289V8.66414C3.95932 8.40926 3.75284 8.20312 3.49831 8.20312C3.24378 8.20312 3.03729 8.40937 3.03729 8.66414V9.7289C3.03729 10.3407 3.53499 10.8383 4.14671 10.8383H9.76573C10.3773 10.8383 10.8751 10.3409 10.8751 9.7289V4.10988C10.875 3.49804 10.3772 3.00047 9.76561 3.00047Z"
                                            fill="white"/>
                                        <path
                                            d="M7.92143 1.15629H2.30241C1.69081 1.15629 1.19299 1.65375 1.19299 2.2657V7.88473C1.19299 8.49656 1.69069 8.99414 2.30241 8.99414H7.92143C8.53303 8.99414 9.03084 8.49668 9.03084 7.88473V2.2657C9.03073 1.65375 8.53303 1.15629 7.92143 1.15629ZM2.30241 8.07199C2.19905 8.07199 2.11514 7.98785 2.11514 7.88473V2.2657C2.11514 2.16258 2.19916 2.07844 2.30241 2.07844H7.92143C8.02479 2.07844 8.1087 2.16258 8.1087 2.2657V7.88473C8.1087 7.98785 8.02467 8.07199 7.92143 8.07199H2.30241Z"
                                            fill="white"/>
                                    </svg>
                                </div>
                                <YExtendTemplate show={isCustomTemplate}>
                                    <div onClick={(e: React.MouseEvent<HTMLDivElement>): void => {
                                        e.stopPropagation();
                                    }} className={'template-item-mask-option-item'}>
                                        <svg onClick={
                                            (): void => {
                                                setEditModalVisible(true);
                                            }
                                        } width="12" height="12" viewBox="0 0 12 12" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M6 2.25H2.625C2.41789 2.25 2.25 2.41789 2.25 2.625V9.375C2.25 9.58211 2.41789 9.75 2.625 9.75H9.375C9.5821 9.75 9.75 9.58211 9.75 9.375V6.28125C9.75 6.02237 9.95987 5.8125 10.2187 5.8125C10.4776 5.8125 10.6875 6.02237 10.6875 6.28125V9.375C10.6875 10.0999 10.0999 10.6875 9.375 10.6875H2.625C1.90012 10.6875 1.3125 10.0999 1.3125 9.375V2.625C1.3125 1.90013 1.90012 1.3125 2.625 1.3125H6C6.25888 1.3125 6.46875 1.52237 6.46875 1.78125C6.46875 2.04013 6.25888 2.25 6 2.25ZM8.89627 2.44417L5.43211 5.90834L5.09793 6.90543L6.09503 6.57124L9.55919 3.10707L8.89627 2.44417ZM9.22773 1.4498L10.5536 2.77562C10.7366 2.95867 10.7366 3.25547 10.5536 3.43853L6.67997 7.31211C6.62869 7.36339 6.56622 7.40206 6.49747 7.42511L4.50328 8.09347C4.13637 8.21645 3.78689 7.86698 3.90987 7.50007L4.57823 5.50587C4.60128 5.43712 4.63996 5.37465 4.69123 5.32338L8.56481 1.4498C8.74787 1.26674 9.04467 1.26674 9.22773 1.4498Z"
                                                fill="white"/>
                                        </svg>
                                    </div>
                                    <div onClick={(e: React.MouseEvent<HTMLDivElement>): void => {
                                        e.stopPropagation();
                                    }}
                                         className={'template-item-mask-option-item template-item-mask-option-item-danger'}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M6.50001 1.625C6.85015 1.62498 7.18711 1.75855 7.44216 1.99845C7.6972 2.23835 7.85112 2.56651 7.87251 2.916L7.87501 3V3.125H10C10.095 3.12503 10.1865 3.16112 10.2559 3.22599C10.3253 3.29085 10.3675 3.37965 10.374 3.47444C10.3805 3.56923 10.3507 3.66295 10.2908 3.73665C10.2308 3.81035 10.1451 3.85855 10.051 3.8715L10 3.875H9.37501V9.5C9.37503 9.85014 9.24146 10.1871 9.00156 10.4421C8.76166 10.6972 8.4335 10.8511 8.08401 10.8725L8.00001 10.875H4.00001C3.64986 10.875 3.3129 10.7415 3.05786 10.5016C2.80281 10.2617 2.6489 9.93349 2.62751 9.584L2.62501 9.5V3.875H2.00001C1.905 3.87497 1.81354 3.83888 1.74411 3.77401C1.67469 3.70915 1.63247 3.62035 1.62599 3.52556C1.61952 3.43077 1.64927 3.33705 1.70922 3.26335C1.76918 3.18965 1.85488 3.14145 1.94901 3.1285L2.00001 3.125H4.12501V3C4.12499 2.64986 4.25855 2.3129 4.49845 2.05785C4.73835 1.80281 5.06652 1.64889 5.41601 1.6275L5.50001 1.625H6.50001ZM8.62501 3.875H3.37501V9.5C3.37501 9.8235 3.62101 10.09 3.93601 10.122L4.00001 10.125H8.00001C8.15474 10.1251 8.30399 10.0677 8.41889 9.96411C8.53379 9.86048 8.60616 9.71792 8.62201 9.564L8.62501 9.5V3.875ZM5.00001 5.125C5.09063 5.125 5.17818 5.15782 5.24647 5.21738C5.31477 5.27695 5.35918 5.35922 5.37151 5.449L5.37501 5.5V8.5C5.37498 8.59501 5.33889 8.68647 5.27402 8.7559C5.20916 8.82532 5.12036 8.86754 5.02557 8.87401C4.93078 8.88049 4.83706 8.85074 4.76336 8.79078C4.68965 8.73082 4.64146 8.64512 4.62851 8.551L4.62501 8.5V5.5C4.62501 5.40054 4.66452 5.30516 4.73484 5.23483C4.80517 5.16451 4.90055 5.125 5.00001 5.125ZM7.00001 5.125C7.09063 5.125 7.17818 5.15782 7.24647 5.21738C7.31477 5.27695 7.35918 5.35922 7.37151 5.449L7.37501 5.5V8.5C7.37498 8.59501 7.33889 8.68647 7.27402 8.7559C7.20916 8.82532 7.12036 8.86754 7.02557 8.87401C6.93078 8.88049 6.83706 8.85074 6.76336 8.79078C6.68965 8.73082 6.64146 8.64512 6.62851 8.551L6.62501 8.5V5.5C6.62501 5.40054 6.66452 5.30516 6.73484 5.23483C6.80517 5.16451 6.90055 5.125 7.00001 5.125ZM6.50001 2.375H5.50001C5.34528 2.37493 5.19602 2.43226 5.08112 2.53589C4.96623 2.63952 4.89385 2.78208 4.87801 2.936L4.87501 3V3.125H7.12501V3C7.12508 2.84527 7.06775 2.69602 6.96412 2.58112C6.86049 2.46622 6.71792 2.39384 6.56401 2.378L6.50001 2.375Z"
                                                fill="white"/>
                                        </svg>
                                    </div>
                                </YExtendTemplate>
                            </div>
                            <div className={'template-item-mask-name app_position_relative animated fadeInDown'}>
                                {data.name}
                            </div>
                            <div className={'template-item-mask-description app_position_relative animated fadeInDown'}>
                                {data.description}
                            </div>
                        </div>
                    </Popover>
                </YExtendTemplate>
            </div>
        </Grid.Col>
    );
};

export default TemplateItem;
