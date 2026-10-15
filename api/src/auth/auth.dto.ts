import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty() id!: string;

  @ApiProperty() username!: string;
}

export class TokenDto {
  @ApiProperty() accessToken!: string;
}

export class LoginResponseDto extends TokenDto {
  @ApiProperty({ type: UserDto }) user!: UserDto;
}
