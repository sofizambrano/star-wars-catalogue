import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import PeopleList from './components/PeopleList';
import { PersonDetails } from './components/PersonDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/people" />} />
      <Route path="people" element={<PeopleList />}></Route>
      <Route path="people/:personId" element={<PersonDetails />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
