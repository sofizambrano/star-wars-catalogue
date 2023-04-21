import { ReactElement } from 'react';

import { DetailedPerson } from '../types';
import { filterFields } from './PeopleList';

interface Props {
  person: DetailedPerson;
  onClick: () => void;
}

function PersonRow({ person, onClick }: Props): ReactElement {
  const formatUnknowns = (paramValue: string | undefined) => {
    return paramValue === 'unknown' ? '-' : paramValue;
  };

  return (
    <tr onClick={onClick}>
      {filterFields.map((field) => (
        <td key={field}>{formatUnknowns(person[field])}</td>
      ))}
    </tr>
  );
}

export default PersonRow;
