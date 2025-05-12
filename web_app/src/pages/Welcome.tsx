import React, {useEffect} from "react";
import AppConfig from "../config/AppConfig";
import Grid from "@hi-ui/grid";
import Popover from "@hi-ui/popover";
import Form from "@hi-ui/form";
import * as Icons from "@hi-ui/icons";
import SwitchLang from "../components/GlobalComponent/components/SwitchLang";
import {useTranslation} from "react-i18next";
import {NavigateFunction, useNavigate} from "react-router-dom";
import Storage from "../lib/Storage";

const Welcome = (): React.JSX.Element => {
    const {t} = useTranslation();
    const navigate: NavigateFunction = useNavigate();
    const originBodyClassName: string = document.body.className;

    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');

    useEffect((): () => void => {
        return (): void => document.body.classList.add(originBodyClassName);
    }, []);

    return (
        <div className={'welcome-page app_position_absolute app_none_user_select'} style={{
            backgroundImage: `url("${origin + '/bg.svg'}")`
        }}>
            <div className={'welcome-page-content'}>
                <Grid.Row justify={'center'}>
                    <Grid.Col>
                        <img className={'welcome-page-logo'} src="/logo.svg" alt=""/>
                    </Grid.Col>
                </Grid.Row>
                <Grid.Row
                    style={{
                        marginTop: '2.5rem'
                    }}
                    justify={'center'}
                >
                    <Grid.Col>
                        <h2 className={'animated pulse'}>
                            {AppConfig.appName}
                        </h2>
                    </Grid.Col>
                </Grid.Row>
                <Grid.Row
                    style={{
                        marginTop: '4rem'
                    }}
                    justify={'center'}
                >
                    <Grid.Col>
                        <div className={'start-button app_cursor_pointer'}>
                            <p className={'app_position_relative'}
                               onClick={(): void => {
                                   Storage.set('open_welcome_page', '1');
                                   navigate('/');
                               }}>
                            <span>
                                {t('getStarted')}
                            </span>
                                <svg className={'app_position_absolute animated bounceIn infinite'}
                                     xmlns="http://www.w3.org/2000/svg" width="25"
                                     height="25" viewBox="0 0 25 25"
                                     fill="none">
                                    <path
                                        d="M1.56641 12.5076C1.56641 11.678 2.34668 10.999 3.30029 10.999H21.6963C22.6499 10.999 23.4302 11.678 23.4302 12.5076C23.4302 13.3372 22.6499 14.0161 21.6963 14.0161H3.30029C2.34668 14.0161 1.56641 13.3372 1.56641 12.5076Z"
                                        fill="#0688E5"/>
                                    <path
                                        d="M13.9561 18.964C13.9561 18.5717 14.1069 18.1947 14.3936 17.8929L20.8501 11.4364C21.4385 10.848 22.3889 10.848 22.977 11.4364C23.5654 12.0248 23.5654 12.9752 22.977 13.5634L16.5205 20.035C15.9321 20.6234 14.9817 20.6234 14.3936 20.035C14.0918 19.7335 13.9561 19.3563 13.9561 18.964Z"
                                        fill="#0688E5"/>
                                    <path
                                        d="M13.9561 6.03577C13.9561 5.64343 14.1069 5.26648 14.3936 4.96472C14.9819 4.37634 15.9324 4.37634 16.5205 4.96472L22.9922 11.4364C23.5806 12.0248 23.5806 12.9752 22.9922 13.5634C22.4038 14.1517 21.4534 14.1517 20.8652 13.5634L14.3936 7.09168C14.0918 6.80505 13.9561 6.42786 13.9561 6.03577Z"
                                        fill="#0688E5"/>
                                </svg>
                            </p>
                        </div>
                    </Grid.Col>
                </Grid.Row>
            </div>
            <div className={'welcome-page-right-button app_position_absolute app_cursor_pointer'}>
                <Popover trigger={'hover'} content={
                    <React.Fragment>
                        <Form initialValues={{}}>
                            <Form.Item label={
                                <svg className="icon" viewBox="0 0 1024 1024" version="1.1"
                                     xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                    <path
                                        d="M757.205333 473.173333c5.333333 0 10.453333 2.090667 14.250667 5.717334a19.029333 19.029333 0 0 1 5.888 13.738666v58.154667h141.184c11.093333 0 20.138667 8.704 20.138667 19.413333v232.704a19.797333 19.797333 0 0 1-20.138667 19.413334h-141.184v96.981333a19.754667 19.754667 0 0 1-20.138667 19.370667H716.8a20.565333 20.565333 0 0 1-14.250667-5.674667 19.029333 19.029333 0 0 1-5.888-13.696v-96.981333h-141.141333a20.565333 20.565333 0 0 1-14.250667-5.674667 19.029333 19.029333 0 0 1-5.930666-13.738667v-232.704c0-5.12 2.133333-10.112 5.930666-13.738666a20.565333 20.565333 0 0 1 14.250667-5.674667h141.141333v-58.154667c0-5.162667 2.133333-10.112 5.888-13.738666a20.565333 20.565333 0 0 1 14.250667-5.674667h40.362667zM192.597333 628.394667c22.272 0 40.32 17.365333 40.32 38.826666v38.741334c0 40.618667 32.512 74.368 74.624 77.397333l6.058667 0.213333h80.64c21.930667 0.469333 39.424 17.706667 39.424 38.784 0 21.077333-17.493333 38.314667-39.424 38.784H313.6c-89.088 0-161.28-69.461333-161.28-155.178666v-38.741334c0-21.461333 18.005333-38.826667 40.277333-38.826666z m504.106667 0h-80.64v116.394666h80.64v-116.394666z m161.28 0h-80.64v116.394666h80.64v-116.394666zM320.170667 85.333333c8.234667 0 15.658667 4.778667 18.773333 12.202667H338.773333l161.322667 387.84c2.517333 5.973333 1.706667 12.8-2.005333 18.090667a20.394667 20.394667 0 0 1-16.725334 8.533333h-43.52a20.181333 20.181333 0 0 1-18.688-12.202667L375.850667 395.648H210.901333l-43.264 104.149333A20.181333 20.181333 0 0 1 148.906667 512H105.514667a20.394667 20.394667 0 0 1-16.725334-8.533333 18.773333 18.773333 0 0 1-2.005333-18.090667l161.28-387.84A20.181333 20.181333 0 0 1 266.88 85.333333h53.290667zM716.8 162.901333c42.794667 0 83.84 16.341333 114.090667 45.44a152.234667 152.234667 0 0 1 47.232 109.738667v38.741333c-0.469333 21.077333-18.389333 37.930667-40.32 37.930667s-39.808-16.853333-40.32-37.930667v-38.741333c0-20.608-8.490667-40.32-23.637334-54.869333a82.304 82.304 0 0 0-57.045333-22.741334h-80.64c-21.888-0.469333-39.424-17.706667-39.424-38.784 0-21.077333 17.493333-38.314667 39.424-38.784h80.64z m-423.424 34.304L243.2 318.037333h100.48L293.418667 197.205333z"
                                        fill="#2c2c2c"></path>
                                </svg>
                            }>
                                <SwitchLang/>
                            </Form.Item>
                        </Form>
                    </React.Fragment>
                }>
                    <Icons.SettingFilled
                        className={'svg-right-icon animated rotateIn'}
                        onMouseEnter={() => {
                            const svgElement: HTMLElement | null = document.querySelector('.svg-right-icon');

                            svgElement?.classList.remove('animated');
                            svgElement?.classList.remove('rotateIn');
                        }}/>
                </Popover>
            </div>
            <div className={'welcome-page-footer app_position_absolute'}>
                <p>
                    This project is licensed under the
                    <a href={`${AppConfig.openSource.github}/blob/main/LICENSE`} target="_blank"
                       rel="noreferrer"> Apache-2.0
                        License</a>. &nbsp;
                    Created by
                    <a href="https://github.com/ayuanlmo" target="_blank" rel="noreferrer">@ayuanlmo</a>.
                    &nbsp;
                    <a href={AppConfig.openSource.github} target="_blank" rel="noreferrer">View on GitHub</a>
                </p>
            </div>
        </div>
    );
};

export default Welcome;
