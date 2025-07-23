"use strict";

function makeHeap(facets) {

    function makeView() {
        /*
        Example:

        <div>
            <h3>1d6</h3>
            <div>Total: 0</div>
            <div>Rolls:</div>
            <div>
                <button>add 1d6</button>
                <button disabled="true">remove 1d6</button>
                <button>remove all d6</button>
            </div>
        </div>
        */
        const main = document.createElement('div');
        
        const title = document.createElement('h3');
        main.appendChild(title);

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
            
            updateDescriptor: function(view, model) {
                const elem = view.querySelector('h3')
                elem.innerText = model.count + 'd' + model.facets;
            },

            updateButtons: function(view, model) {
                let elem;

                elem = view.querySelector('[x-role="add"]');
                elem.innerText = 'add 1d'+model.facets;
                
                elem = view.querySelector('[x-role="remove"]');
                elem.innerText = 'remove 1d'+model.facets;
                
                elem = view.querySelector('[x-role="clear"]');
                elem.innerText = 'remove all d'+model.facets;
            },

            updateResults: function(view, model) {
                let elem;

                elem = view.querySelector('.total');
                elem.innerText = 'Total: '+model.total;

                elem = view.querySelector('.rolls');
                elem.innerText = 'Total: '+model.rolls;
            },

            updateRemoveDisabled: function(view, model) {
                const elem = view.querySelector('[x-role="remove"]');
                elem.setAttribute('disabled', model.count < 2);
            },

            initializeView: function(view, model) {
                this.updateDescriptor(view, model);
                this.updateButtons(view, model);
                this.updateRemoveDisabled(view, model);
                this.updateResults(view, model);
            }
        }

        return controller;
    }

    let heap = {
        m: makeModel(facets),
        v: makeView(),
        c: makeController()
    }
    heap.c.initializeView(heap.v, heap.m);

    return heap;
}