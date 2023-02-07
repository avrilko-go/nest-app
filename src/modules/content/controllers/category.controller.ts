import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';

import { CreateCategoryDto, QueryCategoryDto } from '@/modules/content/dtos';
import { CategoryService } from '@/modules/content/services';
import { AppInterceptor } from '@/modules/core/providers/app.interceptor';

@UseInterceptors(AppInterceptor)
@Controller('categories')
export class CategoryController {
    constructor(protected categoryService: CategoryService) {}

    @Get('tree')
    async tree() {
        return this.categoryService.findTrees();
    }

    @Get()
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
}
