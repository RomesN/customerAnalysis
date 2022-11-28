import React, { useContext, ReactNode } from "react";
import { useState } from "react";

type CustomerAnalysisContextType = {
    getPage: () => Number;
    setPageState: (newPage: number) => void;
};

type Props = {
    children?: ReactNode;
};

export const CustomerAnalysisContext = React.createContext({} as CustomerAnalysisContextType);

export function useCustomerAnalysisContext() {
    return useContext(CustomerAnalysisContext);
}

export const CustomerAnalysisContextProvider = ({ children }: Props) => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState(null);

    function getPage() {
        return page;
    }

    function setPageState(newPage: number) {
        setPage(newPage);
    }

    return (
        <CustomerAnalysisContext.Provider
            value={{
                getPage,
                setPageState,
            }}
        >
            {children}
        </CustomerAnalysisContext.Provider>
    );
};
