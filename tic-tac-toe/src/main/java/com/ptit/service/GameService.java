package com.ptit.service;

import com.ptit.AlphaBetaPrunning;
import com.ptit.exception.InvalidGameExeption;
import com.ptit.exception.InvalidParamException;
import com.ptit.exception.NotFoundException;
import com.ptit.model.*;
import com.ptit.repository.PlayerRepository;
import com.ptit.security.UserPrincipal;
import com.ptit.storage.GameStorage;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.UUID;

import static com.ptit.model.GameStatus.*;

@Service
@AllArgsConstructor
public class GameService {
    @Autowired
    PlayerRepository playerRepository;
    @Autowired
    PlayerService playerService;
    public Game createGame(Player player) {
        Game game = new Game();
        Player player1 = playerRepository.findByLogin(player.getLogin()).orElse(player);
        game.setBoard(new CaroBoard(20));
//        game.setGameId(UUID.randomUUID().toString());
        game.setGameId("1");
        game.setPlayer1(player1);
        game.setStatus(NEW);
        GameStorage.getInstance().setGame(game);
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

    public Game connectToAI(Player player2, String gameId) throws InvalidGameExeption, InvalidParamException {
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

    public Game connectToRandomGame(Player player2, UserPrincipal user) throws  NotFoundException {
        Game game = GameStorage.getInstance().getGames().values().stream()
                .filter(it -> it.getStatus().equals(NEW))
                .findFirst().orElseThrow(() -> new NotFoundException("Game not found"));

        game.setPlayer2(player2);
//        game.getPlayer2().setLogin(user.getUsername());
        game.setStatus(IN_PROGRESS);
        GameStorage.getInstance().setGame(game);
        return game;
    }

    public Game AIPlayTest(GamePlay gamePlay) throws NotFoundException, InvalidGameExeption {
        if (!GameStorage.getInstance().getGames().containsKey(gamePlay.getGameId())) {
            throw new NotFoundException("Game not found");
        }
        Game game = GameStorage.getInstance().getGames().get(gamePlay.getGameId());
        game.setStatus(GameStatus.IN_PROGRESS);
        if (game.getStatus().equals(FINISHED)) {
            throw new InvalidGameExeption("Game is already finished");
        }
        System.out.println(game.getPlayer1().getScore());
        double maxdepth = (double) Math.round(game.getPlayer1().getScore() / 100);
        System.out.println("Maxdept" + maxdepth);
        int[][] board = game.getBoard().getSquare();
        board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = gamePlay.getType().getValue();
        if(check(board) == 1) {
            game.setWinner(TicToe.X);
            playerService.winScore(game.getPlayer1());
            GameStorage.getInstance().setGame(game);
            return game;
        }
        AlphaBetaPrunning alphaBetaPrunning = new AlphaBetaPrunning(20, (int)maxdepth);
        CaroBoard caroBoard = game.getBoard();
        Point p = alphaBetaPrunning.search(game.getBoard());
        board[p.x][p.y] = 2;
        caroBoard.set(p.x, p.y, 2);
        if(check(board) == 2)  {
            game.setWinner(TicToe.O);
            playerService.loseScore(game.getPlayer1());
            GameStorage.getInstance().setGame(game);
            return game;
        }


        GameStorage.getInstance().setGame(game);
        return game;
    }

    public int check(int [][] board) {
        int xWinner = 0;
        int yWinner = 0;
        for (int i = 0; i < 20; i++) {
            for (int j = 0; j < 20; j++) {
                final int a = i, b = j;
                xWinner = checkWin(board, a, b, 1);
                yWinner = checkWin(board, a, b, 2);
                if (xWinner == 1) {
                    return 1;
                }
                if (yWinner == 1) {
                    return 2;
                }
            }
        }
        return -1;
    }
//    public Game AIPlay(GamePlay gamePlay) throws NotFoundException, InvalidGameExeption {
//        if (!GameStorage.getInstance().getGames().containsKey(gamePlay.getGameId())) {
//            throw new NotFoundException("Game not found");
//        }
//        Game game = GameStorage.getInstance().getGames().get(gamePlay.getGameId());
//        game.setStatus(GameStatus.IN_PROGRESS);
//        if (game.getStatus().equals(FINISHED)) {
//            throw new InvalidGameExeption("Game is already finished");
//        }
//        // nguoi danh
//        int[][] board = game.getBoard().getSquare();
//        board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = gamePlay.getType().getValue();
//
//        // AI danh'
//        int maxdepth = 0;
//        AlphaBetaPrunning alphaBetaPrunning = new AlphaBetaPrunning(20, maxdepth);
//        if(game.getWinner() == null) {
//            CaroBoard caroBoard = game.getBoard();
//            System.out.println("bắt đầu tìm kiếm");
//            Point p = alphaBetaPrunning.search(game.getBoard());
//            System.out.println("Kết thúc tìm kiếm ");
//            board[p.x][p.y] = 2;
//            caroBoard.set(p.x, p.y, 2);
//        }
//        else {
//            GameStorage.getInstance().setGame(game);
//            System.out.println("next line 109");
//            return game;
//        }
//        int xWinner = 0;
//        int yWinner = 0;
//        for(int i=0; i<20; i++){
//            for(int j=0; j<20; j++) {
//                final int a = i, b = j;
//                xWinner = checkWin(game.getBoard().getSquare(), a, b, 1);
//                yWinner = checkWin(game.getBoard().getSquare(), a, b, 2);
//                if(xWinner == 1) {
//                    System.out.println("NguoiWIN");
//                    game.setWinner(TicToe.X);
//                    break;
//                }
//                if(yWinner == 1) {
//                    System.out.println(game.getPlayer1().getScore());
//                    game.setWinner(TicToe.O);
//                    break;
//                }
//            }
//        }
//        if(game.getWinner() == TicToe.O) {
//
//            game.getPlayer1().setScore(game.getPlayer1().getScore() + 100);
//            System.out.println(game.getPlayer1().getScore());
//        }
//        GameStorage.getInstance().setGame(game);
//        System.out.println("Set game again");
//        return game;
//    }
    public Game gamePlay(GamePlay gamePlay) throws NotFoundException, InvalidGameExeption {
        if (!GameStorage.getInstance().getGames().containsKey(gamePlay.getGameId())) {
            throw new NotFoundException("Game not found");
        }

        Game game = GameStorage.getInstance().getGames().get(gamePlay.getGameId());
        if (game.getStatus().equals(FINISHED)) {
            throw new InvalidGameExeption("Game is already finished");
        }

        int[][] board = game.getBoard().getSquare();
        board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = gamePlay.getType().getValue();

        int xWinner = 0;
        int yWinner = 0;
        for(int i=0; i<20; i++){
            for(int j=0; j<20; j++) {
                final int a = i, b = j;
                xWinner = checkWin(game.getBoard().getSquare(), a, b, 1);
                yWinner = checkWin(game.getBoard().getSquare(), a, b, 2);
                if(xWinner == 1) {

                    System.out.println("xWIN");
                    game.setWinner(TicToe.X);
                    playerService.updatePlayerWin(game.getPlayer1().getLogin());
                    break;
                }
                if(yWinner == 1) {
                    System.out.println("yWin");
                    game.setWinner(TicToe.O);
                    playerService.updatePlayerLose(game.getPlayer2());
                    break;
                }
            }
        }
        System.out.println(board);
        GameStorage.getInstance().setGame(game);
        return game;
    }
    public int checkWin(int[][] mt, int a, int b, int c) {
        if (checkCheoPhai(mt, a, b, c) == 1 || checkCheoTrai(mt, a, b, c) == 1 || checkCot(mt, a, b, c) == 1 || checkHang(mt, a, b, c) == 1) {
            return 1;
        }
        return 0;
    }
    public int checkCheoTrai(int[][] mt, int a, int b, int c) {
        int dem1 = 0, dem2 = 0;
        int x1 = a, x2 = b;
        int x3 = a, x4 = b;
        while (x1 - 1 >= 0 && x2 - 1 >= 0) {
            x1--;
            x2--;
            dem1++;
            if (dem1 == 4) {
                break;
            }
        }
        while (x3 + 1 <= 19 && x4 + 1 <= 19) {
            x3++;
            x4++;
            dem2++;
            if (dem2 == 4) {
                break;
            }
        }
        if (dem1 + dem2 >= 5) {
            for (int i = x3, j = x4; i >= x1; i--, j--) {
                if (i - 4 >= 0 && j - 4 >= 0) {
                    if (mt[i][j] == c && mt[i - 1][j - 1] == c && mt[i - 2][j - 2] == c && mt[i - 3][j - 3] == c && mt[i - 4][j - 4] == c) {
                        if (CheckPoint(i + 1, j + 1) && CheckPoint(i - 5, j - 5)) {
                            if (mt[i + 1][j + 1] != c && mt[i + 1][j + 1] != 0 && mt[i - 5][j - 5] != c && mt[i - 5][j - 5] != 0) {
                                continue;
                            }
                        }
                        return 1;
                    }
                }
            }
        }
        return 0;
    }

    public int checkCheoPhai(int[][] mt, int a, int b, int c) {
        int dem1 = 0, dem2 = 0;
        int x1 = a, x2 = b;
        int x3 = a, x4 = b;
        while (x1 - 1 >= 0 && x2 + 1 <= 19) {
            x1--;
            x2++;
            dem1++;
            if (dem1 == 4) {
                break;
            }
        }
        while (x3 + 1 <= 19 && x4 - 1 >= 0) {
            x3++;
            x4--;
            dem2++;
            if (dem2 == 4) {
                break;
            }
        }
        if (x3 - x1 >= 4) {
            for (int i = x3, j = x4; i >= x1; i--, j++) {
                if (i - 4 >= 0 && j + 4 <= 19) {
                    if (mt[i][j] == c && mt[i - 1][j + 1] == c && mt[i - 2][j + 2] == c && mt[i - 3][j + 3] == c && mt[i - 4][j + 4] == c) {
                        if (CheckPoint(i + 1, j - 1) && CheckPoint(i - 5, j + 5)) {
                            if (mt[i + 1][j - 1] != c && mt[i + 1][j - 1] != 0 && mt[i - 5][j + 5] != c && mt[i - 5][j + 5] != 0) {
                                continue;
                            }
                        }
                        return 1;
                    }
                }
            }
        }
        return 0;
    }

    public int checkCot(int[][] mt, int a, int b, int c) {
        int dem1 = 0, dem2 = 0;
        int x1 = a, x2 = a;
        while (x1 - 1 >= 0) {
            x1--;
            dem1++;
            if (dem1 == 4) {
                break;
            }
        }
        while (x2 + 1 <= 19) {
            x2++;
            dem2++;
            if (dem2 == 4) {
                break;
            }
        }
        if (x2 - x1 >= 4) {
            for (int i = x1; i <= x2; i++) {
                if (i + 4 <= 19) {
                    if (mt[i][b] == c && mt[i + 1][b] == c && mt[i + 2][b] == c && mt[i + 3][b] == c && mt[i + 4][b] == c) {
                        if (CheckPoint(i - 1, b) && CheckPoint(i + 5, b)) {
                            if (mt[i - 1][b] != c && mt[i - 1][b] != 0 && mt[i + 5][b] != c && mt[i + 5][b] != 0) {
                                continue;
                            }
                        }
                        return 1;
                    }
                }
            }
        }
        return 0;
    }

    public int checkHang(int[][] mt, int a, int b, int c) {
        int dem1 = 0, dem2 = 0;
        int x1 = b, x2 = b;
        while (x1 - 1 >= 0) {
            x1--;
            dem1++;
            if (dem1 == 4) {
                break;
            }
        }
        while (x2 + 1 <= 19) {
            x2++;
            dem2++;
            if (dem2 == 4) {
                break;
            }
        }
        if (x2 - x1 >= 4) {
            for (int i = x1; i <= x2; i++) {
                if (i + 4 <= 19) {
                    if (mt[a][i] == c && mt[a][i + 1] == c && mt[a][i + 2] == c && mt[a][i + 3] == c && mt[a][i + 4] == c) {
                        if (CheckPoint(a, i - 1) && CheckPoint(a, i + 5)) {
                            if (mt[a][i - 1] != c && mt[a][i - 1] != 0 && mt[a][i + 5] != c && mt[a][i + 5] != 0) {
                                continue;
                            }
                        }
                        return 1;
                    }
                }
            }
        }
        return 0;
    }

    public boolean CheckPoint(int x, int y) {
        return (x >= 0 && y >= 0 && x < 20 && y < 20);
    }
}
