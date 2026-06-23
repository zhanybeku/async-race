import React from 'react';
import type { IMainTabs } from '../../ts/mainTabs.interface';

const TabButtons: React.FC<IMainTabs> = ({ selectedTab, setSelectedTab }) => {
    return (
        <div className='tab-buttons'>
            <button
                className={selectedTab === 'garage' ? 'active' : 'inactive'}
                onClick={() => setSelectedTab('garage')}
            >
                Garage
            </button>
            
            <button
                className={selectedTab === 'winners' ? 'active' : 'inactive'}
                onClick={() => setSelectedTab('winners')}
            >
                Winners
            </button>

        </div>
    )
}

export default TabButtons