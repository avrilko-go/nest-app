import { Repository } from 'typeorm';

import { CategoryEntity, PostEntity } from '@/modules/content/entities';
import { CustomerRepository } from '@/modules/database/decorators/repository.decorator';

@CustomerRepository(CategoryEntity)
export class CategoryRepository extends Repository<PostEntity> {
    buildBaseQB() {
        return this.createQueryBuilder('category');
    }
}
