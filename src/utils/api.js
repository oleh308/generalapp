import axios from 'axios';

function buildCall(setAuthenticated) {
  axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response && error.response.data) {
      if (error.response.data.type === 'tokenExpired' || error.response.data.type === 'tokenInvalid') {
        setAuthenticated(false)
      }
    }
    return Promise.reject(error);
  });

  return axios;
}


export default buildCall;
