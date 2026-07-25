import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from './decorator/public-decorator';
import { CurrentUser } from './decorator/current-user.decorator';
import { Request, Response } from 'express';


@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

@Post('logout')
async logout(
  @CurrentUser() user: { id: number },
  @Body('refresh_token') refreshToken: string,
) {
  return this.authService.logout(user.id, refreshToken);
}

@Public()
@Post('refresh')
async refresh(@Body('refresh_token') refreshToken: string) {
  return this.authService.refresh(refreshToken);
}

}
