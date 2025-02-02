declare global {
  interface ResponseMessage {
    msg: string;
  }

  interface RequstUser {
    id: string,
    email: string,
    roles: Array<string>
  }

  interface TokenPair {
    accessToken: string,
    refreshToken: string
  }
}

export { ResponseMessage, RequstUser, TokenPair };