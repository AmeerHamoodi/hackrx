import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  buildMessage,
} from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';
import { getManager } from 'typeorm';

/**
 * When using this decorator, you must pass in the table name as the first parameter.
 * Additionally, the property name the decorator is put above must be the same as the column name
 */
export function IsUnique(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const [table] = args.constraints;
          const queryBuilder = getManager()
            .getRepository(User)
            .createQueryBuilder(table);

          return (
            (await await queryBuilder
              .where(`${propertyName} = :value`, { value })
              .getCount()) == 0
          );
        },

        defaultMessage: buildMessage(
          () => `${propertyName} already exists`,
          validationOptions,
        ),
      },
    });
  };
}
