import { TOKEN_KEY } from "../configs/constant";
import API from ".";

const interceptor = {
  setupInterceptors: () => {
    API.interceptors.request.use(
      (request) => {
        request.headers["Accept"] = `application/json`;
        request.headers["Access-Control-Allow-Origin"] = "*";
        // console.log("Type of",typeof(TOKEN_KEY))
        if (localStorage.getItem(TOKEN_KEY)) {
          request.headers.Authorization = `Bearer ${localStorage.getItem(
            TOKEN_KEY
          )}`;
        }
        return request;
      },
      (error) => {
        console.log("request.interceptors error", error);
        return Promise.reject(error);
      }
    );

    API.interceptors.response.use(
      (response) => {
        // console.log('interceptors ==>>>',response);
        if (response.status === 200 || response.status === 201) {
          return Promise.resolve(response.data);
        } else {
          return Promise.reject(response);
        }
      },
      (error) => {
        // console.log("Interceptor error>>>>>>>",error.response.status);
        if (error && error.response) {
          switch (error.response.status) {
            case 401:
              // store.dispatch({ type: "PURGE_AUTH" });
              localStorage.removeItem(TOKEN_KEY);
              break;
            default:
              break;
          }
        }
        return Promise.reject(error.response.data);
      }
    );
  },
};

export default interceptor;
