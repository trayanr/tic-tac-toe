import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild("board") board!: ElementRef<HTMLDivElement>;
  @ViewChild("line") line!: ElementRef<HTMLDivElement>;
  turn = 0;
  toasts = [];
  b = [
    ['','',''],
    ['','',''],
    ['','','']
  ];
  won = false;
  winner = "";
  click(place: number) {
    if (this.won) return;
    let {x, y} = this.placeToXY(place);
    let sym = this.symbol as "x" | "o";
    if (!this.placeASymbol(sym, y, x)) {
      return;
    }
    this.turn++;
    let winner = this.checkForWinner(sym, y,x);
    if (winner != null) {
      console.log(winner);
      this.won =true;
      this.winner = winner.symbol;
      this.drawLine(winner.start, winner.end);
    }
  }

  get symbol() {
    if (this.turn %2==0) return "x";
    return "o";
  }

  placeToXY(place:number): {x:number, y:number}{
    let x = place % 3;
    if (x == 0) x = 3;
    let y = Math.floor(place/3) + 1;
    if (x == 3) y -= 1;
    return {x, y};
  }

  placeASymbol(symbol: "x"| "o", y:number,x: number) : boolean {
    let row = y;
    let place = x;
    let elemts_row = this.board.nativeElement.children[row-1];
    let div = elemts_row.children[place -1];
    if (!div.classList.contains("x") && !div.classList.contains("o")) {
      div.classList.add(symbol);
      this.b[row-1][place-1] = symbol;
      return true;
    }
    return false;
  }


  checkForWinner(symbol: "x"| "o", y_placement: number ,x_placement:number): {
    start: {x:number, y:number},
    end: {x:number, y:number}, 
    symbol: "x"| "o"
  }| null {

    //checking all cols
    for(let y = 1; y<=3; y++) {
      if (this.b[y-1][x_placement-1] != symbol) break;
      if(y == 3) return {
        start: {x: x_placement, y: 1}, 
        end:{x:x_placement, y: 3}, 
        symbol
      };
    }


    //checking all rows
    for(let x=1; x<=3; x++) {
      if (this.b[y_placement-1][x-1] != symbol) break;
      if(x == 3) return {
        start: {x: 1, y:y_placement},
        end: {x:3, y: y_placement},
        symbol
      };
    }
    //first diagonal
    if(x_placement == y_placement) {
      for(let i = 1; i <= 3; i++){
        if(this.b[i-1][i-1] != symbol) break;
        if(i == 3) return {
          start :{x:1, y:1},
          end:{x:3, y:3},
          symbol
        };
      }
    }

    //second diagonal
    if (x_placement + y_placement == 4) {
      for(let i = 1; i <= 3; i++){
        if(this.b[i-1][3-i] != symbol) break;
        if(i == 3) return {
          start: {x:3, y:1},
          end: {x:1, y:3},
          symbol
        };
      }
    }


    return null;
  }

  drawLine(point_a: {x:number,y:number}, point_b: {x: number, y:number}) {
    let elem_a = this.board.nativeElement.children[point_a.y - 1].children[point_a.x - 1];
    let elem_b = this.board.nativeElement.children[point_b.y - 1].children[point_b.x - 1];

    let start = {
      x:elem_a.getBoundingClientRect().right / 2 + elem_a.getBoundingClientRect().left/2,
      y:elem_a.getBoundingClientRect().bottom / 2 + elem_a.getBoundingClientRect().top / 2 ,
    }; 

    let end = {
      x:elem_b.getBoundingClientRect().right / 2 + elem_b.getBoundingClientRect().left/2,
      y:elem_b.getBoundingClientRect().bottom / 2 + elem_b.getBoundingClientRect().top/2,
    }; 

    let slope_rad = Math.atan2(start.y - end.y, start.x - end.x);
    let slope_deg = (slope_rad * 180) / Math.PI;
    let distance = Math.sqrt(((start.x - end.x)*(start.x - end.x)) + ((start.y - end.y)*(start.y - end.y)));

    let x_mid = (start.x + end.x) / 2;
    let y_mid = (start.y + end.y) / 2;

    this.line.nativeElement.style.width = distance.toString()+"px";
    this.line.nativeElement.style.top = y_mid.toString()+"px";
    this.line.nativeElement.style.left = (x_mid - distance/2).toString()+"px";
    this.line.nativeElement.style.transform = `rotate(${slope_deg}deg)`;
  }

  reset() {
    this.won = false;
    this.winner = '';
    this.b = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    for (let y = 0; y < 3; y++) {
      for(let x = 0; x< 3; x++) {
        this.board.nativeElement.children[y].children[x].classList.remove("x", "o");
      }
    }
    this.line.nativeElement.style.width = 0+"px";
    this.line.nativeElement.style.top = 0+"px";
    this.line.nativeElement.style.left = 0+"px";
    this.line.nativeElement.style.transform = `rotate(0deg)`;
    this.turn = 0;
  }
}
