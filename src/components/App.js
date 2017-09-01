import React from 'react';
import Tile from './Tile';
import * as Utils from "../utils";

const MAP = {
    WIDTH:      10,
    HEIGHT:     20,
};

export default class App extends React.Component {
    constructor() {
        super();

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleTileClick = this.handleTileClick.bind(this);

        let map = [];
        for (let i = 0; i < MAP.HEIGHT; i++) {
            let row = [];
            for (let j = 0; j < MAP.WIDTH; j++) {
                row.push({
                    type: Utils.TILE_TYPE.EMPTY,
                });
            }
            map.push(row);
        }

        this.start = [];
        this.target = [];

        this.state = {
            map,
            mode: Utils.TILE_TYPE.OBSTACLE,
            running: false,
        };
    }

    setMode(mode) {
        this.setState({
            mode
        });
    }

    handleMouseEnter(event) {
        event.target.classList.add(Utils[`HOVER_${this.state.mode}_CLASS`]);
    }

    handleMouseLeave(event) {
        event.target.classList.remove(Utils[`HOVER_${this.state.mode}_CLASS`]);
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
            case Utils.TILE_TYPE.START:
                this.start = [];
                break;
            case Utils.TILE_TYPE.TARGET:
                this.target = [];
                break;
            default:
                break;
        }

        switch (this.state.mode) {
            case Utils.TILE_TYPE.START:
                if (this.start.length) {
                    map[this.start[0]][this.start[1]].type = Utils.TILE_TYPE.EMPTY;
                }
                this.start = [row, col];
                break;
            case Utils.TILE_TYPE.TARGET:
                if (this.target.length) {
                    map[this.target[0]][this.target[1]].type = Utils.TILE_TYPE.EMPTY;
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

    renderRow(row) {
        let tiles = [];
        for (let i = 0; i < MAP.WIDTH; i++) {
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
        for (let i = 0; i < MAP.HEIGHT; i++) {
            rows.push(this.renderRow(i));
        }
        return (<div className={Utils.MAP_CLASS}>
            {rows}
        </div>);
    }

    renderLegend() {
        return (<div className={Utils.LEGEND_CLASS}>
            <div className={Utils.LEGEND_ITEM_CLASS} onClick={this.setMode.bind(this, Utils.TILE_TYPE.START)}>
                <Tile type={Utils.TILE_TYPE.START}/>
                START
            </div>
            <div className={Utils.LEGEND_ITEM_CLASS} onClick={this.setMode.bind(this, Utils.TILE_TYPE.TARGET)}>
                <Tile type={Utils.TILE_TYPE.TARGET}/>
                TARGET
            </div>
            <div className={Utils.LEGEND_ITEM_CLASS} onClick={this.setMode.bind(this, Utils.TILE_TYPE.OBSTACLE)}>
                <Tile type={Utils.TILE_TYPE.OBSTACLE}/>
                OBSTACLE
            </div>
            <div className={Utils.LEGEND_ITEM_CLASS} onClick={null}>
                RUN
            </div>
        </div>);
    }

    render() {
        return <div className={Utils.MAIN_CLASS}>
            {this.renderField()}
            {this.renderLegend()}
        </div>;
    }
}