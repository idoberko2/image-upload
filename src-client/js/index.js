// external
import ReactDOM from 'react-dom';
import html from './utils/html';

// components
import UploadForm from './components/UploadForm';

// styles
import css from '../stylesheets/style.css';

ReactDOM.render(
    html`
        <${UploadForm} />
    `,
    document.getElementById('app')
);

// for webpack's hot module replacement
if (module.hot) {
    module.hot.accept();
}
