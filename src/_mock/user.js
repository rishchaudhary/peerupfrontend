import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name: faker.word.noun(100),
  dateuploaded: faker.date.past().toDateString(),
  documenttype: "course content",
}));

export default users;
