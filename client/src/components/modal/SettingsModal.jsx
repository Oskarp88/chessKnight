import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import style from './SettingsModal.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Carousel from 'react-bootstrap/Carousel';
import { useChessboardContext } from '../../context/boardContext';
import { colorBoard } from '../../utils/Colors';
import { piecesTheme } from '../../utils/pieces';



function SettingsModal({show, handleClose}) {

    const {
        setBoardColor, 
        boardColor,
        themePiece, 
        setTemePiece
     } = useChessboardContext();

   const handleColorChange = (num) => {
    setBoardColor(colorBoard[num]);
    localStorage.setItem('colorBoard', num);
   }

   const handlePiecesChange = (num) => {
    setTemePiece(piecesTheme[num]);
    localStorage.setItem('pieceTheme', num);
   }

    
  return (
    <Modal show={show} onHide={handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>Configuracion</Modal.Title>
      </Modal.Header>
      <Modal.Body className={style.modalBodyWithScroll}>
      <Accordion defaultActiveKey="0" flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Tablero #1</Accordion.Header>
            <Accordion.Body>
                <div className={style.coloroptions}>
                    {colorBoard?.map((c, index) => {
                        const isEvenIndex = (index + 1) % 2 === 0;
                            return (
                            <div 
                              key={c.id} className={`${style.coloroption} ${isEvenIndex ? `${style.even}` : `${style.odd}`}`}
                              onClick={() => handleColorChange(c.id)}
                              style={c.id === boardColor.id ? {background: boardColor.register} : {}}
                            >                           
                                <div className={style.colorrow}>
                                    <div className={style.colorboard} style={{ backgroundColor: c.blackRow }}></div>
                                    <div className={style.colorboard} style={{ backgroundColor: c.whiteRow }}></div>
                                </div>
                                <div className={style.colorrow}>
                                    <div className={style.colorboard} style={{ backgroundColor: c.whiteRow }}></div>
                                    <div className={style.colorboard} style={{ backgroundColor: c.blackRow }}></div>
                                </div>
                            </div>
                       )}
                    )}
                </div>
            </Accordion.Body>
        </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>piezas #2</Accordion.Header>
            <Accordion.Body>
              <div className={style.coloroptions}>
                    {piecesTheme?.map((c, index) => {
                        const isEvenIndex = (index + 1) % 2 === 0;
                            return (
                            <div 
                              key={c.id} className={`${style.coloroption} ${isEvenIndex ? `${style.even}` : `${style.odd}`}`}
                              onClick={() => handlePiecesChange(c.id)}
                              style={c?.id === themePiece.id ? {background: boardColor?.whiteRow} : {}}
                            >                           
                                <div className={style.colorrow}>
                                    <div className={style.colorboard} style={{ backgroundColor: boardColor?.blackRow }}>
                                      <img src={ `assets/${c.images}/wk.png`} alt="" />
                                    </div>
                                    <div className={style.colorboard} style={{ backgroundColor: boardColor?.whiteRow }}>
                                      <img src={ `assets/${c.images}/wq.png`} alt="" />
                                    </div>
                                </div>
                                <div className={style.colorrow}>
                                    <div className={style.colorboard} style={{ backgroundColor: boardColor?.whiteRow }}>
                                      <img src={ `assets/${c.images}/bk.png`} alt="" />
                                    </div>
                                    <div className={style.colorboard} style={{ backgroundColor: boardColor?.blackRow }}>
                                      <img src={ `assets/${c.images}/bq.png`} alt="" />
                                    </div>
                                </div>
                            </div>
                       )}
                    )}
                </div>
            </Accordion.Body>
        </Accordion.Item>
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose} >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SettingsModal