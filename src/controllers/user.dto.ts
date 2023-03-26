import { IsString, MinLength } from 'class-validator'

class CreateUserDto {
  @IsString()
  public user: string

  @MinLength(4)
  @IsString()
  public password: string

  constructor (user: string, password: string) {
    this.user = user
    this.password = password
  }
}

export default CreateUserDto
