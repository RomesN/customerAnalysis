import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useQueryParam(paramName: string) {
    const [searchParams, setSearchParams] = useSearchParams();
    const param = searchParams.get(paramName);
    const [state, setState] = useState<string | null>(param);

    useEffect(() => {
        if (state && param !== state) {
            searchParams.set(paramName, state);
            setSearchParams(searchParams);
        }
    }, [state]);

    useEffect(() => {
        if (param !== state) {
            setState(param);
        }
    }, [param]);

    return [state, setState] as [typeof state, typeof setState];
}
