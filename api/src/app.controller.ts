import { Controller, Get } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  @Get('health')
  @ApiOperation({
    summary: 'Check health',
  })
  checkHealth() {
    return 'Hello, I good! test ci cd';
  }
}
