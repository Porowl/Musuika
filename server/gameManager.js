import io from "./server.js";

class Ball{
    x;
    y;
    s;
    constructor(x,y,s){
        this.x = x;
        this.y = y;
        this.s = s;
    }
}

class Game{
    gameId;
    List;
    constructor(id){
        this.gameId = id
        this.emptyList();
    }
    getId = () => {
        return this.gameId;
    }
    emptyList = () =>{
        this.List = [];
    }

    getList = () =>{
        return this.List;
    }

    addList = (data) => {
        this.List = data;
    }
}

export default class GameManager{
    GameList = [];

    addGame = (gameId) =>{
        this.GameList[gameId] = new Game(gameId);
    }
    removeGame = (gameId) =>{
        delete this.GameList[gameId];
    }

    processData = (gameId, data) => {
        const Game = this.GameList[gameId];
        if(!Game) return;
        Game.emptyList();
        Game.addList(data);
    }

    getData = () => {
        let data = {}
        for(const key in this.GameList){
            const game = this.GameList[key];
            data[game.getId()] = game.getList();
        }
        return data;
    }
}
