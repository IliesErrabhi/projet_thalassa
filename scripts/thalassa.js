

// class point
// range ([0..1],[0..1])
class Point {

    // private fields
    #x=0;
    #y=0;

    // constructor
    constructor (x,y) {
        this.#x=x;
        this.#y=y;
    }

    // accessor
    x = () => this.#x;
    y = () => this.#y;


    //assuming n is y coordinate
    // range [0..1]
    horizontalSymmetry(n) {
        const _x    = this.x();
        var   _y    = this.y();
        const delta = _y-n;
        _y          = n - delta;
        return new Point(_x,_y);
        
    }

    //assuming n is x coordinate
    // range [0..1]
    verticalSymmetry(n) {
        var  _x     = this.x();
        const _y    = this.y();
        const delta = _x-n;
        _x          = n - delta;    
        return new Point(_x,_y);
    }

    // average beetween this point and p argument
    average(p, alpha) {
        var new_x=(this.x() + p.x()/2)*alpha;
        var new_y=(this.y() + p.y()/2)*alpha;
        return new Point(new_x,new_y);
    }

    // clone point passed in argument
    // can be used without instance
    static clone(p) {
        return new Point(p.x(),p.y());
    }

    toJson = () => { 
        return {
            "x": this.x(),
            "y": this.y()
        };
    }


}


//Create a composite color from R G B
class Color {

    #red=255;
    #green=104;
    #blue=128;

    constructor (red,green,blue) {
        if (red < 0 || green < 0 || blue < 0) {
            this.#red=this.randomChannel();
            this.#green=this.randomChannel();
            this.#blue=this.randomChannel()
        } else {
            this.#red=red;
            this.#green=green;
            this.#blue=blue;
        }
    }

    red   = () => this.#red;
    green = () => this.#green;
    blue  = () => this. #blue;


    randomChannel = () => {
        return Math.floor(Math.random() * 255);
    }

    toJson = () => { 
        return {
            "r": this.red(),
            "g": this.green(),
            "b": this.blue()
        };
    }

    value = () => "rgb("+this.#red+","+this.#green+","+this.#blue+")";
      
}



// class Segment from 2 points
class Segment {

    // private fields
    #p1    = new Point(0,0);
    #p2    = new Point(0,0);
    #color = new Color(0,0,0);


    // Constructor
    constructor (p1,p2, color) {
        this.#p1=p1;
        this.#p2=p2;
        this.#color=color;
    }

    // accessor
    p1    = () => this.#p1;
    p2    = () => this.#p2;
    color = () => this.#color;


    horizontalSymmetry (n) {
        return new Segment(
                this.p1().horizontalSymmetry(n),
                this.p2().horizontalSymmetry(n),
                this.color()
            );
    }

    verticalSymmetry (n) {
        return new Segment(
                this.p1().verticalSymmetry(n),
                this.p2().verticalSymmetry(n),
                this.color() 
            );
    }

    average(p, alpha) {
        return new Segment(
            this.p1().average(p,alpha),
            this.p2().average(p,alpha),
            this.color() 
        );
    }


    // clone segment passed in argument
    // can be used without instance
    static clone(s) {
        return new Segment( s.p1(),s.p2(), s.color());
    }


    toJson = () => { 
                        return {
                            "from":  this.p1().toJson(),
                            "to":    this.p2().toJson(),
                            "color": this.color().toJson()
                        };
                    }


}



class Model {

    constructor(tab) {
        this.dataModel = [];
        this.redo =[];

        tab.forEach(element => {
            const x1= element[0][0];
            const y1= element[0][1];
            const x2= element[1][0];
            const y2= element[1][1];

            const p1 = new Point(x1,y1);
            const p2 = new Point(x2,y2);
            const color = new Color(-1,-1,-1);

            this.addSegment(p1,p2,color);

        });
    }


    size = () =>  this.dataModel.length;



    getSegment = (index) => {
        if (index > -1 && index < this.size()) {
            return this.dataModel[index];
        }
    }

    setSegment = (index, segment) => {
        if (index > -1 && index < this.size()) {
            this.dataModel[index] = segment;
        }
    }


    addSegment = (p1,p2,color) => {
        this.dataModel.push(new Segment(p1,p2,color));
    }

    

    paint = (ctx) => {

        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

        this.dataModel.forEach(segment => {         
           ctx.strokeStyle = segment.color().value();
           ctx.lineWidth = 5;
            ctx.beginPath();
               ctx.moveTo(segment.p1().x(), segment.p1().y());
               ctx.lineTo(segment.p2().x(), segment.p2().y());
             ctx.stroke(); 
          });
         
    }


    clear = (ctx) => {
        console.log("clearing");
        this.dataModel=[];
        this.redo=[];
        this.paint(ctx);
    }


    undoing = (ctx) => {
        console.log("undoing");
        if (this.dataModel.length>0) {
            this.redo.push(this.dataModel.pop());        
            this.paint(ctx);
        }
        
    }


    redoing = (ctx) => {        
        console.log("undoing");
        if (this.redo.length>0) {
            this.dataModel.push(this.redo.pop());        
            this.paint(ctx);
        }
        
    }



    verticalSymmetry = (ctx) => {
        console.log("verticalSymmetry");
        const n = 0.5*ctx.canvas.width;
        const _dataModel=[];
        this.dataModel.forEach(segment => _dataModel.push(segment.verticalSymmetry(n)));
        this.dataModel = _dataModel;
        this.paint(ctx);
    }


    horizontalSymmetry = (ctx) => {
        console.log("horizontalSymmetry");
        const n = 0.5*ctx.canvas.height;
        const _dataModel=[];
        this.dataModel.forEach(segment => _dataModel.push(segment.horizontalSymmetry(n)));
        this.dataModel = _dataModel;
        this.paint(ctx);
    }

    export = () => {

        let json = {"lines" : []};

        this.dataModel.forEach(segment => {
            json.lines.push(segment.toJson());
        });

        return  JSON.stringify(json, null, '  ');

    }

}


const  model_one = [
        [[40,230],[80,270]],
        [[80,270],[300,270]],
        [[300,270],[350,230]],
        [[350,230],[40,230]],
        [[180,230],[170,120]],
        [[170,120],[220,150]],
        [[220,150],[180,180]],
        [[40,230],[40,230]],
        [[40,230],[40,230]],
        [[40,230],[40,230]],
        [[40,230],[40,230]],
        [[40,230],[40,230]]
    ];

const model_two = [
        [[150,160],[140,120]],
        [[140,120],[210,120]],
        [[210,120],[210,180]],
        [[210,180],[110,180]],
        [[110,180],[100,110]],
        [[100,110],[190,50]],
        [[190,50],[290,100]],
        [[290,100],[280,200]],
        [[280,200],[170,230]],
        [[170,230],[60,190]],
        [[60,190],[60,50]],
        [[60,50],[160,70]]
    ];





    // WHITEBOARD CLASS
class Whiteboard  {

     canvas;
     point;
     model;     
     width;
     height;
     bounds;
     ctx;
     undoElement;
     redoElement;
     isdown;
    

    constructor(canvas) {

        canvas.addEventListener("mousedown", (e) => this.point_start(e), false);
        canvas.addEventListener("mouseup",   (e) => this.point_end(e), false);
        canvas.addEventListener("mousemove", (e) => this.pendingLine(e), false);

        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');
        this.width  = canvas.width;
        this.height = canvas.height;
        this.bounds = canvas.getBoundingClientRect();    
        this.model  = new Model([]);
        this.isdown = false;
    }
  


    


    setClear   = (e)=> {e.addEventListener("mouseup", this.clear, false);}
    setUndo    = (e)=> {e.addEventListener("mouseup", this.undo, false);}
    setRedo    = (e)=> {e.addEventListener("mouseup", this.redo, false);}
    setMirrorH = (e)=> {e.addEventListener("mouseup", this.mirrorH, false);}
    setMirrorV = (e)=> {e.addEventListener("mouseup", this.mirrorV, false);}


    clear   = () => this.model.clear(this.ctx);
    undo    = () => this.model.undoing(this.ctx);
    redo    = () => this.model.redoing(this.ctx);
    mirrorH = () => this.model.horizontalSymmetry(this.ctx);
    mirrorV = () => this.model.verticalSymmetry(this.ctx);
    paint   = () => this.model.paint(this.ctx);
    

    point_start = (e) => {
        const x = e.clientX - this.bounds.left;
        const y = e.clientY - this.bounds.top;
        this.point = new Point (x,y);
        this.isdown = true;
    } 


    pendingLine = (e) => {
        if (this.isdown) {
            console.log('pendingLine');
            const x = e.clientX - this.bounds.left;
            const y = e.clientY - this.bounds.top;
            
            this.model.paint(this.ctx);

            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.setLineDash([10, 4]);
            this.ctx.moveTo((this.point.x()), this.point.y());
            this.ctx.lineTo(x,y);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            

        } 
       

    } 


    point_end = (e) => {
        this.isdown = false;
        const x = e.clientX - this.bounds.left;
        const y = e.clientY - this.bounds.top;
        
        const color = new Color(-1,-1,-1);

        this.model.addSegment(this.point, new Point (x,y) ,color);

        //this.model.clear(this.ctx);
        this.model.paint(this.ctx);

   }

}