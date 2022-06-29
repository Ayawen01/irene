'use strict';

class IreneVisit {
    constructor(x) {
        this.value = x;
        this.type = Object.prototype.toString.call(x).slice(8, -1);
    }

    execute() {
        if (this.value instanceof HTMLElement) {
            return this.visitHtmlElement();
        }
        
        switch (this.type) {
            case 'String': return this.visitString();
            case 'Array': return this.visitArray();
        }
    }

    visitString() {
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
    }

    visitArray() {
        return new Irene(this.value);
    }

    visitHtmlElement() {
        return new Irene([this.value]);
    }
}

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
        return new Irene(elems);
    },
    filter: function(f) {
        const elems = [];
        for (const [index, item] of this.elems.entries()) {
            if (f.call(item, item, index)) {
                elems.push(item);
            }
        }
        return new Irene(elems);
    },
    sort: function(f=(a,b)=>a-b) {
        this.elems.sort(f);
        return this;
    },
    parent: function() {
        const parents = [];
        this.forEach(item => {
            const parent = item.parentNode;
            const index = parents.findIndex(node => node === parent);
            if (index === -1) {
                parents.push(parent);
            }
        });
        return new Irene(parents);
    },
    siblings: function() {
        const item = this.first().getElems()[0];
        const prevElems = [];
        const nextElems = [];
        
        let node = item;
        while (node.previousElementSibling !== null) {
            prevElems.push(node.previousElementSibling);
            node = node.previousElementSibling;
        }
        node = item;
        nextElems.push(node);
        while (node.nextElementSibling !== null) {
            nextElems.push(node.nextElementSibling);
            node = node.nextElementSibling;
        }
        return new Irene([...prevElems.reverse(),...nextElems]);
    },
    children: function() {
        const childrens = [];
        this.forEach(item => {
            const children = Array.from(item.children);
            childrens.push(...children);
        })
        return new Irene(childrens);
    },
    begin: function(elem) {
        if (elem instanceof Irene) {
            this.forEach(item => {
                elem.forEach(node => item.insertAdjacentElement('beforebegin', Irene.core.cloneNode(node)));
            });
            return;
        }

        if (elem instanceof Array) {
            this.forEach(item => {
                elem.forEach(node => item.insertAdjacentElement('beforebegin', Irene.core.cloneNode(node)));
            });
            return;
        }

        if (elem instanceof HTMLElement) {
            this.forEach(item => item.insertAdjacentElement('beforebegin', Irene.core.cloneNode(elem)));
            return;
        }

        throw new Error('elem不是一个HTMLElement对象');
    },
    append: function(elem) {
        if (elem instanceof Irene) {
            this.forEach(item => {
                elem.forEach(node => item.insertAdjacentElement('afterend', Irene.core.cloneNode(node)));
            });
            return;
        }

        if (elem instanceof Array) {
            this.forEach(item => {
                elem.forEach(node => item.insertAdjacentElement('afterend', Irene.core.cloneNode(node)));
            });
            return;
        }

        if (elem instanceof HTMLElement) {
            this.forEach(item => item.insertAdjacentElement('afterend', Irene.core.cloneNode(elem)));
            return;
        }

        throw new Error('elem不是一个HTMLElement对象');
    },
    beginChild: function(elem) {
        if (elem instanceof Irene) {
            this.forEach(item => {
                elem.forEach(node => item.insertAdjacentElement('afterbegin', Irene.core.cloneNode(node)));
            });
            return;
        }

        if (elem instanceof Array) {
            this.forEach(item => {
                elem.forEach(node => item.insertAdjacentElement('afterbegin', Irene.core.cloneNode(node)));
            });
            return;
        }

        if (elem instanceof HTMLElement) {
            this.forEach(item => item.insertAdjacentElement('afterbegin', Irene.core.cloneNode(elem)));
            return;
        }

        throw new Error('elem不是一个HTMLElement对象');
    },
    appendChild: function(elem) {
        if (elem instanceof Irene) {
            this.forEach(item => {
                elem.forEach(node => item.insertAdjacentElement('beforeend', Irene.core.cloneNode(node)));
            });
            return;
        }

        if (elem instanceof Array) {
            this.forEach(item => {
                elem.forEach(node => item.insertAdjacentElement('beforeend', Irene.core.cloneNode(node)));
            });
            return;
        }

        if (elem instanceof HTMLElement) {
            this.forEach(item => item.insertAdjacentElement('beforeend', Irene.core.cloneNode(elem)));
            return;
        }

        throw new Error('elem不是一个HTMLElement对象');
    },
    remove: function() {
        this.forEach(item => {
            if (item instanceof HTMLElement) {
                item.remove();
            } else {
                throw new Error('elem不是一个HTMLElement对象');
            }
        });
        return this;
    },
    render: function() {
        this.parent().appendChild(this);
        this.remove();
        return this;
    },
    eq: function(index) {
        if (index >= this.len()) {
            throw new Error('下标访问越界');
        }
        return new Irene([this.elems[index]]);
    },
    range: function(startIndex = 0, endIndex = 0) {
        if (startIndex === 0 && endIndex === 0) {
            return new Irene(this.elems.slice());
        } else if (endIndex === 0) {
            return new Irene(this.elems.slice(startIndex));
        } else {
            return new Irene(this.elems.slice(startIndex, endIndex));
        }
    },
    first: function() {
        if (this.len() < 1) {
            throw new Error('当前元素为空');
        }
        return this.eq(0);
    },
    last: function() {
        if (this.len() < 1) {
            throw new Error('当前元素为空');
        }
        return this.eq(this.len() - 1);
    },
    text: function() {
        let text = '';
        this.forEach(item => text += item.innerText);
        return text;
    },
    setText: function(text) {
        this.forEach(item => item.innerText = text);
        return this;
    },
    clear: function() {
        this.elems = [];
        this.length = 0;
    },
    clone: function(isDeep = true) {
        return this.map(item => Irene.core.cloneNode(item));
    },
    getElems: function() {
        return this.elems;
    },
    len: function() {
        return this.length;
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
    },
    cloneNode: function(elem, isDeep = true) {
        if (elem instanceof HTMLElement) {
            return elem.cloneNode(isDeep);
        }
        throw new Error('elem不是一个HTMLElement对象');
    }
};

Irene.tool = {
    typeof: function(value) {
        return Object.prototype.toString.call(value).slice(8, -1);
    },
    assertType: function(value, type) {
        return Irene.tool.typeof(value) === type;
    },
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