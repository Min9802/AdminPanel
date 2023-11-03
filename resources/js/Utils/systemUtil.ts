import SettingApi from "@/apis/Global/SettingApi";
import { toast } from "@min98/ui";
import React from "react";

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
const parseError = (error: any) => {
    const response = error.response;
    const statusCode = response.status;
    const status = response.data.status;
    const message = response.data.message;
    const type = typeof message;
    if (statusCode === 422) {
        if (type == "object") {
            Object.keys(message).map((key) =>
                message[key].map((item: any) => {
                    const notify = {
                        title: status,
                        description: item,
                        status: "error",
                    };
                    toast(notify);
                })
            )
        } else {
            const notify = {
                title: status,
                description: message,
                status: "error",
            };
            toast(notify);
        }
    } else {
        const notify = {
            title: status,
            description: message,
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
