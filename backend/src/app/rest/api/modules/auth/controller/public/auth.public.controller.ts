import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '@app/modules/auth/auth.service';
import { AuthPublicLoginDto } from '@app/app/rest/api/modules/auth/controller/public/request/auth.public.login.dto';
import { AuthPublicLoginResponse } from '@app/app/rest/api/modules/auth/controller/public/response/auth.public.login.response';
import { Public } from '@app/shared/nestjs-auth/decorator/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthPublicController {
  public constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: AuthPublicLoginDto })
  @ApiOkResponse({ type: AuthPublicLoginResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  public async login(
    @Body() body: AuthPublicLoginDto,
  ): Promise<AuthPublicLoginResponse> {
    const authToken = await this.authService.login(body.email, body.password);
    return new AuthPublicLoginResponse(authToken);
  }
}
