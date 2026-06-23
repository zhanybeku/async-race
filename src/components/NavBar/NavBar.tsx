import React from 'react';
import './navBar.css';

const NavBar: React.FC = () => {
    return (
        <nav className='navbar'>
            <h1>Async Race</h1>
            <button>Generate Cars</button>
        </nav>
    )
}

export default NavBar