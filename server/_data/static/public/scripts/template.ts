import {TOtherConfig, TThemeConfig} from "./@types/template";
import BaseTemplateMethods, {ILMOTemplateImplementsMethods} from "./bin/BaseTemplateMethods.js";

export {ILMOTemplateImplementsMethods};

abstract class LmoTemplate extends BaseTemplateMethods implements ILMOTemplateImplementsMethods {

    public abstract otherConfigChange(config: TOtherConfig): void;

    public abstract themeColorChange(config: TThemeConfig): void;

    public abstract render(): void | Promise<void>;
}

export default LmoTemplate;
