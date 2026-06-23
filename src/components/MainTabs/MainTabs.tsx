import React from 'react';
import './mainTabs.css';

const MainTabs: React.FC<{ selectedTab: 'garage' | 'winners' }> = ({ selectedTab}) => {

    return (
        <div className='main-tabs'>
            {selectedTab === 'garage' ? (
                <div className='garage-tab'>
                    <h2>Garage</h2>
                </div>
            ) : (
                <div className='winners-tab'>
                    <h2>Winners</h2>
                </div>
            )}
            BRUH BRUH BRUH BRUH
        </div>
    )
}

export default MainTabs