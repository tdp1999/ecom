import { USER_STATUS } from '@shared/enums/shared-user.enum';
import { SharedUserSchema } from '@shared/models/user.shared.model';
import { z } from 'zod';

export type UserValidityResult =
    | { isValid: true; status: USER_STATUS.ACTIVE }
    | {
          isValid: false;
          status: USER_STATUS.INACTIVE | USER_STATUS.DELETED | USER_STATUS.BANNED | USER_STATUS.PENDING;
          invalidMessage?: string;
      };

export type SharedUser = z.infer<typeof SharedUserSchema>;
