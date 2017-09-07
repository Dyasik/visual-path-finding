import React from 'react';
import Tile from './Tile';
import * as Const from "../utils/constants";
import { aStar } from '../utils/algorithms';

const MAP_CONFIG = {
    WIDTH:      10,
    HEIGHT:     20,
};

export default class App extends React.Component {
    constructor() {
        super();

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleTileClick = this.handleTileClick.bind(this);
        this.run = this.run.bind(this);

        let map = [];
        for (let i = 0; i < MAP_CONFIG.HEIGHT; i++) {
            let row = [];
            for (let j = 0; j < MAP_CONFIG.WIDTH; j++) {
                row.push({
                    type: Const.TILE_TYPE.EMPTY,
                });
            }
            map.push(row);
        }

        this.start = [];
        this.target = [];

        this.state = {
            map,
            mode: Const.TILE_TYPE.OBSTACLE,
            running: false,
        };
    }

    setMode(mode) {
        this.setState({
            mode
        });
    }

    handleMouseEnter(event) {
        event.target.classList.add(Const[`HOVER_${this.state.mode}_CLASS`]);
    }

    handleMouseLeave(event) {
        event.target.classList.remove(Const[`HOVER_${this.state.mode}_CLASS`]);
    }

    handleTileClick(event) {
        const row = event.target.getAttribute('data-row');
        const col = event.target.getAttribute('data-col');
        const target = this.state.map[row][col];

        if (target.type == this.state.mode) {
            return;
        }

        const map = this.state.map;

        switch (target.type) {
            case Const.TILE_TYPE.START:
                this.start = [];
                break;
            case Const.TILE_TYPE.TARGET:
                this.target = [];
                break;
            default:
                break;
        }

        switch (this.state.mode) {
            case Const.TILE_TYPE.START:
                if (this.start.length) {
                    map[this.start[0]][this.start[1]].type = Const.TILE_TYPE.EMPTY;
                }
                this.start = [row, col];
                break;
            case Const.TILE_TYPE.TARGET:
                if (this.target.length) {
                    map[this.target[0]][this.target[1]].type = Const.TILE_TYPE.EMPTY;
                }
                this.target = [row, col];
                break;
            default:
                break;
        }

        map[row][col].type = this.state.mode;
        this.setState({
            map,
        });
    }

    run() {
        if (!this.start.length) {
            alert('You should place the start point');
            return;
        }

        if (!this.target.length) {
            alert('You should place the target point');
            return;
        }

        const result = aStar(this.start.join(), this.target.join(), this.state.map);

        if (result) {
            const map = this.state.map;
            result.forEach((node, i) => {
                if (!i || i === result.length - 1) {
                    return;
                }
                const [row, col] = node.split(',');
                map[row][col].type = Const.WAYPOINT_CLASS;
            });
            this.setState({
                map,
            });
        } else {
            alert('No path found');
        }

    }

    renderRow(row) {
        let tiles = [];
        for (let i = 0; i < MAP_CONFIG.WIDTH; i++) {
            tiles.push(<Tile type={this.state.map[row][i].type}
                             key={row + ',' + i}
                             data-row={row}
                             data-col={i}
                             onMouseEnter={this.handleMouseEnter}
                             onMouseLeave={this.handleMouseLeave}
                             onClick={this.handleTileClick}
            />);
        }
        return (<div key={row}>
            {tiles}
        </div>);
    }

    renderField() {
        let rows = [];
        for (let i = 0; i < MAP_CONFIG.HEIGHT; i++) {
            rows.push(this.renderRow(i));
        }
        return (<div className={Const.MAP_CLASS}>
            {rows}
        </div>);
    }

    renderLegend() {
        return (<div className={Const.LEGEND_CLASS}>
            <div className={Const.LEGEND_ITEM_CLASS} onClick={this.setMode.bind(this, Const.TILE_TYPE.START)}>
                <Tile type={Const.TILE_TYPE.START}/>
                START
            </div>
            <div className={Const.LEGEND_ITEM_CLASS} onClick={this.setMode.bind(this, Const.TILE_TYPE.TARGET)}>
                <Tile type={Const.TILE_TYPE.TARGET}/>
                TARGET
            </div>
            <div className={Const.LEGEND_ITEM_CLASS} onClick={this.setMode.bind(this, Const.TILE_TYPE.OBSTACLE)}>
                <Tile type={Const.TILE_TYPE.OBSTACLE}/>
                OBSTACLE
            </div>
            <div className={Const.LEGEND_ITEM_CLASS} onClick={this.run}>
                RUN
            </div>
        </div>);
    }

    render() {
        return <div className={Const.MAIN_CLASS}>
            {this.renderField()}
            {this.renderLegend()}
        </div>;
    }
}