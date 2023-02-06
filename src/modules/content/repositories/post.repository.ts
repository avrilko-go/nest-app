import { Repository } from 'typeorm';

import { PostEntity } from '@/modules/content/entities';
import { CustomerRepository } from '@/modules/database/decorators/repository.decorator';

@CustomerRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
    buildBaseQB() {
        return this.createQueryBuilder('post');
    }
}
