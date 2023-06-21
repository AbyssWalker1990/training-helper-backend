export interface DecodedToken {
  username: string
}

export interface MyCookie {
  jwt: string
}

export interface UserModel {
  save: () => unknown
  username: string
  password: string
  refreshToken: string
}
