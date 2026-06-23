import React from 'react';
import './mainTabs.css';

import Garage from '../Garage/Garage';

interface IMainTabs {
    selectedTab: 'garage' | 'winners';
}

const MainTabs: React.FC<IMainTabs> = ({ selectedTab }) => {

    return (
        <div className='main-tabs'>
            {selectedTab === 'garage' ? (
                <div className='garage-tab'>
                    <Garage />
                </div>
            ) : (
                <div className='winners-tab'>
                    <h2>Winners</h2>
                </div>
            )}
        </div>
    )
}

export default MainTabs