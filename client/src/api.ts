import axios from 'axios';
const base = import.meta.env.VITE_API_URL || 'https://nutrify-ai.onrender.com/api';
export const api=axios.create({baseURL:base,withCredentials:true,headers:{'Content-Type':'application/json'}});
let accessToken:string|null=localStorage.getItem('nutrify_access');
export const setToken=(token:string|null)=>{accessToken=token;if(token)localStorage.setItem('nutrify_access',token);else localStorage.removeItem('nutrify_access');};
api.interceptors.request.use(config=>{if(accessToken)config.headers.Authorization=`Bearer ${accessToken}`;return config;});
let refreshing:Promise<any>|null=null;
api.interceptors.response.use(r=>r,async error=>{const original=error.config;if(error.response?.status===401&&!original?._retry&&!original.url?.includes('/auth/')){original._retry=true;try{refreshing??=axios.post(`${base}/auth/refresh`,{}, {withCredentials:true}).then(r=>{setToken(r.data.accessToken);return r.data.accessToken;}).finally(()=>{refreshing=null;});const token=await refreshing;original.headers.Authorization=`Bearer ${token}`;return api(original);}catch{setToken(null);}}return Promise.reject(error);});
export const friendlyError=(e:any)=>e?.response?.data?.message||e?.message||'Something went wrong';
