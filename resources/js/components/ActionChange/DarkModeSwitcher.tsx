import useColorMode from "@/hooks/useColorMode";

import { Icon } from "@iconify/react";
const DarkModeSwitcher = () => {
    const [theme, setTheme] = useColorMode();

    return (
        <li>
            <label
                className={`relative m-0 block h-7 w-13 rounded-full ${
                    theme === "dark" ? "bg-primary-light" : "bg-stroke"
                }`}
            >
                <input
                    type="checkbox"
                    onChange={() => {
                        if (typeof setTheme === "function") {
                            setTheme(theme === "light" ? "dark" : "light");
                        }
                    }}
                    className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
                />
                <span
                    className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
                        theme === "dark" && "!right-[3px] !translate-x-full"
                    }`}
                >
                    <span className="dark:hidden">
                        {/* <img src={Light} alt="" /> */}
                        <Icon icon="tabler:sun-filled" color="gray" />
                    </span>
                    <span className="hidden dark:inline-block">
                        {/* <img src={Dark} alt="" /> */}
                        <Icon icon="tabler:moon-filled" color="gray" />
                    </span>
                </span>
            </label>
        </li>
    );
};

export default DarkModeSwitcher;
