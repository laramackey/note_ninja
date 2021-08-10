import { GROUND, OBSTACLE, SPACE } from './constants.js';

export default class LevelGen {
    constructor(scopeLength, viewPortHeightInTiles) {
        this.viewPortHeightInTiles = viewPortHeightInTiles;
        this.scopeLength = scopeLength;
        this.index = 0;
        this.lastPlacedEntity = new Array(viewPortHeightInTiles).fill(0);
        this.activeScope = [];
        this.minimumEntityInterval = 10;
        this.entityWeight = 0.4;
        this.gapLength = 4;

        for (let i = 0; i < this.viewPortHeightInTiles; ++i) {
            if (i == this.viewPortHeightInTiles - 1) {
                this.activeScope.push(new Array(this.scopeLength).fill(1));
            }
            else {
                this.activeScope.push(new Array(this.scopeLength).fill(0));
            }
        }
    }

    updateScope() {
        this.index++;

        for (let column = 0; column < this.activeScope.length; ++column) {
            this.activeScope[column].shift();

            if (column == this.viewPortHeightInTiles - 1) {
                /*if (this.index - this.lastPlacedEntity[column] > this.minimumEntityInterval) {
                    const entity = Math.random() < this.obstacleWeight ? GROUND : 0;

                    this.activeScope[column].push(entity);
                    this.lastPlacedEntity[column] = this.index;
                }
                else if (this.index - this.lastPlacedEntity[column] < this.gapLength) {
                    this.activeScope[column].push(0);
                }
                else {*/
                this.activeScope[column].push(1);
                //}
            }
            else if (column == this.viewPortHeightInTiles - 2) {
                if (this.index - this.lastPlacedEntity[column] > this.minimumEntityInterval) {
                    const shouldPlaceEntity = Math.random() < this.entityWeight;

                    if (shouldPlaceEntity) {
                        const entity = Math.floor(Math.random() * (5 - 2)) + 2;

                        this.activeScope[column].push(entity);
                        // this.activeScope[column - 1][this.scopeLength - 1] = entity;

                        this.lastPlacedEntity[column] = this.index;
                    }
                    else {
                        this.activeScope[column].push(SPACE);
                    }
                }
                else {
                    this.activeScope[column].push(SPACE);
                }
            }
            else {

                this.activeScope[column].push(SPACE);

            }
        }
    }

    getActiveScope() {
        return this.activeScope;
    }
};