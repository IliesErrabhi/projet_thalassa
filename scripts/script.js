var Point = function (x, y) {
    Object.defineProperty(this, 'x', {
        configurable: false,
        enumerable: true,
        value: x,
        writable: false
    });
    Object.defineProperty(this, 'y', {
        configurable: false,
        enumerable: true,
        value: y,
        writable: false
    });
};


Point.prototype.horizontalSymmetry = function (n) {
    var i = 0;
    var c;
    for (i = 0;i < 2;i += 1) {
        c = document.getElementById("c" + String(i));
        switch (n) {
            case 0:
                return new Point(this.x, -this.y);
            case 0.5://si le point est avant la droite horizontale 0,5  symétrie après sinon l'inverse
                if (this.y <= (c.height * 0.5)) {
                    return new Point(this.x, 2 * this.y);
                }else {
                    return new Point(this.x, this.y / 2);
                }
            case 1:
                return new Point(this.x, 2 * this.y);
            default:
                alert("Veuillez entrer une de ces trois valeurs entières: 0     0.5      1");
        }
    }
};

Point.prototype.verticalSymmetry=function(n){
    for(var i=0;i<2;i++){
        var c=document.getElementById("c"+String(i));
        switch(n){
            case 0:
                return new Point(-this.x,this.y);
            case 0.5://si le point est avant la droite verticale 0,5  symétrie après sinon l'inverse
                if(this.x <= c.width*0,5){
                    return new Point(2*this.x,this.y);
                }
                else{
                    return new Point(this.x/2,this.y);
                }
            case 1:
                return new Point(2*this.x,this.y);
            default:
                alert("Veuillez entrer une de ces trois valeurs entières: 0     0.5      1")
        }
    }
};


Point.prototype.clone=function(p){
    return new Point(p.x,p.y)
};

Point.prototype.average=function(p,alpha){
    var new_x=((this.x*alpha)+(p.x*alpha))/2*alpha;
    var new_y=((this.y*alpha)+(p.y*alpha))/2*alpha;
    return new Point(new_x,new_y);
};



var Segment=function(p1,p2,color){
    Object.defineProperty(this,'p1',{
        value:p1,
        writable:false,
        configurable:false,
        enumerable:true
    });
    Object.defineProperty(this,'p2',{
        value:p2,
        writable:false,
        configurable:false,
        enumerable:true
    });
    Object.defineProperty(this,'color',{
        value:color,
        writable:false,
        configurable:false,
        enumerable:true
    });
};



Segment.prototype.horizontalSymmetry=function(n){
    switch(n){
        case 0:
            return new Segment(this.p1.horizontalSymmetry(n),this.p2.horizontalSymmetry(n),color);
        case 0.5://si le point est avant la droite horizontale 0,5  symétrie après sinon l'inverse
            return new Segment(this.p1.horizontalSymmetry(n),this.p2.horizontalSymmetry(n),color);
        case 1:
            return new Segment(this.p1.horizontalSymmetry(n),this.p2.horizontalSymmetry(n),color);
        default:
            alert("Veuillez entrer une de ces trois valeurs entières: 0     0.5      1")
        }
};

Segment.prototype.verticalSymmetry=function(n){
    switch(n){
        case 0:
            return new Segment(this.p1.verticalSymmetry(n),this.p2.verticalSymmetry(n),color);
        case 0.5://si le point est avant la droite horizontale 0,5  symétrie après sinon l'inverse
            return new Segment(this.p1.verticalSymmetry(n),this.p2.verticalSymmetry(n),color);
        case 1:
            return new Segment(this.p1.verticalSymmetry(n),this.p2.verticalSymmetry(n),color);
        default:
            alert("Veuillez entrer une de ces trois valeurs entières: 0     0.5      1")
        }
};

Segment.prototype.average=function(p,alpha){
    return new Segment(this.p1.average(p,alpha),this.p2.average(p,alpha),color);
};


function computeCoordinates(event) {
    // on récupère l'élément qui a produit l'événement (ici le canvas)
    const canvas = event.currentTarget;
    // on demande le rectangle englobant le canvas
    const rect = canvas.getBoundingClientRect();
    // on calcule les coordonnées relatives
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x, y];
}