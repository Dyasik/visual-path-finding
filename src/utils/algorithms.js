import { PrimitiveSet } from './dataStructures';
import * as Constants from './constants';

/**
 * Returns Euclidean distance between two points.
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @returns {Number} Distance between points
 */
function dist (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/**
 * Finds path on @map between @start and @goal.</br>
 * The @map is an <tt>Array</tt> of <tt>Array</tt>s of <tt>Object</tt>s with one property "type".</br>
 * The @start and @goal arguments contain the row and column number of the corresponding cells on @map,
 * split by a comma (",").</br>
 * If @setState is provided, it's used as a callback function, which is called with the up-to-time @map every
 * algorithm iteration to provide "live" animation.</br>
 * Returns an <tt>Array</tt> containing nodes of the path found, which lie between @start and @goal. If no path
 * exists, <tt>null</tt> is returned.
 *
 * @param {String} start - Start row + "," + start column.
 * @param {String} goal - Goal row + "," + goal column.
 * @param {Array.<Array.<Object>>} map - Map to find path on.
 * @param {Function} [setState] - Animation callback.
 * @returns {Array.<*>|null} - <tt>Array</tt> of nodes (start- and goal-like), lying between the start and the
 * goal; <tt>null</tt> if no path found.
 */
export function aStar (start, goal, map, setState) {
    // The set of nodes already evaluated
    const closedSet = new PrimitiveSet();
    // The set of currently discovered nodes that are not evaluated yet.
    // Initially, only the start node is known.
    const openSet = new PrimitiveSet(start);
    // For each node, which node it can most efficiently be reached from.
    // If a node can be reached from many nodes, cameFrom will eventually contain the
    // most efficient previous step.
    const cameFrom = {};
    // For each node, the cost of getting from the start node to that node.
    const gScore = {};
    // The cost of going from start to start is zero.
    gScore[start] = 0;
    // For each node, the total cost of getting from the start node to the goal
    // by passing by that node. That value is partly known, partly heuristic.
    const fScore = {};
    // For the first node, that value is completely heuristic.
    fScore[start] = dist(...start.split(','), ...goal.split(','));

    while (openSet.elements.length) {
        if (typeof setState === 'function') {
            setState(openSet.elements, closedSet.elements);
        }
        let current = openSet.elements[0];
        let minFScore = fScore[current];
        openSet.elements.forEach((node) => {
            let score = fScore[node];
            if (score === undefined) {
                score = Number.MAX_SAFE_INTEGER;
            }
            if (score < minFScore) {
                minFScore = score;
                current = node;
            }
        });

        if (current === goal) {
            // reconstruct the path
            const path = [current];
            while (Object.keys(cameFrom).includes(current)) {
                current = cameFrom[current];
                path.push(current);
            }
            return path.reverse();
        }

        openSet.remove(current);
        closedSet.add(current);

        // get adjacent nodes
        const neighbours = [];
        const [row, col] = current.split(',').map(e => +e);
        [
            // [row - 1, col - 1],
            [row - 1, col],
            // [row - 1, col + 1],
            [row, col - 1],
            [row, col + 1],
            // [row + 1, col - 1],
            [row + 1, col],
            // [row + 1, col + 1]
        ].forEach((pair) => {
            const [i, j] = pair;
            const node = map[i] && map[i][j];
            if (node && node.type !== Constants.TILE_TYPE.OBSTACLE) {
                neighbours.push(pair.join());
            }
        });

        neighbours.forEach((neighbour) => {
            if (closedSet.elements.includes(neighbour)) {
                return;
            }

            if (!openSet.elements.includes(neighbour)) {
                openSet.add(neighbour);
            }

            const tentativeGScore = +gScore[current] + 1;
            if (tentativeGScore >= gScore[neighbour]) {
                return;
            }

            cameFrom[neighbour] = current;
            gScore[neighbour] = tentativeGScore;
            fScore[neighbour] = tentativeGScore + dist(...neighbour.split(','), ...goal.split(','));
        });
    }
    return null;
}