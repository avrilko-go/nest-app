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
    ValidationPipe,
} from '@nestjs/common';

import { CreateCategoryDto, QueryCategoryDto, UpdateCategoryDto } from '@/modules/content/dtos';
import { CategoryService } from '@/modules/content/services';
import { AppInterceptor } from '@/modules/core/providers/app.interceptor';

@UseInterceptors(AppInterceptor)
@Controller('categories')
export class CategoryController {
    constructor(protected categoryService: CategoryService) {}

    @Get('tree')
    @SerializeOptions({ groups: ['category-tree'] })
    async tree() {
        return this.categoryService.findTrees();
    }

    @Get()
    @SerializeOptions({ groups: ['category-list'] })
    async list(
        @Query(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        )
        options: QueryCategoryDto,
    ) {
        return this.categoryService.paginate(options);
    }

    @Post()
    @SerializeOptions({ groups: ['category-detail'] })
    async store(
        @Body(
            new ValidationPipe({
                transform: true,
                validationError: { target: false },
            }),
        )
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
        @Body(
            new ValidationPipe({
                transform: true,
                validationError: { target: false },
                groups: ['update'],
            }),
        )
        data: UpdateCategoryDto,
    ) {
        return this.categoryService.update(data);
    }

    @Delete(':id')
    @SerializeOptions({ groups: ['category-detail'] })
    async delete(@Param('id', new ParseIntPipe()) id: number) {
        return this.categoryService.delete(id);
    }
}
