
export const handleCheckMate = ({
    infUser,
    auth,
    userChess,
    setCheckMate,
    game
  }) => {
   
        setCheckMate((prevCheckMate) => ({
          ...prevCheckMate,
          userId: auth?.user?._id,
          opponentId: infUser?.idOpponent,
          name: auth?.user?.username,
          nameOpponent: infUser?.username,
          bandera: auth?.user?.imagenBandera,
          banderaOpponent: infUser?.bandera,
          country: auth?.user?.country,
          countryOpponent: infUser?.country,
          time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
            infUser?.time === 180 || infUser?.time === 300 ? 'blitz' : 'fast'}`,
          game,
          eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
            parseInt(userChess?.eloFast)}`,
          eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(infUser?.blitz) :
            parseInt(infUser?.fast)}`,
          elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
            parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
          color: infUser?.color
        }));
      
  };
  