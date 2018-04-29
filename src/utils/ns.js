import createNs from 'css-ns';
import {CSS_PREFIX} from '../config';

const ns = createNs({
    namespace: CSS_PREFIX,
	glue: '--'
});

export default ns;
