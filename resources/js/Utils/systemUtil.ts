import SettingApi from "@/apis/Global/SettingApi";
import { toast } from "@min98/ui";
import axios, { AxiosError } from "axios";
import { t } from "i18next";
import { string } from "zod";

export type ResponseProps = {
    status?: string;
    content?: any;
};
/**
 * get config
 * @returns
 */
const getConfig = async () => {
    try {
        const response = await SettingApi.getConfig();
        return response.data.content;
    } catch (err: any) {
        const error = err.response.data;
        const status: string = error.status;
        const message: string = error.message;
        const notify = {
            title: status,
            description: message,
            status: "error",
        };
        toast(notify);
    }
};
/**
 * parse error
 * @param error
 */
export type ServerError = {
    status: string,
    message: string | {
        [key: string]: string[];
    };
};
const parseError = (error: AxiosError<ServerError>) => {
    const serverError = error as AxiosError<ServerError>;
    if (serverError && serverError.response) {
        const response = serverError.response;
        const status = response.data.status;
        const message = response.data.message;
        if (typeof message == 'string') {
            const notify = {
                title: status,
                description: message,
                status: "error",
            };
            toast(notify);
        } else {
            Object.keys(message).map((key: string) =>
                message[key].map((item: any) => {
                    const notify = {
                        title: status,
                        description: item,
                        status: "error",
                    };
                    toast(notify);
                })
            )
        }
    } else {
        const notify = {
            title: t('label.error'),
            description: t("common.unknown_error"),
            status: "error",
        };
        toast(notify);
    }
}
type Callback = () => void;
/**
 * delay callback
 * @param callback
 * @param delay
 */
const delay = (callback: Callback, delay: number): Promise<void> => {
    return new Promise<void>((resolve) => {
        const timeoutId = setTimeout(() => {
            callback();
            resolve();
        }, delay);
    });
}
/**
 * repeat callback
 * @param callback
 * @param delay
 */
const repeat = (callback: Callback, delay: number): Promise<void> => {
    return new Promise<void>((resolve) => {
        const intervalId = setInterval(() => {
            callback();
            resolve();
        }, delay);
        setTimeout(() => {
            clearInterval(intervalId);
            resolve();
        }, 10000); // Resolve after 10 seconds
    });
}
export { getConfig, parseError, delay, repeat };
