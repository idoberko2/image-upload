// external
import ReactDOM from 'react-dom';
import html from './utils/html';

// components
import UploadForm from './components/UploadForm';

ReactDOM.render(
    html`
        <${UploadForm} />
    `,
    document.getElementById('app')
);
