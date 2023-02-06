import { Expose } from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { PostType } from '@/modules/content/constans';

@Entity('posts')
export class PostEntity {
    @Expose()
    @PrimaryGeneratedColumn('increment', { type: 'bigint', comment: '文章主键' })
    id!: number;

    @Expose()
    @Column({ nullable: false, default: '', type: 'varchar', length: 255, comment: '文章标题' })
    title!: string;

    @Expose()
    @Column({ nullable: true, type: 'json', comment: '关键词' })
    keywords?: string[];

    @Expose()
    @Column({ nullable: false, default: '', length: 255, comment: '文章描述' })
    summary?: string;

    @Expose({ groups: ['post-detail'] })
    @Column({ nullable: true, type: 'longtext', comment: '文章内容' })
    body!: string;

    @Expose()
    @Column({ nullable: false, default: PostType.HTML, comment: '文章类型', enum: PostType })
    type!: PostType;

    @Expose()
    @Column({ nullable: false, default: 0, comment: '自定义排序' })
    customerOrder?: number;

    @Expose()
    @Column({ nullable: true, type: 'datetime', comment: '发布时间' })
    publishedAt?: Date | null;

    @Expose()
    @CreateDateColumn({ nullable: true, type: 'datetime', comment: '创建时间' })
    createdAt: Date;

    @Expose()
    @UpdateDateColumn({ nullable: true, type: 'datetime', comment: '创建时间' })
    updatedAt: Date;
}
