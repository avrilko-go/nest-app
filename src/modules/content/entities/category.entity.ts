import { Expose, Exclude, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';

import { PostEntity } from '@/modules/content/entities/post.entity';

@Exclude()
@Tree('materialized-path')
@Entity('categories')
export class CategoryEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('increment', { type: 'bigint', comment: '分类主键' })
    id: number;

    @Expose()
    @Column({ type: 'varchar', length: 100, nullable: false, default: '', comment: '分类名称' })
    name: string;

    @Expose({ groups: ['category-tree', 'category-list', 'category-detail'] })
    @Column({ type: 'int', default: 0, nullable: false, comment: '分类排序' })
    customOrder: number;

    @ManyToMany(() => PostEntity, (post) => post.categories, {
        createForeignKeyConstraints: false,
    })
    posts: PostEntity[];

    @Type(() => CategoryEntity)
    @Expose({ groups: ['category-list', 'category-detail'] })
    @TreeParent({ onDelete: 'NO ACTION' })
    parent: CategoryEntity | null;

    @Type(() => CategoryEntity)
    @Expose({ groups: ['category-tree'] })
    @TreeChildren({ cascade: true })
    children: CategoryEntity[];

    @Expose({ groups: ['category-list'] })
    depth = 0;
}
