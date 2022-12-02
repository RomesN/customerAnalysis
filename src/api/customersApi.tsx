import axios from "axios";
import { Response } from "../shared/types";

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { "Content-Type": "application/json" },
});

export const getAllPostals = () => {
    return api
        .get<Response>(`/v2/c/demo/adresar.json`, {
            params: { detail: "custom:psc", limit: 0 },
        })
        .then((response) => {
            return response.data.winstrom.adresar;
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                console.log(error.message);
                return error.message;
            }
        });
};

export const getCountPostalEqual = (postalCode: string) => {
    return api
        .get<Response>(`/v2/c/demo/adresar/(psc='${postalCode}').json`, {
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

export const getFilteredPostals = (filter: string) => {
    return api
        .get<Response>(`/v2/c/demo/adresar/(psc begins '${filter}').json`, {
            params: { detail: "custom:psc", limit: 0 },
        })
        .then((response) => {
            return response.data.winstrom.adresar;
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                console.log(error.message);
                return error.message;
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
                console.log(error.message);
                return error.message;
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
                console.log(error.message);
                return error.message;
            }
        });
};

export const getAllEqualTo = (postalCode: string) => {
    return api
        .get<Response>(`/v2/c/demo/adresar/(psc='${postalCode}').json`, {
            params: { ["add-row-count"]: true, limit: 0 },
        })
        .then((response) => {
            return response.data.winstrom.adresar;
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                console.log(error.message);
                return error.message;
            }
        });
};

export const getPostalDataStartingWith = (inspected: string) => {
    return api
        .get<Response>(`/v2/c/demo/adresar/(psc begins '${inspected}').json`, {
            params: { ["add-row-count"]: true, limit: 0 },
        })
        .then((response) => {
            return response.data.winstrom.adresar;
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                console.log(error.message);
                return error.message;
            }
        });
};
