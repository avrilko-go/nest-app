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

import {
    CreateCategoryDto,
    QueryCategoryDto,
    QueryCategoryTreeDto,
    UpdateCategoryDto,
} from '@/modules/content/dtos';
import { CategoryService } from '@/modules/content/services';
import { AppInterceptor } from '@/modules/core/providers/app.interceptor';
import { DeleteWithTrashDto, RestoreDto } from '@/modules/restful/dtos';

@UseInterceptors(AppInterceptor)
@Controller('categories')
export class CategoryController {
    constructor(protected categoryService: CategoryService) {}

    @Get('tree')
    @SerializeOptions({ groups: ['category-tree'] })
    async tree(@Query() options: QueryCategoryTreeDto) {
        return this.categoryService.findTrees(options);
    }

    @Get()
    @SerializeOptions({ groups: ['category-list'] })
    async list(
        @Query()
        options: QueryCategoryDto,
    ) {
        return this.categoryService.paginate(options);
    }

    @Post()
    @SerializeOptions({ groups: ['category-detail'] })
    async store(
        @Body()
        data: CreateCategoryDto,
    ) {
        return this.categoryService.create(data);
    }

    @Get(':id')
    @SerializeOptions({ groups: ['category-detail'] })
    async detail(
        @Param('id', new ParseIntPipe())
        id: number,
    ) {
        return this.categoryService.detail(id);
    }

    @Patch()
    @SerializeOptions({ groups: ['category-detail'] })
    async update(
        @Body()
        data: UpdateCategoryDto,
    ) {
        return this.categoryService.update(data);
    }

    @Delete()
    @SerializeOptions({ groups: ['category-detail'] })
    async delete(@Body() data: DeleteWithTrashDto) {
        const { ids, trash } = data;
        return this.categoryService.delete(ids, trash);
    }

    @Patch('restore')
    @SerializeOptions({ groups: ['category-list'] })
    async restore(
        @Body()
        data: RestoreDto,
    ) {
        const { ids } = data;
        return this.categoryService.restore(ids);
    }
}
