import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { PostType } from '@/modules/content/constans';
import { PostEntity } from '@/modules/content/entities';
import { SanitizeService } from '@/modules/content/services';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<PostEntity> {
    constructor(protected dataSource: DataSource, protected sanitizeService: SanitizeService) {
        this.dataSource.subscribers.push(this);
    }

    public listenTo() {
        return PostEntity;
    }

    async afterLoad(entity: PostEntity) {
        if (entity.type === PostType.HTML) {
            entity.body = this.sanitizeService.sanitize(entity.body);
        }
    }
}
