import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';

import { QueryPostDto } from '@/modules/content/dtos';
import { PostService } from '@/modules/content/services';

@Controller('posts')
export class PostController {
    constructor(protected service: PostService) {}

    @Get()
    async list(
        @Query(new ValidationPipe({ transform: true, validationError: { target: false } }))
        options: QueryPostDto,
    ) {
        return this.service.paginate(options);
    }
}
