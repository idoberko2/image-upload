// utils
import html from '../../utils/html';

const Icon = ({ path, className }) => html`
    <svg className="${`icon ${className}`}" viewBox="0 0 512 512">
        <path d=${path}><//>
    <//>
`;

export default Icon;
