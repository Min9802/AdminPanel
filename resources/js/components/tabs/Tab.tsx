import classNames from "classnames";
import React, { ReactNode, useEffect, useRef } from "react";

interface TabProps {
    title?: string;
    children?: ReactNode | any;
    activeTab?: number;
    currentTab?: number;
    active?: boolean;
    setActiveTab?: (tabIndex: number) => void;
    setSize?: any;
    setOffset?: any;
    id?: any;
}

const Tab: React.FC<TabProps> = ({
    children,
    activeTab,
    currentTab,
    setActiveTab,
    setSize,
    setOffset,
}) => {
    const ref = useRef<any>(null);
    const setTab = (currentTab: any) => {
        typeof setActiveTab == "function" ? setActiveTab(currentTab) : null;
    };
    /**
     * set params
     * @param width
     * @param height
     * @param left
     * @param top
     */
    const setParam = (width: any, height: any, left: any, top: any) => {
        setSize({ width, height });
        setOffset({ left, top });
    };
    /**
     * auto resize effect
     */
    useEffect(() => {
        window.onresize = () => {
            const element = document.getElementById(`tab-${activeTab}`);
            if (element) {
                const width = element?.offsetWidth;
                const height = element?.offsetHeight;
                const left = element?.offsetLeft;
                const top = element?.offsetTop;
                setParam(width, height, left, top);
            }
        };
    }, [window.onresize]);

    return (
        <>
            <li
                ref={ref}
                id={`tab-${currentTab}`}
                className={classNames(
                    "cursor-pointer z-30 items-center justify-center rounded-lg border-0 bg-inherit px-3 py-1 text-dark dark:text-white",
                )}
                onClick={() => {
                    setTab(currentTab);
                    const width = ref.current.offsetWidth;
                    const height = ref.current.offsetHeight;
                    const left = ref.current.offsetLeft;
                    const top = ref.current.offsetTop;
                    setParam(width, height, left, top);
                }}
            >
                {children}
            </li>
        </>
    );
};

Tab.displayName = "Tab";
export default Tab;
