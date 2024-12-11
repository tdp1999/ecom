import { Controller, Get } from '@nestjs/common';
import { Public } from '@shared/decorators/public.decorator';

@Controller()
export class AppController {
    constructor() {}

    @Public()
    @Get('/site-health')
    siteHealth(): string {
        return 'OK';
    }
}
