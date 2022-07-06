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

class Irene {
    constructor(elems) {
        this.elems = elems;
        this.length = elems.length;
    }

    [Symbol.iterator]() {
        const self = this;
        return {
            current: 0,
            last: this.elems.length,

            next() {
                if (this.current < this.last) {
                    return { done: false, value: self.elems[this.current++] };
                } else {
                    return { done: true };
                }
            }
        };
    }

    forEach(f) {
        for (const [index, item] of this.elems.entries()) {
            f.call(item, item, index);
        }
    }

    map(f) {
        const elems = [];
        for (const [index, item] of this.elems.entries()) {
            elems.push(f.call(item, item, index));
        }
        return new Irene(elems);
    }

    filter(f) {
        const elems = [];
        for (const [index, item] of this.elems.entries()) {
            if (f.call(item, item, index)) {
                elems.push(item);
            }
        }
        return new Irene(elems);
    }

    sort(f=(a,b)=>a-b) {
        this.elems.sort(f);
        return this;
    }

    merge() {
        const array = [];
        this.forEach(item => {
            if (Array.isArray(item)) {
                array.push(...this.merge.call(new Irene(item)).getElems());
            } else if (Irene.tool.isIrene(item)) {
                array.push(...this.merge.call(item).getElems());
            } else {
                array.push(item);
            }
        });
        return new Irene(array);
    }

    reverse() {
        this.elems = this.elems.reverse();
        return this;
    }
    
    parent() {
        const parents = [];
        this.forEach(item => {
            const parent = item.parentNode;
            const index = parents.findIndex(node => node === parent);
            if (index === -1) {
                parents.push(parent);
            }
        });
        return new Irene(parents);
    }

    siblings() {
        const [item] = this.first().getElems();
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
    }

    children() {
        const childrens = [];
        this.forEach(item => {
            const children = Array.from(item.children);
            childrens.push(...children);
        })
        return new Irene(childrens);
    }

    begin(elem) {
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
    }

    append(elem) {
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
    }

    beginChild(elem) {
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
    }

    appendChild(elem) {
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
    }

    remove() {
        this.forEach(item => {
            if (item instanceof HTMLElement) {
                item.remove();
            } else {
                throw new Error('elem不是一个HTMLElement对象');
            }
        });
        return this;
    }

    render() {
        this.parent().appendChild(this);
        this.remove();
        return this;
    }

    at(index) {
        if (index >= this.len()) {
            throw new Error('下标访问越界');
        }
        return new Irene([this.elems[index]]);
    }

    range(startIndex = 0, endIndex = 0) {
        if (startIndex === 0 && endIndex === 0) {
            return new Irene(this.elems.slice());
        } else if (endIndex === 0) {
            return new Irene(this.elems.slice(startIndex));
        } else {
            return new Irene(this.elems.slice(startIndex, endIndex));
        }
    }

    first() {
        if (this.len() < 1) {
            throw new Error('当前元素为空');
        }
        return this.at(0);
    }

    last() {
        if (this.len() < 1) {
            throw new Error('当前元素为空');
        }
        return this.at(this.len() - 1);
    }

    text() {
        let text = '';
        this.forEach(item => text += item.innerText);
        return text;
    }

    setText(text) {
        this.forEach(item => item.innerText = text);
        return this;
    }

    clear() {
        this.elems = [];
        this.length = 0;
    }

    clone(isDeep = true) {
        return this.map(item => Irene.core.cloneNode(item));
    }

    getElems() {
        return this.elems;
    }

    len() {
        return this.length;
    }
}

Irene.core = {
    id(idName) {
        return [document.getElementById(idName)];
    },
    class(className) {
        return Array.from(document.getElementsByClassName(className));
    },
    tag(tagName) {
        return Array.from(document.getElementsByTagName(tagName));
    },
    cloneNode(elem, isDeep = true) {
        if (elem instanceof HTMLElement) {
            return elem.cloneNode(isDeep);
        }
        throw new Error('elem不是一个HTMLElement对象');
    }
};

Irene.tool = {
    typeof(value) {
        return Object.prototype.toString.call(value).slice(8, -1);
    },
    assertType(value, type) {
        return Irene.tool.typeof(value) === type;
    },
    isId(str) {
        const regex = /^[#]\D+/;
        return regex.test(str);
    },
    isClass(str) {
        const regex = /^[.]\D+/;
        return regex.test(str);
    },
    isTag(str) {
        const regex = /^\D+/;
        return regex.test(str);
    },
    isIrene(elem) {
        return elem instanceof Irene;
    }
};

window.$irene = (x) => new IreneVisit(x).execute();