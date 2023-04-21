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

export const formatValue = (
  field: string,
  personField: string | Array<string> | Array<HomeworldMate>,
  people: Array<DetailedPerson>
): string | JSX.Element => {
  if (Array.isArray(personField)) {
    if (personField.length === 0) return '-';
    return personField[0].hasOwnProperty('name') ? (
      <>
        {personField.map((homeworldMate) => {
          const { id, name } = homeworldMate as HomeworldMate;
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
        })}
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
