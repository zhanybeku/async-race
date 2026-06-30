import { useState } from 'react'

import './App.css'
import NavBar from './components/NavBar/NavBar';
import TabButtons from './components/MainTabs/TabButtons';
import MainTabs from './components/MainTabs/MainTabs';

const App = () => {
  const [selectedTab, setSelectedTab] = useState<'garage' | 'winners'>('garage');
  const [winnersVersion, setWinnersVersion] = useState(0);

  const onRaceFinish = () => setWinnersVersion((version) => version + 1);

  return (
    <div className='app'>
      <NavBar />
      <TabButtons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <MainTabs
        selectedTab={selectedTab}
        winnersVersion={winnersVersion}
        onRaceFinish={onRaceFinish}
      />
    </div>
  )
}

export default App
