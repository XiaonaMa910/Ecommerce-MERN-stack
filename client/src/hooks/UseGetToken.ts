import { useCookies } from "react-cookie";

export const useGetToken=()=>{
    const [cookie,_]=useCookies(['access_token'])
    return {header:{authorization:cookie.access_token}}
}