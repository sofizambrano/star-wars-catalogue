import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DetailedPerson } from '../types';
import { useEffect, useState } from 'react';
import { displayFieldName, formatValue } from '../utils';

export const PersonDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams();

  const [person, setPerson] = useState<DetailedPerson>();
  const [people, setPeople] = useState<Array<DetailedPerson>>([]);

  useEffect(() => {
    setPeople(state);
    setPerson(people.find((person) => person.id === params.personId));
  }, [params, state, people]);

  const noDisplayFields: Array<string> = ['url', 'id', 'name'];

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
                return personField === undefined ||
                  noDisplayFields.includes(field) ? null : (
                  <tr key={field}>
                    <td>{displayFieldName(field)}</td>
                    <td>{formatValue(field, personField, people)}</td>
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
