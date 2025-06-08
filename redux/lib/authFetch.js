export const authFetch = async (url, options = {}) => {
    // 🔐 Hardcoded username and password
    const username = process.env.API_USERNAME;
    const password = process.env.API_PASSWORD;
    const token = Buffer.from(`${username}:${password}`).toString('base64');
  
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Basic ${token}`,
      },
    });
  
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Error ${res.status}: ${error}`);
    }
  
    return res;
  };