import axios from "axios";
import { Response } from "../shared/types";
import { calculatePostalCodesCategories } from "../utils/helperFuncions";

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { "Content-Type": "application/json" },
});

export const getPostalCountStartingWithNumber = (inspected: number | string) => {
    return api
        .get<Response>(`/v2/c/demo/adresar/(psc begins '${inspected}').json`, {
            params: { ["add-row-count"]: true },
        })
        .then((response) => {
            let responseData: string | undefined = response.data.winstrom["@rowCount"];
            return responseData ? responseData : "0";
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                console.log(error.message);
                return error.message;
            }
        });
};

export const getPostalCountEmpty = () => {
    return api
        .get<Response>(`/v2/c/demo/adresar/(psc is null).json`, { params: { ["add-row-count"]: true } })
        .then((response) => {
            return response.data.winstrom["@rowCount"];
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                console.log(error.message);
                return error;
            }
        });
};

export const getPostalCountAll = () => {
    return api
        .get<Response>(`/v2/c/demo/adresar.json`, { params: { ["add-row-count"]: true } })
        .then((response) => {
            return response.data.winstrom["@rowCount"];
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                return error;
            }
        });
};

export const getAllEmpty = () => {
    return api
        .get<Response>(`/v2/c/demo/adresar/(psc is null).json`, { params: { limit: 0 } })
        .then((response) => {
            return response.data.winstrom.adresar;
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                return error;
            }
        });
};

export const getAllData = () => {
    return api
        .get<Response>(`/v2/c/demo/adresar.json`, { params: { limit: 0 } })
        .then((response) => {
            return response.data.winstrom.adresar;
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                return error;
            }
        });
};

export const getFilteredData = async (filter: string) => {
    const numberPart = filter.replace("others", "");
    let result = await api
        .get<Response>(`/v2/c/demo/adresar/(psc begins '${numberPart}').json`, { params: { limit: 0 } })
        .then(async (response) => {
            if (filter.includes("others")) {
                const categories = await calculatePostalCodesCategories(numberPart);
                const filterOutStart = categories.othersContainZero ? 1 : 0;
                const onlyOther = numberPart.length === 0 ? "^" : "";
                return response.data.winstrom.adresar.filter((customer) => {
                    return RegExp(`${numberPart}${onlyOther}[^${filterOutStart}-9]`, "g").test(customer.psc);
                });
            } else {
                return response.data.winstrom.adresar;
            }
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                return error;
            }
        });
    if (numberPart.length === 0) {
        const notFilled = await getAllEmpty();
        if (Array.isArray(notFilled) && Array.isArray(result)) {
            result = [...result, ...notFilled];
        }
    }
    return result;
};
