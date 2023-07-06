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

export interface PropertyFindUser {
  username?: string
  refreshToken?: string
}

export interface UserDocument extends UserModel, Document { }
