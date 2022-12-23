package com.ptit.controller;

import com.ptit.AlphaBetaPrunning;
import com.ptit.controller.dto.ConnectRequest;
import com.ptit.exception.InvalidGameExeption;
import com.ptit.exception.InvalidParamException;
import com.ptit.exception.NotFoundException;
import com.ptit.model.Game;
import com.ptit.model.GamePlay;
import com.ptit.model.Player;
import com.ptit.security.CurrentUser;
import com.ptit.security.UserPrincipal;
import com.ptit.service.GameService;
import com.ptit.service.PlayerService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;
    private final PlayerService playerService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @GetMapping("/getAllPlayer")
    public List<Player> getAll() {

        return playerService.getAllPlayers();
    }

    @PostMapping("/start")
    public ResponseEntity<Game> start(@RequestBody Player player) {
        log.info("start game request: {}", player);
//        System.out.println(currentUser.getName());
        return ResponseEntity.ok(gameService.createGame(player));
    }


    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectRequest request) throws InvalidParamException, InvalidGameExeption {
        log.info("connect request: {}", request);
        return ResponseEntity.ok(gameService.connectToGame(request.getPlayer(), request.getGameId()));
    }

    @PostMapping("/connect/random")
    public ResponseEntity<Game> connectRandom(@RequestBody Player player,@CurrentUser UserPrincipal user2) throws NotFoundException {
        log.info("connect random {}", player);
        return ResponseEntity.ok(gameService.connectToRandomGame(player, user2));
    }

    @PostMapping("/gameplay")
    public ResponseEntity<Game> gamePlay(@RequestBody GamePlay request) throws NotFoundException, InvalidGameExeption {
        log.info("gameplay: {}", request);
        Game game = gameService.gamePlay(request);
        simpMessagingTemplate.convertAndSend("/topic/game-progress/" + game.getGameId(), game);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/AIgameplay")
    public ResponseEntity<Game> AIplay(@RequestBody GamePlay request) throws NotFoundException, InvalidGameExeption {
        log.info("gameplay: {}", request);
        Game game = gameService.AIPlayTest(request);
        return ResponseEntity.ok(game);
    }
}
