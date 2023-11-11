import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Button } from "@min98/ui";

const NotFound: React.FC = () => {
    const history = useNavigate();
    const { t } = useTranslation();
    return (
        <div className="h-screen w-screen bg-gray-50 flex items-center">
            <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
                <div className="w-full lg:w-1/2 mx-8">
                    <div className="text-7xl text-green-500 font-dark font-extrabold mb-8">
                        {" "}
                        404
                    </div>
                    <p className="text-2xl md:text-3xl font-light leading-normal mb-8">
                        Sorry we couldn't find the page you're looking for
                    </p>
                    <Button color="primary-light" onClick={() => history("/")}>
                        <Icon icon="tabler:arrow-back-up" /> {t("page.back")}
                    </Button>
                </div>
            </div>
            <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
                <img
                    src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg"
                    className=""
                    alt="Page not found"
                />
            </div>
        </div>
    );
};

export default NotFound;
