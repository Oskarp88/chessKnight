import { useLanguagesContext } from "../context/languagesContext"

function Fast() {
    const {language} = useLanguagesContext()
    return (
      <img 
        style={{width: '100%', height: '100%'}} 
        src={`/icon/fast.png`} 
        alt='fast' 
        title={language?.fast}
    />
    )
  }

  export default Fast;