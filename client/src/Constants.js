import { PieceType } from "./Types";



export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];
  

export const initPieces = [
    { image: `assets/images/wp.png`, x: 0, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images/wp.png`, x: 1, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images/wp.png`, x: 2, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images/wp.png`, x: 3, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images/wp.png`, x: 4, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images/wp.png`, x: 5, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images/wp.png`, x: 6, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images/wp.png`, x: 7, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images/wk.png`, x: 4, y: 0, color: 'white', hasMoved: false, type: PieceType.KING },
    { image: `assets/images/bb.png`, x: 2, y: 7, color: 'black', hasMoved: false, type: PieceType.BISHOP },
    { image: `assets/images/bb.png`, x: 5, y: 7, color: 'black', hasMoved: false, type: PieceType.BISHOP },
    { image: `assets/images/wr.png`, x: 0, y: 0, color: 'white', hasMoved: false, type: PieceType.ROOK },
    { image: `assets/images/wr.png`, x: 7, y: 0, color: 'white', hasMoved: false, type: PieceType.ROOK },
    { image: `assets/images/wq.png`, x: 3, y: 0, color: 'white', hasMoved: false, type: PieceType.QUEEN },
    { image: `assets/images/wb.png`, x: 2, y: 0, color: 'white', hasMoved: false, type: PieceType.BISHOP },
    { image: `assets/images/wb.png`, x: 5, y: 0, color: 'white', hasMoved: false, type: PieceType.BISHOP },
    { image: `assets/images/wn.png`, x: 1, y: 0, color: 'white', hasMoved: false, type: PieceType.KNIGHT},
    { image: `assets/images/wn.png`, x: 6, y: 0, color: 'white', hasMoved: false, type: PieceType.KNIGHT },
    { image: `assets/images/br.png`, x: 0, y: 7, color: 'black', hasMoved: false, type: PieceType.ROOK },
    { image: `assets/images/br.png`, x: 7, y: 7, color: 'black', hasMoved: false, type: PieceType.ROOK },
    { image: `assets/images/bn.png`, x: 1, y: 7, color: 'black', hasMoved: false, type: PieceType.KNIGHT },
    { image: `assets/images/bn.png`, x: 6, y: 7, color: 'black', hasMoved: false, type: PieceType.KNIGHT },
    { image: `assets/images/bk.png`, x: 4, y: 7, color: 'black', hasMoved: false, type: PieceType.KING },
    { image: `assets/images/bq.png`, x: 3, y: 7, color: 'black', hasMoved: false, type: PieceType.QUEEN },
    { image: `assets/images/bp.png`, x: 0, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images/bp.png`, x: 1, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images/bp.png`, x: 2, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images/bp.png`, x: 3, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images/bp.png`, x: 4, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images/bp.png`, x: 5, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images/bp.png`, x: 6, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images/bp.png`, x: 7, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  }
];

export const valors = [
    {id: 1, moneda: 500, valor: '500'},
    {id: 2, moneda: 1000, valor: '1K'},
    {id: 3, moneda: 2000, valor: '2K'},
    {id: 4, moneda: 5000, valor: '5K'},
    {id: 5, moneda: 10000, valor: '10K'},
    {id: 6, moneda: 20000, valor: '20K'},
    {id: 7, moneda: 50000, valor: '50K'},
    {id: 8, moneda: 100000, valor: '100K'},
    {id: 9, moneda: 250000, valor: '250K'},
    {id: 10, moneda: 500000, valor: '500K'},
    {id: 11, moneda: 1000000, valor: '1M'},
]

