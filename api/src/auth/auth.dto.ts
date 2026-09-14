import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from './auth.constants.js';

export class CredentialsDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @MaxLength(MAX_EMAIL_LENGTH)
  email!: string;

  @ApiProperty({
    minLength: MIN_PASSWORD_LENGTH,
    maxLength: MAX_PASSWORD_LENGTH,
  })
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  password!: string;
}

export class UserDto {
  @ApiProperty() id!: string;

  @ApiProperty() email!: string;

  @ApiProperty({ type: [String] }) permissions!: string[];
}

export class TokenDto {
  @ApiProperty() accessToken!: string;
}

export class AdfsLoginDto {
  @ApiProperty({
    description: 'ADFS token (mock: any nonblank value is accepted)',
  })
  @IsString()
  @Matches(/\S/, { message: 'adfsToken must not be blank' })
  adfsToken!: string;
}

export class LoginResponseDto extends TokenDto {
  @ApiProperty({ type: UserDto }) user!: UserDto;
}
