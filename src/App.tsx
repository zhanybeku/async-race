import { useState } from 'react'

import './App.css'
import NavBar from './components/NavBar/NavBar';
import TabButtons from './components/MainTabs/TabButtons';
import MainTabs from './components/MainTabs/MainTabs';

const App = () => {
  const [selectedTab, setSelectedTab] = useState<'garage' | 'winners'>('garage');


  return (
    <div className='app'>
      <NavBar />
      <TabButtons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <MainTabs selectedTab={selectedTab} />
    </div>
  )
}

export default App
