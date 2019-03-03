// external
import html from '../../utils/html';

const StepHeader = ({ step, action }) => html`
    <h1 className="upload-steps--item--header">
        ${step}
        <span className="upload-steps--item--description">
            ${action}
        <//>
    <//>
`;

export default StepHeader;
