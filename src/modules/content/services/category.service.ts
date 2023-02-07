import { Injectable } from '@nestjs/common';

import { EntityNotFoundError } from 'typeorm';

import { CreateCategoryDto, QueryCategoryDto } from '@/modules/content/dtos';
import { CategoryEntity } from '@/modules/content/entities';
import { CategoryRepository } from '@/modules/content/repositories';
import { manualPaginate } from '@/modules/database/helpers';

@Injectable()
export class CategoryService {
    constructor(protected repository: CategoryRepository) {}

    async detail(id: number) {
        return this.repository.findOneByOrFail({ id });
    }

    async findTrees() {
        return this.repository.findTrees();
    }

    /**
     * 获取分页数据
     * @param options 分页选项
     */
    async paginate(options: QueryCategoryDto) {
        const tree = await this.repository.findTrees();
        const data = await this.repository.toFlatTrees(tree);
        return manualPaginate(options, data);
    }

    async create(data: CreateCategoryDto) {
        const item = await this.repository.save({
            ...data,
            parent: await this.getParent(undefined, data.parent),
        });
        return this.detail(item.id);
    }

    protected async getParent(current?: number, id?: number) {
        if (current === id) {
            return undefined;
        }
        let parent: CategoryEntity | undefined;
        if (id !== undefined) {
            if (id === null) {
                return null;
            }

            parent = await this.repository.findOne({ where: { id } });
            if (!parent) {
                throw new EntityNotFoundError(CategoryEntity, `Parent category ${id} not exists!`);
            }
        }

        return parent;
    }
}
