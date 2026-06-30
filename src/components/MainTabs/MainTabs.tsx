import React from 'react';
import './mainTabs.css';

import Garage from '../Garage/Garage';
import Winners from '../Winners/Winners';

interface IMainTabs {
    selectedTab: 'garage' | 'winners';
    winnersVersion: number;
    onRaceFinish: () => void;
}

const MainTabs: React.FC<IMainTabs> = ({
    selectedTab,
    winnersVersion,
    onRaceFinish,
}) => {

    return (
        <div className='main-tabs'>
            <div
                className={`garage-tab ${selectedTab === 'garage' ? '' : 'tab-panel-hidden'}`}
                aria-hidden={selectedTab !== 'garage'}
            >
                <Garage onRaceFinish={onRaceFinish} />
            </div>

            <div
                className={`winners-tab ${selectedTab === 'winners' ? '' : 'tab-panel-hidden'}`}
                aria-hidden={selectedTab !== 'winners'}
            >
                <Winners winnersVersion={winnersVersion} />
            </div>
        </div>
    )
}

export default MainTabs