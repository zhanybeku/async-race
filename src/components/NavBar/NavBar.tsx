import React from 'react';
import './navBar.css';
import Button from '@mui/material/Button';

const NavBar: React.FC = () => {
    return (
        <nav className='navbar'>
            <h1>Async Race</h1>
            <Button variant="contained">
                Generate Cars
            </Button>
        </nav>
    )
}

export default NavBar