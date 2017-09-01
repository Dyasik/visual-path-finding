import React from 'react';
import PropTypes from 'prop-types';
import { TILE_TYPE, TILE_CLASS } from '../utils';

export default class Tile extends React.Component {
    constructor() {
        super();
    }

    render() {
        // don't add "type" prop to result div
        let {type, ...props} = this.props;

        type = type ? type.toLowerCase() : TILE_TYPE.EMPTY;

        return (<div className={`${TILE_CLASS} ${type}`}
                      {...props}>
        </div>);
    }
}

Tile.PropTypes = {
    type: PropTypes.oneOf(Object.keys(TILE_TYPE)),
};