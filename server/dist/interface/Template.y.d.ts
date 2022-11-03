import { UpdateTemplateInfo } from "./DataBase.y";
export interface EditTemplateInfoParams extends UpdateTemplateInfo {
    id: string;
}
export interface DeleteTemplateParams extends EditTemplateInfoParams {
    path: string;
}
//# sourceMappingURL=Template.y.d.ts.map