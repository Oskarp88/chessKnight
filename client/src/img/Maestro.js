import style from'../components/channel/rooms/Friends.module.css';
function Maestro() {
  return (
    <img className={style.insignia} 
        src={`/insignias/Maestro.png`} 
        alt='assets/avatar/user.png' 
        title="Maestro"
    />
  )
}

export default Maestro;