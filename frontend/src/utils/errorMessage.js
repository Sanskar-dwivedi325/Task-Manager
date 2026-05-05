export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Cannot reach the API. Check that the backend is running and that the frontend URL is allowed by CORS.';
  }

  const data = error.response?.data;
  if (data?.validationErrors) {
    return Object.values(data.validationErrors)[0] || fallback;
  }
  return data?.message || error.message || fallback;
}
