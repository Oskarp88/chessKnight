import style from'../components/channel/Friends.module.css';

function Competente() {
  return (
    <img className={style.insignia} 
        src={`/insignias/Competente.png`} 
        alt='assets/avatar/user.png' 
        title="Competente"
    />
  )
}

export default Competente;