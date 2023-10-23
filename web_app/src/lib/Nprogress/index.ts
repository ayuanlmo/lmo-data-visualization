import "./style.scss";
// @ts-ignore
import * as N from "nprogress";

namespace Nprogress {
    export const start = (d: number = 0.1): void => {
        N['set'](d);
        setTimeout(async (): Promise<void> => {
            await N['start']();
        });
    };

    export const done = (): void => {
        setTimeout(async (): Promise<void> => {
            await N['done']();
        });
    };
}

export default Nprogress;


