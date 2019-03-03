// utils
import html from '../../utils/html';

// components
import Icon from './Icon';

const ErrorMark = ({ className }) => html`
    <${Icon}
        className="${`icon__error ${className}`}"
        path="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"
    />
`;

export default ErrorMark;
