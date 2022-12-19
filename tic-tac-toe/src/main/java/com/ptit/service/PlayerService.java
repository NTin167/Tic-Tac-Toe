package com.ptit.service;

import com.ptit.model.Player;
import com.ptit.repository.PlayerRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class PlayerService {
    @Autowired
    PlayerRepository playerRepository;

    Player winScore(Player player) {
        Player player1 = playerRepository.findByLogin(player.getLogin())
                .orElse(player1 = new Player());
        player1.setLogin(player.getLogin());
        player1.setScore(player1.getScore() + 100);
        player1.setWin(player.getWin());
        player1.setLose(player.getLose());
        player1.setDraw(player1.getDraw());
        playerRepository.save(player1);
        return player1;
    }
    Player loseScore(Player player) {
        Player player1 = playerRepository.findByLogin(player.getLogin())
                .orElse(player1 = new Player());
        player1.setLogin(player.getLogin());
        System.out.println(player1.getScore());
        if(player1.getScore() >= 50)
            player1.setScore(player1.getScore() - 50);
        player1.setWin(player.getWin());
        player1.setLose(player.getLose());
        player1.setDraw(player1.getDraw());
        playerRepository.save(player1);
        return player1;
    }
    Player setPlayerByLogin(Player player) {
        Player player1 = playerRepository.findByLogin(player.getLogin())
                  .orElse(player1 = player);
        player1.setLogin(player.getLogin());
        player1.setScore(player1.getScore());
        player1.setWin(player.getWin());
        player1.setDraw(player.getDraw());
        player1.setLose(player.getLose());
        playerRepository.save(player1);
        return player1;
    }

    Player updatePlayerWin(String login) {
        Player player1 = playerRepository.findByLogin(login)
                .orElse(player1 = new Player());
        player1.setLogin(login);
        player1.setScore(player1.getScore());
        player1.setWin(player1.getWin() + 1);
        player1.setDraw(player1.getDraw());
        player1.setLose(player1.getLose());
        playerRepository.save(player1);
        return player1;
    }

    Optional<Player> updatePlayerLose(Player player) {
        return playerRepository.findByLogin(player.getLogin())
                .map(playerData -> {
                    playerData.setLogin(player.getLogin());
                    playerData.setScore(player.getScore());
                    playerData.setWin(player.getWin());
                    playerData.setDraw(player.getDraw());
                    playerData.setLose(player.getLose() + 1);
                    return playerData;
                });
    }
}

