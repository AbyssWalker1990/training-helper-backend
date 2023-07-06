import { IsString, MinLength } from 'class-validator'

class CreateUserDto {
  @IsString()
  public username: string

  @MinLength(4)
  @IsString()
  public password: string

  constructor (username: string, password: string) {
    this.username = username
    this.password = password
  }
}

export default CreateUserDto
