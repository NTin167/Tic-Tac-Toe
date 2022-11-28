package com.ptit.repository;

import com.ptit.model.Player;
import com.ptit.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface PlayerRepository extends CrudRepository<Player, Long> {
    Optional<Player> findByLogin(String login);
}
