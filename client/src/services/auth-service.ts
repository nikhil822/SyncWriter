import API from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password1: string;
  password2: string;
}

interface RefreshTokenPayload {
  token: string;
}

const AuthService = {
  login: (payload: LoginPayload) => {
    return API.post("auth/login", payload);
  },
  register: (payload: RegisterPayload) => {
    return API.post("user", payload);
  },
  refreshToken: (payload: RefreshTokenPayload) => {
    return API.post("auth/refresh-token", payload);
  },
  logout: (accessToken: string) => {
    return API.delete("auth/logout", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  verifyEmail: (token: string) => {
    return API.put(`user/verify-email/${token}`);
  },
};

export default AuthService;
