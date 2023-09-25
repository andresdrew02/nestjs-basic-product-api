import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint } from 'class-validator';
import { PrismaService } from 'src/db/PrismaService';
import { Prisma } from '@prisma/client'

@ValidatorConstraint({ async: true })
export class IsValidIdConstraint {

    async validate(id: number, args: ValidationArguments) {
        const tableName = args.constraints[0];
        const prisma = PrismaService.getInstance().getClient();
        const sql = `SELECT * FROM ${tableName} WHERE id = ${id}`;
        const result: [] = await prisma.$queryRaw`${Prisma.raw(sql)}`
        return result.length > 0
    }
}

export function IsValidId(tableName: string, validationOptions?: ValidationOptions) {
    return (object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [tableName],
            validator: IsValidIdConstraint,
        });
    };
}
