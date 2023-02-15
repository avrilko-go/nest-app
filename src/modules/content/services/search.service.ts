import { WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { instanceToPlain } from 'class-transformer';
import { pick } from 'lodash';

import { PostEntity } from '@/modules/content/entities';
import { PostSearchBody } from '@/modules/content/types';

@Injectable()
export class SearchService {
    index = 'posts';

    constructor(protected elasticsearchService: ElasticsearchService) {}

    async search(text: string) {
        const { hits } = await this.elasticsearchService.search<PostEntity>({
            index: this.index,
            query: {
                multi_match: { query: text, fields: ['title', 'body', 'summary', 'categories'] },
            },
        });

        return hits.hits.map((item) => item._source);
    }

    async create(post: PostEntity): Promise<WriteResponseBase> {
        return this.elasticsearchService.index<PostSearchBody>({
            index: this.index,
            document: {
                ...pick(instanceToPlain(post, { groups: ['post-detail'] }), [
                    'id',
                    'title',
                    'body',
                    'summary',
                ]),
                categories: (post.categories.map((v) => v.id.toString()) ?? []).join(','),
            },
        });
    }

    async update(post: PostEntity) {
        const newBody: PostSearchBody = {
            ...pick(instanceToPlain(post, { groups: ['post-detail'] }), [
                'title',
                'body',
                'summary',
            ]),
            categories: (post.categories.map((v) => v.id.toString()) ?? []).join(','),
        };
        const script = Object.entries(newBody).reduce(
            (result, [key, value]) => `${result} ctx._source["${key}"]="${value}";`,
            '',
        );
        return this.elasticsearchService.updateByQuery({
            index: this.index,
            query: { match: { id: post.id } },
            script,
        });
    }

    async remove(postId: number) {
        return this.elasticsearchService.deleteByQuery({
            index: this.index,
            query: { match: { id: postId } },
        });
    }
}
