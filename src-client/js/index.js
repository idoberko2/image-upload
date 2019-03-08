// external
import ReactDOM from 'react-dom';
import React from 'react';

// components
import App from './components/App';

ReactDOM.render(<App />, document.getElementById('app'));

// for webpack's hot module replacement
if (module.hot) {
    module.hot.accept();
}
