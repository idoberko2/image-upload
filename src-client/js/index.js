// external
import ReactDOM from 'react-dom';
import React from 'react';

// components
import UploadForm from './components/UploadForm';

ReactDOM.render(<UploadForm />, document.getElementById('app'));

// for webpack's hot module replacement
if (module.hot) {
    module.hot.accept();
}
