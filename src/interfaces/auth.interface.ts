export interface DecodedToken {
  username: string
}

export interface MyCookie {
  jwt: string
}

export interface UserModel {
  username: string
  password: string
  refreshToken: string
}
