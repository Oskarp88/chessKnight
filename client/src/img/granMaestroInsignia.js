import style from'../components/channel/Friends.module.css';

 function GranMaestroInsignia() {
  return (
    <img className={style.insignia} 
        src={`/fondos/granmaestro.png`} 
        alt='assets/avatar/user.png' 
        title="Gran Maestro"
    />
  )
}

export default GranMaestroInsignia;
