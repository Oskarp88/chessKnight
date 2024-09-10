import { Aprendiz, Avanzado, Competente, Elite, Experto, Leyenda, Maestro, Novato, Prodigio, Veterano } from '../../img'

function Insignias({o, time}) {
  return (
    <div>
        { time === 60 || time === 120 || time === 'bullet' ? 
            o?.eloBullet < 50 ? <Novato /> : 
            o?.eloBullet >= 50 && o?.eloBullet <= 150 ? <Aprendiz/> : 
            o?.eloBullet >= 151 && o?.eloBullet <= 300? <Avanzado /> : 
            o?.eloBullet >= 301 && o?.eloBullet <= 439 ? <Competente /> :
            o?.eloBullet >= 440 && o?.eloBullet <= 515 ? <Experto /> :
            o?.eloBullet >= 516 && o?.eloBullet <= 705 ? <Veterano /> : 
            o?.eloBullet >= 706 && o?.eloBullet  <= 850 ? <Maestro/> : 
            o?.eloBullet >= 851 && o?.eloBullet  <= 999 ? <Elite/> :
            o?.eloBullet >= 1000 && o?.eloBullet <= 1359 ? <Prodigio /> : 
             <Leyenda/> :
            time === 180 || time === 300 || time === 'blitz' ? 
            o?.eloBlitz < 50 ? <Novato /> : 
            o?.eloBlitz >= 50 && o?.eloBlitz <= 150 ? <Aprendiz/> : 
            o?.eloBlitz >= 151 && o?.eloBlitz <= 300? <Avanzado /> : 
            o?.eloBlitz >= 301 && o?.eloBlitz <= 439 ? <Competente /> :
            o?.eloBlitz >= 440 && o?.eloBlitz <= 515 ? <Experto /> :
            o?.eloBlitz >= 516 && o?.eloBlitz <= 705 ? <Veterano /> : 
            o?.eloBlitz >= 706 && o?.eloBlitz  <= 850 ? <Maestro/> : 
            o?.eloBlitz >= 851 && o?.eloBlitz  <= 999 ? <Elite/> :
            o?.eloBlitz >= 1000 && o?.eloBlitz <= 1359 ? <Prodigio /> : 
             <Leyenda/> :
             o?.eloFast  < 50 ? <Novato /> : 
             o?.eloFast >= 50 && o?.eloFast <= 150 ? <Aprendiz/> : 
             o?.eloFast >= 151 && o?.eloFast <= 300? <Avanzado /> : 
             o?.eloFast >= 301 && o?.eloFast <= 439 ? <Competente /> :
             o?.eloFast >= 440 && o?.eloFast <= 515 ? <Experto /> :
             o?.eloFast >= 516 && o?.eloFast <= 705 ? <Veterano /> : 
             o?.eloFast >= 706 && o?.eloFast  <= 850 ? <Maestro/> : 
             o?.eloFast >= 851 && o?.eloFast <= 999 ? <Elite/> :
             o?.eloFast >= 1000 && o?.eloFast <= 1359 ? <Prodigio /> : 
             <Leyenda/> 
         } 
    </div>
  )
}

export default Insignias