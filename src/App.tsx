import React, { FC } from 'react';
import './App.less';
import PageHeader from './components/pageHeader'
import { Routes, Route } from "react-router-dom"

const HomePage = React.lazy(() => import('./views/HomePage'))
const EditPage = React.lazy(() => import('./views/EditPage'))

const App: FC = () => (
  <div className="App">
    <PageHeader />
    <React.Suspense fallback={<div>loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/edit" element={<EditPage />}></Route>
      </Routes>
    </React.Suspense>
  </div>
);

export default App;