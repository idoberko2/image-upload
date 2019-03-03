// utils
import html from '../../utils/html';

// components
import StepHeader from './StepHeader';

const UploadStep = ({ step, action, children }) => html`
    <div className="upload-steps--item">
        <${StepHeader} step=${step} action=${action} />
        ${children}
    <//>
`;

export default UploadStep;
