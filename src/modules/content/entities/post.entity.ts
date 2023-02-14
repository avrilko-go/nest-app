import { Expose } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { PostType } from '@/modules/content/constans';
import { CategoryEntity } from '@/modules/content/entities/category.entity';
import { CommentEntity } from '@/modules/content/entities/comment.entity';

@Entity('posts')
export class PostEntity extends BaseEntity {
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
    @Column({ nullable: true, type: 'text', comment: '文章内容' })
    @Index({ fulltext: true })
    body!: string;

    @Expose()
    @Column({
        type: 'enum',
        nullable: false,
        default: PostType.HTML,
        comment: '文章类型',
        enum: PostType,
    })
    type!: PostType;

    @Expose()
    @Column({ nullable: false, default: 0, comment: '自定义排序' })
    customerOrder?: number;

    @Expose()
    @Column({ nullable: true, type: 'timestamp', comment: '发布时间' })
    publishedAt?: Date | null;

    @Expose()
    @CreateDateColumn({ nullable: true, type: 'timestamp', comment: '创建时间' })
    createdAt: Date;

    @Expose()
    @UpdateDateColumn({ nullable: true, type: 'timestamp', comment: '创建时间' })
    updatedAt: Date;

    @ManyToMany(() => CategoryEntity, (category) => category.posts, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    @JoinTable()
    categories!: CategoryEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.post, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    comments!: CommentEntity[];

    @Expose()
    commentCount: number;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, comment: '删除时间' })
    deletedAt: Date;
}
