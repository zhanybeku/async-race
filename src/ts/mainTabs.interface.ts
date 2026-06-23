export interface IMainTabs {
    selectedTab: 'garage' | 'winners';
    setSelectedTab: (tab: 'garage' | 'winners') => void;
}