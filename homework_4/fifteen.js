(function() {
    'use strict';

    /** row and column indexes start from 0
     *  array index starts from 1
     */
    window.onload = function() {
        let shuffleButton = document.getElementById('shufflebutton');
        shuffleButton.onclick = shuffle;

        insertPuzzle();
    };

    let puzzleSize = 4;
    let puzzleNodes = [];
    let nowIndex = [];
    let blankIndex = 16;

    /**
     * initialize the whole puzzle
     */
    function insertPuzzle() {
        let puzzleArea = document.getElementById('puzzlearea');
        let puzzleCount = puzzleSize * puzzleSize;

        // create each node in for loop
        for (let i = 1; i <= puzzleCount; i++) {
            let newNode = document.createElement('div');
            let row = Math.floor((i - 1) / puzzleSize);
            let col = (i - 1) % puzzleSize;
            newNode.id = "node_" + row + "_" + col;
            newNode.style.left = col * 100 + "px";
            newNode.style.top = row * 100 + "px";
            newNode.onclick = move;

            // paint every piece of puzzle
            if (i !== blankIndex) {
                newNode.classList.add('showingpiece');
                newNode.style.backgroundPosition = col * (-100) + "px " + row * (-100) + "px";
                newNode.innerText = i;
            }

            puzzleArea.appendChild(newNode);
            puzzleNodes.push(newNode);
            nowIndex.push(i);
        }
    }

    /**
     * move the tile if it's movable
     */
    function move() {
        console.log("move called, " + this);
        let row = parseInt(this.id.charAt(5));
        let col = parseInt(this.id.charAt(7));
        let index = row * puzzleSize + col + 1;

        if (!judgeMovable(index)) {
            return;
        }

        exchange(index);
        render();
    }

    /**
     * exchange the tile with the empty tile. 
     * as it only deal with indexes, it's very fast
     * @param {number} index the index of the tile you want to exchange
     */
    function exchange(index) {
        let realIndex = nowIndex[index - 1];

        nowIndex[blankIndex - 1] = realIndex;
        nowIndex[index - 1] = -1;
        blankIndex = index;
    }

    /**
     * judge whether a tile is movable
     * @param {number} index the index of tile you want to judge
     * @returns {boolean} whether the tile is movable
     */
    function judgeMovable(index) {
        let neighborArr = findMovableNeighborIndex();
        if (neighborArr.indexOf(index) === -1) {
            return false;
        }
        return true;
    }

    /**
     * render the whole puzzle according to the new indexes
     */
    function render() {
        for (let index = 1; index <= puzzleSize * puzzleSize; index++) {
            let node = puzzleNodes[index - 1];
            let realIndex = nowIndex[index - 1];

            if (realIndex !== -1) {
                let realRow = Math.floor((realIndex - 1) / puzzleSize);
                let realCol = (realIndex - 1) % puzzleSize;

                node.classList.add('showingpiece');
                node.style.backgroundPosition = realCol * (-100) + "px " + realRow * (-100) + "px";
                node.innerText = realIndex;
                node.onclick = move;
            } else {
                node.classList.remove('showingpiece');
                node.innerText = "";
                node.onclick = undefined;
            }
        }
    }

    /**
     * get all the indexes of the neighbors that are movable
     * @returns {boolean} the neighbor array
     */
    function findMovableNeighborIndex() {
        let increment = [(-1) * puzzleSize, -1, 1, puzzleSize];
        let neighborArr = [];

        let temp = 0;
        for (let i of increment) {
            temp = blankIndex + i;
            if (temp >= 1 && temp <= (puzzleSize * puzzleSize)) {
                neighborArr.push(temp);
            }
        }

        return neighborArr;
    }

    /**
     * shuffle the whole puzzle, adopt lasy rendering technique
     */
    function shuffle() {
        for (let i = 0; i < 1000; i++) {
            let neighborArr = findMovableNeighborIndex();
            let length = neighborArr.length;
            let nextStep = parseInt(Math.random() * length);

            exchange(neighborArr[nextStep]);
        }
        render();
    }
})();