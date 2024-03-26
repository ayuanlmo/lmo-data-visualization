import React from "react";
import Grid from "@hi-ui/grid";
import {Select} from "@hi-ui/hiui";
import ResetButton from "../ResetButton";
import SelectTheme from "./SelectTheme";
import SelectBackground from "./SelectBackground";

function ColorConfig(): React.JSX.Element {
    const {Col, Row} = Grid;

    return (
        <div className={'color-config app_none_user_select'}>
            <div className={'color-config-item'}>
                <Row style={{
                    width: '100%'
                }} gutter={true} justify={"space-between"}>
                    <Col span={8}>
                        <div className={'color-config-item-label app_flex_box'}>主题配置</div>
                    </Col>
                    <Col justify={'flex-end'} span={16}>
                        <Row gutter={true} justify={"space-between"}>
                            <Col span={6}>
                                <ResetButton/>
                            </Col>
                            <Col span={18}>
                                <Select></Select>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            <div className={'text-config-item app_flex_box'}>
                <SelectTheme/>
            </div>
            <div className={'config-line '}></div>

            <div className={'color-config-item'}>
                <Row style={{
                    width: '100%'
                }} gutter={true} justify={"space-between"}>
                    <Col span={8}>
                        <div className={'color-config-item-label app_flex_box'}>背景配置</div>
                    </Col>
                    <Col justify={'flex-end'} span={16}>
                        <Row gutter={true} justify={"space-between"}>
                            <Col span={6}>
                                <ResetButton/>
                            </Col>
                            <Col span={18}>
                                <Select></Select>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <div className={'text-config-item app_flex_box'}>
                <SelectBackground/>
            </div>
        </div>
    );
}

export default ColorConfig;