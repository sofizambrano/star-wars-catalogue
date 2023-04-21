import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import PersonRow from './PersonRow';
import { DetailedPerson, ListedPerson } from '../types';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchPeople } from '../api';
import { displayFieldName, getFieldOptions, meetsFilter } from '../utils';

type Field = keyof ListedPerson;

export const filterFields: Array<Field> = [
  'name',
  'height',
  'mass',
  'hair_color',
  'skin_color',
  'eye_color',
  'birth_year',
  'gender',
  'homeworld',
];

function PeopleList(): ReactElement {
  const navigate = useNavigate();

  const [people, setPeople] = useState<Array<DetailedPerson>>([]);
  const [filteredPeople, setFilteredPeople] = useState<Array<DetailedPerson>>(
    []
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>('');

  const extendSearchParams = (param: Field, value: string) => {
    searchParams.set(param, value);
    setSearchParams(searchParams);
  };

  const onSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    setSearchValue(value);
    extendSearchParams('name', value);
  };

  const onFilterChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
    param: Field
  ) => {
    const value = e.target.value.toString();
    extendSearchParams(param, value);
  };

  const resetFilters = () => {
    setSearchValue('');
    setSearchParams({});
  };

  useEffect(() => {
    setPeople(fetchPeople());
  }, []);

  useEffect(() => {
    setFilteredPeople(people);
  }, [people]);

  useEffect(() => {
    setFilteredPeople(
      people.filter((person) => {
        for (const entry of searchParams.entries()) {
          const [param, value] = entry;
          const validParameters =
            value != null &&
            value !== '' &&
            filterFields.includes(param as Field);
          if (validParameters && !meetsFilter(param as Field, value, person)) {
            return false;
          }
        }
        return true;
      })
    );
  }, [searchParams, people]);

  const radioInputFilter = (fieldName: Field, fieldOptions: Array<string>) => {
    return (
      <div className="filterForm">
        <fieldset>
          <legend className="fieldLabel capitalize">
            {displayFieldName(fieldName)}
          </legend>
          {fieldOptions.length >= 1 &&
            fieldOptions.map((option) => (
              <div key={option}>
                <input
                  id={option}
                  type="radio"
                  name={fieldName}
                  value={option}
                  checked={searchParams.get(fieldName) === option}
                  onChange={(e) => onFilterChange(e, fieldName)}
                />
                <label htmlFor={option} className="radioInputLabel">
                  {option}
                </label>
              </div>
            ))}
        </fieldset>
      </div>
    );
  };

  const selectInputFilter = (fieldName: Field, fieldOptions: Array<string>) => {
    return (
      <div className="filterForm">
        <label htmlFor={fieldName} className="fieldLabel capitalize">
          {displayFieldName(fieldName)}
        </label>
        <select
          name={fieldName}
          id={fieldName}
          value={searchParams.get(fieldName) ?? ''}
          onChange={(e) => onFilterChange(e, fieldName)}
        >
          <option value="">--</option>
          {fieldOptions.length >= 1 &&
            fieldOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      </div>
    );
  };

  const setFilterForm = (fieldName: Field) => {
    const fieldOptions = getFieldOptions(people, fieldName);
    return fieldOptions.length > 10
      ? selectInputFilter(fieldName, fieldOptions)
      : radioInputFilter(fieldName, fieldOptions);
  };

  return (
    <div className="page">
      <h1>Star Wars catalogue</h1>
      <input
        type="search"
        className="searchBar"
        placeholder="Search by name"
        value={searchValue}
        onChange={(e) => onSearchValueChange(e)}
      />
      <div className="layout">
        <div className="filtersContainer">
          <div className="sectionHeader">
            <h5>Filters</h5>
            <button onClick={resetFilters} className="button">
              Clear all
            </button>
          </div>
          <div>
            {setFilterForm('gender')}
            {setFilterForm('hair_color')}
            {setFilterForm('skin_color')}
            {setFilterForm('eye_color')}
            {setFilterForm('birth_year')}
            {setFilterForm('homeworld')}
            {setFilterForm('height')}
            {setFilterForm('mass')}
          </div>
        </div>
        <table className="table peopleList">
          <tbody>
            <tr>
              {filterFields.map((fieldName) => (
                <th className="capitalize" key={fieldName}>
                  {displayFieldName(fieldName)}
                </th>
              ))}
            </tr>
            {filteredPeople.length >= 1 ? (
              filteredPeople.map((person) => (
                <PersonRow
                  key={person.id}
                  person={person}
                  onClick={() =>
                    navigate(`/people/${person.id}`, { state: people })
                  }
                />
              ))
            ) : (
              <tr className="noMatchMessage">
                <td>No match found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PeopleList;
