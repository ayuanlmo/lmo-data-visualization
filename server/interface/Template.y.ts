import {UpdateTemplateInfo} from "./DataBase.y";

export interface EditTemplateInfoParams extends UpdateTemplateInfo {
    id: string;
}