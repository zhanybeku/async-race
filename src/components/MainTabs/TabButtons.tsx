import React from 'react';
import './mainTabs.css';

interface ITabButtons {
    selectedTab: 'garage' | 'winners';
    setSelectedTab: (tab: 'garage' | 'winners') => void;
}

const TabButtons: React.FC<ITabButtons> = ({ selectedTab, setSelectedTab }) => {
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