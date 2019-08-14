import React from 'react';
import { hot } from 'react-hot-loader/root';
import './App.css';

import { StoreProvider } from './context';
import Visualization from './views/Visualization';

const App: React.SFC<{}> = () => {
    return (
        <div className='App'>
            <StoreProvider>
                <Visualization />
            </StoreProvider>
        </div>
    );
};

export default (process.env.NODE_ENV === 'development' ? hot(App) : App);
