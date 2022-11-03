package com.ptit.service;

import com.ptit.exception.InvalidGameExeption;
import com.ptit.exception.InvalidParamException;
import com.ptit.exception.NotFoundException;
import com.ptit.model.Game;
import com.ptit.model.Player;
import com.ptit.storage.GameStorage;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static com.ptit.model.GameStatus.IN_PROGRESS;
import static com.ptit.model.GameStatus.NEW;

@Service
@AllArgsConstructor
public class GameService {
    public Game createGame(Player player) {
        Game game = new Game();
        game.setBoard(new int [5][5]);
        game.setGameId(UUID.randomUUID().toString());
        game.setPlayer1(player);
        game.setStatus(NEW);
        return game;
    }

    public Game connectToGame(Player player2, String gameId) throws InvalidGameExeption, InvalidParamException {
        if(!GameStorage.getInstance().getGames().containsKey(gameId)) {
            throw new InvalidParamException("Game with provided id doesn't exist");
        }
        Game game = GameStorage.getInstance().getGames().get(gameId);

        if(game.getPlayer2() != null) {
            throw new InvalidGameExeption("Game is not valid anymore");
        }
        game.setPlayer2(player2);
        game.setStatus(IN_PROGRESS);
        GameStorage.getInstance().setGame(game);
        return game;
    }

    public Game connectToRandomGame(Player player2) throws  NotFoundException {
        Game game = GameStorage.getInstance().getGames().values().stream()
                .filter(it -> it.getStatus().equals(NEW))
                .findFirst().orElseThrow(() -> new NotFoundException("Game not found"));
        game.setPlayer2(player2);
        game.setStatus(IN_PROGRESS);
        GameStorage.getInstance().setGame(game);
        return game;
    }

}
