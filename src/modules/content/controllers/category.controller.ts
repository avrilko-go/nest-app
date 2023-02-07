import { Body, Controller, Get, Post, UseInterceptors, ValidationPipe } from '@nestjs/common';

import { CreateCategoryDto } from '@/modules/content/dtos';
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
