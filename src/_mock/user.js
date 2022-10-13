import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  name: faker.word.noun(100),
  company: faker.date.past().toDateString(),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned']),
  role: faker.date.past().toDateString(),
}));

export default users;
