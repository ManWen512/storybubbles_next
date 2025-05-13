

export const authFetch = async (url, options = {}) => {
    // 🔐 Hardcoded username and password
    const username = process.env.NEXT_PUBLIC_USERNAME;
    const password = process.env.NEXT_PUBLIC_PASSWORD;
    const token = btoa(`${username}:${password}`);
  
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
  