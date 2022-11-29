import { ReactNode } from "react";

export type Props = {
    children?: ReactNode;
};

export type Response = {
    ["winstrom"]: ResponseProperty;
};

export type ResponseProperty = {
    ["@version"]: string;
    ["@rowCount"]?: string;
    adresar: Customer[];
};

export type Customer = {
    id: number;
    lastUpdate: string;
    kod: string;
    nazev: string;
    ic: string;
    dic: string;
    ulice: string;
    mesto: string;
    psc: string;
    stat: string;
};

export type FilterCategory = {
    name: string;
    records: number;
};

export type PostalCode = {
    id: number;
    psc: string;
};
