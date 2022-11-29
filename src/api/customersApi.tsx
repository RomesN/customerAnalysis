import axios, { AxiosError, AxiosInstance } from "axios";
import { Response } from "../shared/types";

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { "Content-Type": "application/json" },
});

export const getPostalCountStartingWithNumber = (inspected: number | string) => {
    return api
        .get<Response>(`/v2/c/demo/adresar/(psc begins '${inspected}').json?add-row-count=true`, {
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
