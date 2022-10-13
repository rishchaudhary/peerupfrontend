import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name: faker.word.noun(100),
  tutorName: faker.name.findName(),
  avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  dateuploaded: faker.date.past().toDateString(),
  documenttype: "course content",
  dateAndTime: faker.date.future().toDateString(),
  location: faker.address.streetName(),
  rate: faker.commerce.price(10, 30),
  sessionsHosted: faker.random.numeric(),
  rating: faker.commerce.price(0, 5),
}));

export default users;
