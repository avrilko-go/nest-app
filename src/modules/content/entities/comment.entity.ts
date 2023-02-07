import { Exclude, Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';

import { PostEntity } from '@/modules/content/entities/post.entity';

@Exclude()
@Tree('materialized-path')
@Entity('comments')
export class CommentEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('increment', { type: 'bigint', comment: '评论主键' })
    id!: number;

    @Expose()
    @Column({ type: 'longtext', comment: '评论内容' })
    body!: string;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({ type: 'datetime', comment: '创建时间', nullable: true })
    createdAt!: Date;

    @Expose()
    depth = 0;

    @Expose()
    @ManyToOne(() => PostEntity, (post) => post.comments, {
        createForeignKeyConstraints: false,
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    post!: PostEntity;

    @Type(() => CommentEntity)
    @TreeParent({ onDelete: 'CASCADE' })
    parent!: CommentEntity | null;

    @Type(() => CommentEntity)
    @Expose()
    @TreeChildren({ cascade: true })
    children!: CommentEntity[];
}
