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
    
};

function Irene(x) {
    const visit = new IreneVisit(x);
    return visit.execute();
}

window.$irene = (x) => new Irene(x);