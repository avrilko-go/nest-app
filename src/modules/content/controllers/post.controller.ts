import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    SerializeOptions,
    UseInterceptors,
} from '@nestjs/common';

import { CreatePostDto, QueryPostDto, UpdatePostDto } from '@/modules/content/dtos';
import { PostService } from '@/modules/content/services/post.service';
import { AppInterceptor } from '@/modules/core/providers/app.interceptor';
import { DeleteWithTrashDto, RestoreDto } from '@/modules/restful/dtos';

@UseInterceptors(AppInterceptor)
@Controller('posts')
export class PostController {
    constructor(protected service: PostService) {}

    @Get()
    @SerializeOptions({ groups: ['post-list'] })
    async list(
        @Query()
        options: QueryPostDto,
    ) {
        return this.service.paginate(options);
    }

    @SerializeOptions({ groups: ['post-detail'] })
    @Post()
    async create(
        @Body()
        data: CreatePostDto,
    ) {
        return this.service.create(data);
    }

    @SerializeOptions({ groups: ['post-detail'] })
    @Get(':id')
    async detail(@Param('id', new ParseIntPipe()) id: number) {
        return this.service.detail(id);
    }

    @SerializeOptions({ groups: ['post-detail'] })
    @Patch()
    async update(
        @Body()
        data: UpdatePostDto,
    ) {
        return this.service.update(data);
    }

    @SerializeOptions({ groups: ['post-detail'] })
    @Delete()
    async delete(@Body() data: DeleteWithTrashDto) {
        const { ids, trash } = data;
        return this.service.delete(ids, trash);
    }

    @Patch('restore')
    @SerializeOptions({ groups: ['post-list'] })
    async restore(@Body() data: RestoreDto) {
        const { ids } = data;
        return this.service.restore(ids);
    }
}
