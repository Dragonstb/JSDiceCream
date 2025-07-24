"use strict";

function makeHeap(facets, count=1) {

    function makeView() {
        /*
        Example:

        <div>
            <h3 aria-live="polite">1d6</h3>
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
        title.setAttribute('aria-live', 'polite');
        main.appendChild(title);

        const rollBtn = document.createElement('button');
        rollBtn.setAttribute(XROLE, ROLL);
        main.appendChild(rollBtn);

        const total = document.createElement('div');
        total.classList.add('total');
        main.appendChild(total);
        
        const rolls = document.createElement('div');
        rolls.classList.add('rolls');
        main.appendChild(rolls);

        const buttons = document.createElement('div');
        const addBtn = document.createElement('button');
        addBtn.setAttribute(XROLE, ADD);
        buttons.appendChild(addBtn);
        const remBtn = document.createElement('button');
        buttons.appendChild(remBtn);
        remBtn.setAttribute(XROLE, REMOVE);
        const clearBtn = document.createElement('button');
        clearBtn.setAttribute(XROLE, CLEAR);
        buttons.appendChild(clearBtn);
        main.appendChild(buttons);

        return main;
    }

    function makeModel(numfacets, numdice=1) {
        let model = {
            facets: numfacets,
            count: numdice,
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
                    const event = new Event(HEAP_CHANGED_EVENT, {bubbles: true});
                    this.view.dispatchEvent(event);
                }
            },

            removeHeap: function() {
                const event = new CustomEvent(REMOVE_HEAP_EVENT, {
                    bubbles: true,
                    detail: {facets: this.model.facets}
                });
                this.view.dispatchEvent(event);
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
                return this.model.total;
            },

            rollSingleHeap: function() {
                this.rollHeap();
                const event = new CustomEvent(SINGLE_HEAP_ROLLED_EVENT, {
                    bubbles: true,
                    detail: {total: this.model.total}
                });
                this.view.dispatchEvent(event);
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

                elem = this.view.querySelector('['+XROLE+'="'+ROLL+'"]');
                elem.innerText = 'roll all d'+this.model.facets;

                elem = this.view.querySelector('['+XROLE+'="'+ADD+'"]');
                elem.innerText = 'add 1d'+this.model.facets;
                
                elem = this.view.querySelector('['+XROLE+'="'+REMOVE+'"]');
                elem.innerText = 'remove 1d'+this.model.facets;
                
                elem = this.view.querySelector('['+XROLE+'="'+CLEAR+'"]');
                elem.innerText = 'remove all d'+this.model.facets;
            },

            updateResults: function() {
                let elem;

                elem = this.view.querySelector('.total');
                elem.innerText = 'Total: '+this.model.total;

                elem = this.view.querySelector('.rolls');
                elem.innerText = 'Rolls: '+this.model.rolls;
            },

            updateRemoveDieDisabled: function() {
                const elem = this.view.querySelector('['+XROLE+'="'+REMOVE+'"]');
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
                elem = this.view.querySelector('['+XROLE+'="'+ROLL+'"]');
                elem.addEventListener('click', () => this.rollSingleHeap());
                elem = this.view.querySelector('['+XROLE+'="'+ADD+'"]');
                elem.addEventListener('click', () => this.addDice(1));
                elem = this.view.querySelector('['+XROLE+'="'+REMOVE+'"]');
                elem.addEventListener('click', () => this.addDice(-1));
                elem = this.view.querySelector('['+XROLE+'="'+CLEAR+'"]');
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
        m: makeModel(facets, count),
        v: makeView(),
        c: makeController(),

        getNumFacets: function() {
            return this.m.facets;
        },

        getNumDice: function() {
            return this.m.count;
        },

        addDice: function(count) {
            this.c.addDice(count);
        },

        roll: function() {
            return this.c.rollHeap();
        },

        getViewElement: function() {
            return this.v;
        }
    }
    heap.c.initializeController(heap.v, heap.m);
    heap.c.initializeView();    

    return heap;
}