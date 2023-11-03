import classNames from "classnames";
import React, {
    useState,
    ReactNode,
    ReactElement,
    useEffect,
    useRef,
} from "react";
import Tab from "./Tab";

interface TabsProps {
    children: ReactNode[];
}
type Size = {
    width: number;
    height: number;
};
const Tabs = ({ children }: TabsProps) => {
    const ref = useRef<any>(null);

    const findActiveTab = (a: any) => {
        return a.reduce((accumulator: any, currentValue: any, i: number) => {
            if (currentValue.props.active) {
                return i;
            }
            return accumulator;
        }, 0);
    };
    const tabValidator = (tab: ReactNode) => {
        return tab && (tab as ReactElement).type === Tab ? true : false;
    };

    const [activeTab, setActiveTab] = useState<number>(findActiveTab(children));

    const [size, setSize] = useState<Size>({
        width: 0,
        height: 0,
    });
    const [offset, setOffset] = useState<any>({
        left: 0,
        top: 0,
    });
    const [offsetEffect, setOffsetEffect] = useState({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const offsetLeftParent = ref.current.offsetLeft;
        const offsetTopParent = ref.current.offsetTop;
        const newOffset = {
            x: offset.left - offsetLeftParent - 10,
            y: offset.top - offsetTopParent - 10,
        };
        if (newOffset.x > 0) {
            setOffsetEffect(newOffset);
        } else {
            setOffsetEffect({
                x: 0,
                y: 0,
            });
        }
    }, [activeTab, offset]);

    return (
        <div className="rounded-xl border border-stroke shadow-default dark:border-strokedark bg-white dark:bg-boxdark p-3 my-3 overflow-auto">
            <div className="flex">
                <ul
                    className="flex flex-col md:flex-row list-none rounded-xl bg-white dark:bg-dark-light p-3 w-full"
                    ref={ref}
                >
                    {children.map((item: any, i) => {
                        return (
                            <React.Fragment key={`tab-${i}`}>
                                {tabValidator(item) && (
                                    <Tab
                                        currentTab={i}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        setSize={setSize}
                                        setOffset={setOffset}
                                    >
                                        <span>
                                            {(item as ReactElement).props.title}
                                        </span>
                                    </Tab>
                                )}
                            </React.Fragment>
                        );
                    })}
                    <div
                        className={classNames(
                            "z-10 absolute border border-stroke text-slate-700 rounded-lg flex-auto text-center bg-none border-0 block shadow bg-gray-200 text-white dark:bg-dark dark:text-dark",
                        )}
                        style={{
                            padding: "0px",
                            transition: "all 0.5s ease 0s",
                            transform: `translate3d(${offsetEffect.x}px, ${offsetEffect.y}px, 0px)`,
                            width: size.width,
                            height: size.height,
                        }}
                    >
                        <a
                            className={classNames(
                                "border border-stroke text-slate-700 z-30 mb-0 flex w-full cursor-pointer items-center justify-center rounded-lg border-0 px-0 py-1 transition-all ease-in-out bg-gray-200 text-white dark:bg-dark dark:text-dark",
                            )}
                            style={{
                                animation: "0.2s ease 0s 1",
                                // width: size.width,
                                // height: size.height,
                            }}
                        >
                            -
                        </a>
                    </div>
                </ul>
            </div>
            <div className="p-5 my-3 rounded-xl border border-stroke shadow-default dark:border-strokedark dark:bg-boxdark p-3">
                {children.map((item, i) => {
                    return (
                        <div
                            key={`content-${i}`}
                            className={classNames(
                                "",
                                `${i === activeTab ? "visible" : "hidden"}`,
                            )}
                        >
                            {(item as ReactElement).props.children}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
Tabs.displayName = "Tabs";
export default Tabs;
