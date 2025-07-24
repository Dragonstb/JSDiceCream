"use strict";

const Pool = {

    heaps: [],
    poolDescriptorElem: document.querySelector('#poolDescriptor'),
    poolElem: document.querySelector('#pool'),
    totalElem: document.querySelector('#poolTotal'),
    numDiceElem: document.querySelector('#numDiceInput'),
    numFacetsElem: document.querySelector('#numFacetsInput'),

    initialize: function() {
        let elem;

        elem = document.querySelector('#rollPool');
        elem.addEventListener('click', () => this.rollPool() );
        
        elem = document.querySelector('#addDiceButton');
        elem.addEventListener('click', () => this.addDice() );
        
    },

    addDice: function() {
        const numDiceOk = this.checkInput(this.numDiceElem);
        const numFacetsOk = this.checkInput(this.numFacetsElem);

        if( numDiceOk && numFacetsOk ) {
            let facets = parseInt(this.numFacetsElem.value);
            let count = parseInt(this.numDiceElem.value);
            this.addHeap(facets, count);
        }
        else {
            if(!numDiceOk) {
                this.numDiceElem.value = "";
            }
            if(!numFacetsOk) {
                this.numFacetsElem.value = "";
            }
        }
    },

    checkInput: function(input) {
        return input.value && parseInt(input.value) > 0;
    },

    addHeap: function(facets, count=1) {
        let heap = undefined;
        for (const existingHeap of this.heaps) {
            if( existingHeap.getNumFacets() === facets ) {
                heap = existingHeap;
                break;
            }
        }

        if( heap ) {
            heap.addDice(count);
        }
        else {
            heap = makeHeap(facets, count);
            this.insertHeapElement(heap);
        }

        const pd = this.assemblePoolDescriptor();
        this.poolDescriptorElem.innerText = 'Pool is: '+pd;
    },

    insertHeapElement: function(heap) {
        this.heaps.push(heap);
        this.heaps.sort( (a,b) => a.getNumFacets() - b.getNumFacets() );

        const insertAtIndex = this.heaps.indexOf(heap);
        if( insertAtIndex < this.heaps.length-1 ) {
            // pick the soon succeeding sibling in the DOM
            const other = this.heaps[insertAtIndex+1];
            this.poolElem.insertBefore(heap.getViewElement(), other.getViewElement());
        }
        else {
            this.poolElem.appendChild(heap.getViewElement());
        }
    },

    assemblePoolDescriptor: function() {
        let heapDescriptors = [];
        for (const heap of this.heaps) {
            heapDescriptors.push( heap.getNumDice()+'d'+heap.getNumFacets() );
        }
        return heapDescriptors.join('+');
    },

    rollPool: function() {
        let total = 0;
        for (const heap of this.heaps) {
            total += heap.roll();
        }
        this.updatePoolTotal(total);
    },
    
    updatePoolTotal: function(total) {
        this.totalElem.innerText = "Total: "+total;
    }
};