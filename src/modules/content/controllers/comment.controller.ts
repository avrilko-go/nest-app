import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    SerializeOptions,
    UseInterceptors,
} from '@nestjs/common';

import { CreateCommentDto, QueryCommentDto, QueryCommentTreeDto } from '@/modules/content/dtos';
import { CommentService } from '@/modules/content/services';
import { AppInterceptor } from '@/modules/core/providers/app.interceptor';
import { DeleteDto } from '@/modules/restful/dtos';

@UseInterceptors(AppInterceptor)
@Controller('comments')
export class CommentController {
    constructor(protected service: CommentService) {}

    @Get('tree')
    @SerializeOptions({ groups: ['comment-tree'] })
    async tree(
        @Query()
        query: QueryCommentTreeDto,
    ) {
        return this.service.findTrees(query);
    }

    @Get()
    @SerializeOptions({ groups: ['comment-list'] })
    async list(
        @Query()
        query: QueryCommentDto,
    ) {
        return this.service.paginate(query);
    }

    @Post()
    @SerializeOptions({ groups: ['comment-detail'] })
    async store(
        @Body()
        data: CreateCommentDto,
    ) {
        return this.service.create(data);
    }

    @Delete(':id')
    @SerializeOptions({ groups: ['comment-detail'] })
    async delete(@Body() data: DeleteDto) {
        const { ids } = data;
        return this.service.delete(ids);
    }
}
