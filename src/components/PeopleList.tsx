import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import PersonRow from './PersonRow';
import { DetailedPerson, ListedPerson } from '../types';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchPeople } from '../api';

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
  // const [sortField, setSortField] = useState<Field>("name");

  const extendSearchParams = (param: Field, value: string) => {
    searchParams.set(param, value);
    setSearchParams(searchParams);
  };

  const onSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    setSearchValue(value);
    extendSearchParams('name', value);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>, param: Field) => {
    const value = e.target.value.toString();
    extendSearchParams(param, value);
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>, param: Field) => {
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

  const getFieldOptions = (field: keyof ListedPerson): Array<string> => {
    const removeSorroundingSpaces = (option: string) => option.trim();
    return Array.from(
      new Set(
        people.flatMap((person) =>
          person[field].split(',').map(removeSorroundingSpaces)
        )
      )
    ).sort();
  };

  const meetsFilter = (
    param: Field,
    value: string,
    person: DetailedPerson
  ): boolean | undefined => {
    if (
      param === 'name' ||
      param === 'hair_color' ||
      param === 'skin_color' ||
      param === 'eye_color'
    ) {
      return person[param]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    } else {
      return person[param] === value;
    }
  };

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
            {fieldName.split('_').join(' ')}
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
                  onChange={(e) => onInputChange(e, fieldName)}
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
          {fieldName.split('_').join(' ')}
        </label>
        <select
          name={fieldName}
          id={fieldName}
          value={searchParams.get(fieldName) ?? ''}
          onChange={(e) => onSelectChange(e, fieldName)}
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
    const fieldOptions = getFieldOptions(fieldName);
    return fieldOptions.length > 10
      ? selectInputFilter(fieldName, fieldOptions)
      : radioInputFilter(fieldName, fieldOptions);
  };

  // useEffect(() => {
  //   setPeople(
  //     people.sort((person1, person2) => {
  //       if (person1[sortField] > person2[sortField]) {
  //         return 1;
  //       }
  //       if (person1[sortField] < person2[sortField]) {
  //         return -1;
  //       }
  //       return 0;
  //     })
  //   );
  // }, [sortField, people]);

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
              Reset all
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
              {filterFields.map((field) => (
                <th
                  className="capitalize"
                  // onClick={() => setSortField(field)}
                  key={field}
                >
                  {field.split('_').join(' ')}
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
