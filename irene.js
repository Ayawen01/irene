'use strict';

function IreneVisit(x) {
    this.value = x;
    this.type = Object.prototype.toString.call(x).slice(8, -1);
}

IreneVisit.prototype.execute = function() {
    switch (this.type) {
        case 'String': return this.visitString();
        case 'Array': return this.visitArray();
    }
};

IreneVisit.prototype.visitString = function() {
    if (Irene.tool.isId(this.value)) {
        this.value = this.value.slice(1);
        return new Irene(Irene.core.id(this.value));
    } else if (Irene.tool.isClass(this.value)) {
        this.value = this.value.slice(1);
        return new Irene(Irene.core.class(this.value));
    } else if (Irene.tool.isTag(this.value)) {
        return new Irene(Irene.core.tag(this.value));
    } else {

    }
};

IreneVisit.prototype.visitArray = function() {
    return new Irene(this.value);
};

function Irene(elems) {
    this.elems = elems;
    this.length = elems.length;
}

Irene.prototype = {
    constructor: Irene,
    forEach: function(f) {
        for (const [index, item] of this.elems.entries()) {
            f.call(item, item, index);
        }
    },
    map: function(f) {
        const elems = [];
        for (const [index, item] of this.elems.entries()) {
            elems.push(f.call(item, item, index));
        }
        return new Irene(elems);;
    }
};

Irene.core = {
    id: function(idName) {
        return [document.getElementById(idName)];
    },
    class: function(className) {
        return Array.from(document.getElementsByClassName(className));
    },
    tag: function(tagName) {
        return Array.from(document.getElementsByTagName(tagName));
    }
};

Irene.tool = {
    isId: function(str) {
        const regex = /^[#]\D+/;
        return regex.test(str);
    },
    isClass: function(str) {
        const regex = /^[.]\D+/;
        return regex.test(str);
    },
    isTag: function(str) {
        const regex = /^\D+/;
        return regex.test(str);
    }
};

window.$irene = (x) => new IreneVisit(x).execute();