import { DetailedPerson, ResponsePerson } from './types';
import {
  page1,
  page2,
  page3,
  page4,
  page5,
  page6,
  page7,
  page8,
  page9,
} from './people';

const getIdFromUrl = (url: string): string => {
  return url.split('/')[5];
};

export const fetchPeople = (): Array<DetailedPerson> => {
  const response = [
    ...page1.results,
    ...page2.results,
    ...page3.results,
    ...page4.results,
    ...page5.results,
    ...page6.results,
    ...page7.results,
    ...page8.results,
    ...page9.results,
  ] as Array<ResponsePerson>;
  const people = response.map((person) => {
    return {
      ...person,
      id: getIdFromUrl(person.url),
      homeworld: getIdFromUrl(person.homeworld),
      films: person.films.map((film) => getIdFromUrl(film)),
      species: person.species.map((specie) => getIdFromUrl(specie)),
      vehicles: person.vehicles.map((vehicle) => getIdFromUrl(vehicle)),
      starships: person.starships.map((starship) => getIdFromUrl(starship)),
      homeworld_mates: response
        .filter(
          (otherPerson) =>
            otherPerson.homeworld === person.homeworld &&
            otherPerson.url !== person.url
        )
        .map((homeworldMate) => ({
          id: getIdFromUrl(homeworldMate.url),
          name: homeworldMate.name,
        })),
    };
  });
  return people;
};
