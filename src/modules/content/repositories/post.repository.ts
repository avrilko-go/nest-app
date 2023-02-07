import { Repository } from 'typeorm';

import { CommentEntity, PostEntity } from '@/modules/content/entities';
import { CustomerRepository } from '@/modules/database/decorators/repository.decorator';

@CustomerRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
    buildBaseQB() {
        return this.createQueryBuilder('post')
            .leftJoinAndSelect('post.categories', 'categories')
            .addSelect((subQuery) => {
                return subQuery
                    .select('count(c.id)', 'count')
                    .from(CommentEntity, 'c')
                    .where('c.post.id = post.id');
            }, 'commentCount')
            .loadRelationCountAndMap('post.commentCount', 'post.comments');
    }
}
