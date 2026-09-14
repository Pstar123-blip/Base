import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class UserDto {
  @ApiProperty() id!: string;

  @ApiProperty() username!: string;
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
