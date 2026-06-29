import React from 'react';
import './mainTabs.css';

import Garage from '../Garage/Garage';
import Winners from '../Winners/Winners';

interface IMainTabs {
    selectedTab: 'garage' | 'winners';
}

const MainTabs: React.FC<IMainTabs> = ({ selectedTab }) => {

    return (
        <div className='main-tabs'>
            <div
                className={`garage-tab ${selectedTab === 'garage' ? '' : 'tab-panel-hidden'}`}
                aria-hidden={selectedTab !== 'garage'}
            >
                <Garage />
            </div>

            <div
                className={`winners-tab ${selectedTab === 'winners' ? '' : 'tab-panel-hidden'}`}
                aria-hidden={selectedTab !== 'winners'}
            >
                <Winners />
            </div>
        </div>
    )
}

export default MainTabs