"use script";

function IreneVisit(x) {
    this.value = x;
    this.type = Object.prototype.toString.call(x).slice(8, -1);
}

IreneVisit.prototype.execute = function() {
    switch (this.type) {
        case 'String': return this.visitString();
    }
};

IreneVisit.prototype.visitString = function() {
    return new Irene(this.value);
};

function Irene(x) {
    this.x = x;
}

window.$irene = (x) => new IreneVisit(x).execute();