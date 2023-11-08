import SettingApi from "@/apis/Global/SettingApi";
import { toast } from "@min98/ui";
import { AxiosError } from "axios";
import { t } from "i18next";
import reduxStore from "@/store/reducers/redux";
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
        parseError(err);
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
export type ServerErrorProps = AxiosError<ServerError>
const parseError = (error: ServerErrorProps) => {
    if (error && error.response) {
        const response = error.response;
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
/**
 * copy to clipboard
 * @param data
 */
const Copy = (data: any) => {
    try {
        navigator.clipboard.writeText(data);
        const notify = {
            title: t("label.success"),
            description: t("label.clipboard"),
            status: "success",
        };
        toast(notify);
    } catch (err: any) {
        parseError(err);
    }
};
/**
 * random string
 * @param type
 * @param length
 * @returns
 */
type RandomType = 1 | 2;
const Random = (type: RandomType, length: number) => {
    var result = "";
    switch (type) {
        case 1:
            var characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            break;
        case 2:
            var characters = "0123456789";
            break;
        default:
            var characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    }
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};
/**
 * timestamp to date
 * @param timestamp
 * @returns
 */
const timestampToDate = (timestamp: number) => {
    const state = reduxStore.getState();
    const language = state.app?.language;
    if (timestamp === undefined || timestamp === null) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(language == "vi" ? "vn" : "en");
};
const dateTime = (time: string) => {
    const state = reduxStore.getState();
    const language = state.app?.language;
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };
    return new Date(time).toLocaleDateString(language, options);
};
const toggleDataInArray = (arr1: any, arr2: any, prop: any) => {
    const updatedArray = [...arr1];
    const dataIndex = updatedArray.findIndex(
        (item) => item.path === arr2[prop],
    );
    if (dataIndex !== -1) {
        updatedArray.splice(dataIndex, 1);
    } else {
        updatedArray.push(arr2);
    }
    return updatedArray;
};
export { getConfig, parseError, delay, repeat, Copy, Random, timestampToDate, dateTime, toggleDataInArray };
