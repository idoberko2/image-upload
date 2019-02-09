// utils
import html from '../../utils/html';

// components
import Icon from './Icon';

const CheckMark = ({ className }) => html`
    <${Icon}
        className="${`icon__success ${className}`}"
        path="M186.301 339.893L96 249.461l-32 30.507L186.301 402 448 140.506 416 110z"
    />
`;

export default CheckMark;
