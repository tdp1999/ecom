import { ERR_BRAND_NAME_DUPLICATED } from '@brand/domain/model/brand.error';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { BaseCrudService } from '@shared/abstractions/service.base';
import { BadRequestError, NotSupportedMethodError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import {
    BrandCreateDto,
    BrandCreateSchema,
    BrandFindOneDto,
    BrandFindOneSchema,
    BrandSearchDto,
    BrandSearchSchema,
    BrandUpdateDto,
    BrandUpdateSchema,
} from '../model/brand.dto';
import { Brand } from '../model/brand.model';
import { BRAND_REPOSITORY_TOKEN, IBrandRepository } from '../ports/brand-repository.interface';
import { IBrandService } from '../ports/brand-service.interface';

@Injectable()
export class BrandService
    extends BaseCrudService<Brand, BrandCreateDto, BrandUpdateDto, BrandSearchDto>
    implements IBrandService
{
    override visibleColumns: (keyof Brand)[] = ['id', 'name', 'description'];

    constructor(
        @Optional() @Inject(MODULE_IDENTIFIER) protected readonly moduleName: string = '',
        @Inject(BRAND_REPOSITORY_TOKEN) protected readonly repository: IBrandRepository,
    ) {
        super(moduleName, repository);
    }

    protected createSchema = BrandCreateSchema;
    protected updateSchema = BrandUpdateSchema;
    protected searchSchema = BrandSearchSchema;

    getByConditions(conditions?: BrandFindOneDto): Promise<Brand | null> {
        if (!conditions) throw BadRequestError('Missing conditions');

        if (!this.repository.findByConditions) throw NotSupportedMethodError();

        const { success, error, data } = BrandFindOneSchema.safeParse(conditions);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        return this.repository.findByConditions(data, this.visibleColumns);
    }

    protected async validateCreate(data: BrandCreateDto): Promise<void> {
        const duplicatedBrand = await this.getByConditions({ name: data.name });

        if (duplicatedBrand) {
            throw BadRequestError(ERR_BRAND_NAME_DUPLICATED.message);
        }
    }

    protected validateUpdate(): Promise<void> {
        return Promise.resolve();
    }
}
