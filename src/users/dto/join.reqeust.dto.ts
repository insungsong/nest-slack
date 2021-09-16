import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'test@gmai.com',
    description: '이메일',
    required: true,
  })
  public email: string;

  @ApiProperty({ example: '송코딩', description: '닉네임' })
  public nickname: string;

  @ApiProperty({ example: '123123!', description: '비밀번호', required: true })
  public password: string;
}
