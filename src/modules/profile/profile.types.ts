import { UserProfileSchema } from './profile.schema';

export type UserProfile = Pick<
  typeof UserProfileSchema,
  'email' | 'username' | 'firstName' | 'lastName' | 'middleName' | 'age'
>;
