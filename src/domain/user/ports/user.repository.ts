import type { ReadUseCase } from '../../common';
import type { User } from '../entities/user.entity';

export type UserRepository = ReadUseCase<User>;
