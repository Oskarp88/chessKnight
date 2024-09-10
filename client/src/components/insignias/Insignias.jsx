import { Aprendiz, Avanzado, Competente, Experto, Maestro, Novato, Veterano } from '../../img'

function Insignias({o, time}) {
  return (
    <div>
        { time === 60 || time === 120 ? 
            o?.eloBullet < 21 ? <Novato /> : 
            o?.eloBullet >= 21 && o?.eloBullet <= 61 ? <Aprendiz/> : 
            o?.eloBullet >= 62 && o?.eloBullet <= 100 ? <Avanzado /> : 
            o?.eloBullet >= 101 && o?.eloBullet <= 230 ? <Competente /> :
            o?.eloBullet >= 231 && o?.eloBullet <= 390 ? <Experto /> :
            o?.eloBullet >= 391 && o?.eloBullet <= 549 ? <Veterano /> : 
            <Maestro/> :
            time === 180 || time === 300 ? 
            o?.eloBlitz < 21 ? <Novato/> : 
            o?.eloBlitz >= 21 && o?.eloBlitz <= 61 ? <Aprendiz/> : 
            o?.eloBlitz >= 62 && o?.eloBlitz <= 100 ? <Avanzado/> : 
            o?.eloBlitz >= 101 && o?.eloBlitz <= 230 ? <Competente/> :
            o?.eloBlitz >= 231 && o?.eloBlitz <= 390 ? <Experto/> : 
            o?.eloBlitz >= 391 && o?.eloBlitz <= 549 ?  <Veterano/> : 
            <Maestro/> : 
            o?.eloFast < 21 ? <Novato/> : 
            o?.eloFast >= 21 && o?.eloFast <= 61 ? <Aprendiz/> : 
            o?.eloFast  >= 62 && o?.eloFast  <= 100 ? <Avanzado/> : 
            o?.eloFast  >= 101 && o?.eloFast  <= 230 ? <Competente/> :
            o?.eloFast  >= 231 && o?.eloFast  <= 390 ? <Experto/> : 
            o?.eloFast  >= 391 && o?.eloFast  <= 549 ? <Veterano/> :
            <Maestro/>
         } 
    </div>
  )
}

export default Insignias