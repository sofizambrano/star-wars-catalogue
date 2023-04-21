import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { DetailedPerson, HomeworldMate } from '../types';
import { useEffect, useState } from 'react';

export const PersonDetails = () => {
  const [person, setPerson] = useState<DetailedPerson>();
  const [people, setPeople] = useState<Array<DetailedPerson>>([]);
  const { state } = useLocation();
  const params = useParams();

  useEffect(() => {
    setPeople(state);
    const { personId } = params;
    setPerson(people.find((person) => person.id === personId));
  }, [params, state, people]);
  const navigate = useNavigate();

  const noDisplayFields: Array<string> = ['url', 'id', 'name'];

  const formatValue = (
    field: string,
    personField: string | Array<string> | Array<HomeworldMate>
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

  return (
    <div className="page">
      {person === undefined ? (
        <h5>No person found</h5>
      ) : (
        <>
          <div className="sectionHeader">
            <h3>{person.name}</h3>
            <button onClick={() => navigate(-1)} className="button">
              Go back
            </button>
          </div>
          <table className="table">
            <tbody>
              {Object.keys(person).map((field) => {
                const personField = person[field as keyof DetailedPerson];
                if (
                  personField === undefined ||
                  noDisplayFields.includes(field)
                ) {
                  return null;
                }
                return (
                  <tr key={field}>
                    <td>{field.split('_').join(' ')}</td>
                    <td>{formatValue(field, personField)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
