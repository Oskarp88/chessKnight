import { PieceType } from '../../Types'
import { useAuth } from '../../context/authContext';
import { useChessboardContext } from '../../context/boardContext';
import { useLanguagesContext } from '../../context/languagesContext';
import style from './PromotionPiece.module.css'

function PromotionPiece({
    currentTurn,
    pieces,
    destinationCell,
    setPieces,
    room,
    setPromotionModalOpen,
    socket
}) {
    const {language} = useLanguagesContext();
    const {auth} = useAuth();

    const handlePromotionSelection = async(promotionPiece) => {
        //  selección de la pieza de promoción
        // Reemplaza el peón con la pieza seleccionada
        const updatedPieces = pieces.map((p) => {
          if (p.x === destinationCell.x && p.y === destinationCell.y && p.type === PieceType.PAWN) {
            return {...promotionPiece, x: p.x, y: p.y, color: currentTurn === 'white' ? 'black' : 'white'};
          }
          return p;
        });
    
        
        setPieces(updatedPieces);
        const pieceData = {
          pieces,
          promotionPiece,
          destinationCell,
          currentTurn,
          author: auth?.user?.username,
          room
        }
    
        await socket.emit("promotion", pieceData);
        setPromotionModalOpen(false);
   };

  return (
    <div className={style.promotionModal}>
        <h2>{language.Choose_a_promotional_piece}</h2>
        <div className={style.promotionOptions}>
            {[
                { type: PieceType.ROOK, image: `assets/images/${currentTurn === 'white' ? 'b' : 'w'}r.png` },
                { type: PieceType.KNIGHT, image: `assets/images/${currentTurn === 'white' ? 'b' : 'w'}n.png` },
                { type: PieceType.BISHOP, image: `assets/images/${currentTurn === 'white' ? 'b' : 'w'}b.png` },
                { type: PieceType.QUEEN, image: `assets/images/${currentTurn === 'white' ? 'b' : 'w'}q.png` },
            ].map((option) => (
                <div
                key={option.type}
                className={style.PromotionOption}
                onClick={() => handlePromotionSelection(option)}
                >
                <img src={option.image} alt={option.type} />
                </div>
            ))}
        </div>
    </div>
  )
}

export default PromotionPiece;