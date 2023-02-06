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
    @PrimaryGeneratedColumn('increment', { type: 'bigint', comment: '文章主键' })
    id!: number;

    @Column({ nullable: false, default: '', type: 'varchar', length: 255, comment: '文章标题' })
    title!: string;

    @Column({ nullable: true, type: 'json', comment: '关键词' })
    keywords?: string[];

    @Column({ nullable: false, default: '', length: 255, comment: '文章描述' })
    summary?: string;

    @Column({ nullable: true, type: 'longtext', comment: '文章内容' })
    body!: string;

    @Column({ nullable: false, default: PostType.HTML, comment: '文章类型', enum: PostType })
    type!: PostType;

    @Column({ nullable: false, default: 0, comment: '自定义排序' })
    customerOrder?: number;

    @Column({ nullable: true, type: 'datetime', comment: '发布时间' })
    publishedAt?: Date | null;

    @CreateDateColumn()
    @Column({ nullable: true, type: 'datetime', comment: '创建时间' })
    createdAt: Date;

    @UpdateDateColumn()
    @Column({ nullable: true, type: 'datetime', comment: '创建时间' })
    updatedAt: Date;
}
