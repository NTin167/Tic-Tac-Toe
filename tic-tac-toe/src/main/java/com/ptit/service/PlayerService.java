package com.ptit.service;

import com.ptit.exception.ResourceNotFoundException;
import com.ptit.model.Player;
import com.ptit.repository.PlayerRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PlayerService {
    @Autowired
    PlayerRepository playerRepository;

    Player updateScore(Player player) {
        Player player1 = playerRepository.findByLogin(player.getLogin())
                .orElseThrow(() -> new ResourceNotFoundException("login", "login", player.getLogin()));
        player1.setScore(player1.getScore() + 100);
        playerRepository.save(player1);
        return player1;
    }


}

