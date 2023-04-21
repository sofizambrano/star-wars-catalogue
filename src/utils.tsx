import { Link } from 'react-router-dom';
import { ListedPerson, DetailedPerson, HomeworldMate } from './types';

export const displayFieldName = (fieldName: string): string => {
  return fieldName.split('_').join(' ');
};

export const getFieldOptions = (
  people: Array<DetailedPerson>,
  field: keyof ListedPerson
): Array<string> => {
  const removeSorroundingSpaces = (option: string) => option.trim();
  return Array.from(
    new Set(
      people.flatMap((person) =>
        person[field].split(',').map(removeSorroundingSpaces)
      )
    )
  ).sort();
};

const homeworldMateLink = (
  homeworldMate: HomeworldMate,
  people: Array<DetailedPerson>
) => {
  const { id, name } = homeworldMate;
  return (
    <Link
      key={id}
      to={`/people/${id}`}
      state={people}
      className="homeworldMateLink"
    >
      {name}
    </Link>
  );
};

export const formatValue = (
  field: string,
  personField: string | Array<string> | Array<HomeworldMate>,
  people: Array<DetailedPerson>
): string | JSX.Element => {
  if (Array.isArray(personField)) {
    if (personField.length === 0) return '-';
    return personField[0].hasOwnProperty('name') ? (
      <>
        {personField.map((homeworldMate) =>
          homeworldMateLink(homeworldMate as HomeworldMate, people)
        )}
      </>
    ) : (
      personField.join(', ')
    );
  }
  if (field === 'created' || field === 'edited')
    return new Date(personField).toLocaleString();
  return personField;
};

export const meetsFilter = (
  param: keyof ListedPerson,
  value: string,
  person: DetailedPerson
): boolean | undefined => {
  const nonStrictEqualValueFields: Array<keyof ListedPerson> = [
    'name',
    'hair_color',
    'skin_color',
    'eye_color',
  ];
  return nonStrictEqualValueFields.includes(param)
    ? person[param]?.toString().toLowerCase().includes(value.toLowerCase())
    : person[param] === value;
};

const numericFields: Array<keyof ListedPerson> = [
  'height',
  'mass',
  'homeworld',
];

export const sortPeople = ({
  people,
  sortField,
  reverse,
}: {
  people: Array<DetailedPerson>;
  sortField: keyof ListedPerson;
  reverse: boolean;
}) => {
  if (!sortField) return people;

  const sortedData = people.sort((a, b) => {
    if (sortField === 'birth_year') {
      const getYear = (person: DetailedPerson) => {
        return parseInt(person[sortField].split('BBY')[0]);
      };
      return getYear(a) > getYear(b) ? 1 : -1;
    }
    if (numericFields.includes(sortField))
      return +a[sortField] > +b[sortField] ? 1 : -1;
    return a[sortField] > b[sortField] ? 1 : -1;
  });

  if (reverse) {
    return sortedData.reverse();
  }

  return people;
};
