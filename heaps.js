"use strict";

function makeHeap(facets) {

    function makeView() {
        /*
        Example:

        <div>
            <h3>1d6</h3>
            <button x-role="roll">roll 1d6</button>
            <div>Total: 0</div>
            <div>Rolls:</div>
            <div>
                <button x-role="add">add 1d6</button>
                <button disabled="true" x-role="remove">remove 1d6</button>
                <button x-role="clear">remove all d6</button>
            </div>
        </div>
        */
        const main = document.createElement('div');
        
        const title = document.createElement('h3');
        main.appendChild(title);

        const rollBtn = document.createElement('button');
        rollBtn.setAttribute('x-role', 'roll');
        main.appendChild(rollBtn);

        const total = document.createElement('div');
        total.classList.add('total');
        main.appendChild(total);
        
        const rolls = document.createElement('div');
        rolls.classList.add('rolls');
        main.appendChild(rolls);

        const buttons = document.createElement('div');
        const addBtn = document.createElement('button');
        addBtn.setAttribute('x-role', 'add');
        buttons.appendChild(addBtn);
        const remBtn = document.createElement('button');
        buttons.appendChild(remBtn);
        remBtn.setAttribute('x-role', 'remove');
        const clearBtn = document.createElement('button');
        clearBtn.setAttribute('x-role', 'clear');
        buttons.appendChild(clearBtn);
        main.appendChild(buttons);

        return main;
    }

    function makeModel(numfacets) {
        let model = {
            facets: numfacets,
            count: 1,
            total: 0,
            rolls: ""
        }

        return model;
    }

    function makeController() {
        let controller = {
            model: undefined,
            view: undefined,

            addDice: function(byNumber) {
                if(byNumber !== 0) {
                    this.model.count = Math.max(this.model.count+byNumber, 1);
                    this.updateDescriptor();
                    this.updateRemoveDieDisabled();
                }
            },

            removeHeap: function() {
                
            },

            rollHeap: function() {
                let rolls = [];
                const skip = Date.now() % 16;
                for (let counter = 0; counter < skip; counter++) {
                    Math.random();
                }

                const numRolls = this.model.count;
                const numFacets = this.model.facets-1;
                let total = 0;
                for (let counter = 0; counter < numRolls; counter++) {
                    let roll = 1 + Math.floor( numFacets*Math.random() );
                    total += roll;
                    rolls.push(roll);
                }

                this.model.total = total;
                this.model.rolls = rolls.join(', ');

                this.updateResults();
            },

            nextRandom: function() {
                return Math.random();
            },
            
            updateDescriptor: function() {
                const elem = this.view.querySelector('h3')
                elem.innerText = this.model.count + 'd' + this.model.facets;
            },

            updateButtons: function() {
                let elem;

                elem = this.view.querySelector('[x-role="roll"]');
                elem.innerText = 'roll all d'+this.model.facets;

                elem = this.view.querySelector('[x-role="add"]');
                elem.innerText = 'add 1d'+this.model.facets;
                
                elem = this.view.querySelector('[x-role="remove"]');
                elem.innerText = 'remove 1d'+this.model.facets;
                
                elem = this.view.querySelector('[x-role="clear"]');
                elem.innerText = 'remove all d'+this.model.facets;
            },

            updateResults: function() {
                let elem;

                elem = this.view.querySelector('.total');
                elem.innerText = 'Total: '+this.model.total;

                elem = this.view.querySelector('.rolls');
                elem.innerText = 'Total: '+this.model.rolls;
            },

            updateRemoveDieDisabled: function() {
                const elem = this.view.querySelector('[x-role="remove"]');
                if( this.model.count < 2 ) {
                    elem.setAttribute('disabled', true);
                }
                else {
                    elem.removeAttribute('disabled');
                }
            },

            initializeView: function() {
                this.updateDescriptor(this.view, this.model);
                this.updateButtons(this.view, this.model);
                this.updateRemoveDieDisabled(this.view, this.model);
                this.updateResults(this.view, this.model);

                let elem;
                elem = this.view.querySelector('[x-role="roll"]');
                elem.addEventListener('click', () => this.rollHeap());
                elem = this.view.querySelector('[x-role="add"]');
                elem.addEventListener('click', () => this.addDice(1));
                elem = this.view.querySelector('[x-role="remove"]');
                elem.addEventListener('click', () => this.addDice(-1));
                elem = this.view.querySelector('[x-role="clear"]');
                elem.addEventListener('click', () => this.removeHeap());
            },

            initializeController: function(v, m) {
                this.view = v;
                this.model = m;
            }
        }

        return controller;
    }

    let heap = {
        m: makeModel(facets),
        v: makeView(),
        c: makeController()
    }
    heap.c.initializeController(heap.v, heap.m);
    heap.c.initializeView();    

    return heap;
}