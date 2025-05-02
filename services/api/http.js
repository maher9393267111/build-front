import axios from 'axios';

function getToken() {
  const cname = 'token';
  if (typeof window !== 'undefined') {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document?.cookie);
  //  console.log("🔶️🔶️🔶️COOKIES🔶️🔶️🔶️" , decodedCookie)
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
  return '';
}

const baseURL = "https://build-back.vercel.app"
const localURL = "http://localhost:3001"

const http = axios.create({
  baseURL: baselURL + `/api`,
  timeout: 12000, // 10 second timeout
  retryDelay: 1000,
  maxRetries: 3,
});

http.interceptors.request.use(
  (config) => {
    const token = getToken();
  //  console.log("🔶️🔶️🔶️TOKEN🔶️🔶️🔶️" , token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


//service categories api






export default http;



