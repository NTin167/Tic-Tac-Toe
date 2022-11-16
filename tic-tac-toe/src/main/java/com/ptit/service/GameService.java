package com.ptit.service;

import com.ptit.AlphaBetaPrunning;
import com.ptit.exception.InvalidGameExeption;
import com.ptit.exception.InvalidParamException;
import com.ptit.exception.NotFoundException;
import com.ptit.model.*;
import com.ptit.repository.PlayerRepository;
import com.ptit.storage.GameStorage;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;

import static com.ptit.model.GameStatus.*;

@Service
@AllArgsConstructor
public class GameService {
    @Autowired
    PlayerRepository playerRepository;
    public Game createGame(Player player) {
        Game game = new Game();
        game.setBoard(new CaroBoard(20));
//        game.setGameId(UUID.randomUUID().toString());
        game.setGameId("1");
        game.setPlayer1(player);
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

    public Game connectToRandomGame(Player player2) throws  NotFoundException {
        Game game = GameStorage.getInstance().getGames().values().stream()
                .filter(it -> it.getStatus().equals(NEW))
                .findFirst().orElseThrow(() -> new NotFoundException("Game not found"));
        game.setPlayer2(player2);
        game.setStatus(IN_PROGRESS);
        GameStorage.getInstance().setGame(game);
        return game;
    }
    public Game AIPlay(GamePlay gamePlay, AlphaBetaPrunning alphaBetaPrunning) throws NotFoundException, InvalidGameExeption {


        int maxdepth = 6;

        if (!GameStorage.getInstance().getGames().containsKey(gamePlay.getGameId())) {
            throw new NotFoundException("Game not found");
        }

        Game game = GameStorage.getInstance().getGames().get(gamePlay.getGameId());
        Player player = new Player();
        player.setLogin("AI");
        game.setPlayer2(player);
        game.setStatus(GameStatus.IN_PROGRESS);
        if (game.getStatus().equals(FINISHED)) {
            throw new InvalidGameExeption("Game is already finished");
        }
        int[][] board = game.getBoard().getSquare();
        board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = gamePlay.getType().getValue();
//        AlphaBetaPrunning ai = new AlphaBetaPrunning(20, maxdepth);

        CaroBoard caroBoard = new CaroBoard(20);
        caroBoard = game.getBoard();
        System.out.println("bắt đầu tìm kiếm");
//        Point p = alphaBetaPrunning.search(caroBoard);
        Point p = alphaBetaPrunning.search(game.getBoard());
        System.out.println("Kết thúc tìm kiếm ");
        board[p.x][p.y] = 2;
        caroBoard.set(p.x, p.y, 2);
//        game.getBoard().set(p.x, p.y, 2);
        int xWinner = 0;
        int yWinner = 0;
        for(int i=0; i<20; i++){
            for(int j=0; j<20; j++) {
                final int a = i, b = j;
                xWinner = checkWin(game.getBoard().getSquare(), a, b, 1);
                yWinner = checkWin(game.getBoard().getSquare(), a, b, 2);
                if(xWinner == 1) {

                    System.out.println("NguoiWIN");
                    game.setWinner(TicToe.X);
                    game.getPlayer1().setScore(100);
                    playerRepository.save(game.getPlayer1());
                }
                if(yWinner == 1) {
                    System.out.println("AIWIN");
                    game.setWinner(TicToe.O);
                }
            }
        }


        return game;
    }
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
                }
                if(yWinner == 1) {
                    System.out.println("yWin");
                    game.setWinner(TicToe.O);
                }
            }
        }


//        Boolean xWinner = checkWinner(game.getBoard().getSquare(), TicToe.X);
//        Boolean oWinner = checkWinner(game.getBoard().getSquare(), TicToe.O);

//        if (xWinner) {
//            game.setWinner(TicToe.X);
//        } else if (oWinner) {
//            game.setWinner(TicToe.O);
//        }

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


    // Xóa đoạn dưới
    private Boolean checkWinner(int[][] board, TicToe ticToe) {
        int[] boardArray = new int[9];
        int counterIndex = 0;
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                boardArray[counterIndex] = board[i][j];
                counterIndex++;
            }
        }

        int[][] winCombinations = {{0, 1, 2}, {3, 4, 5}, {6, 7, 8}, {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, {0, 4, 8}, {2, 4, 6}};
        for (int i = 0; i < winCombinations.length; i++) {
            int counter = 0;
            for (int j = 0; j < winCombinations[i].length; j++) {
                if (boardArray[winCombinations[i][j]] == ticToe.getValue()) {
                    counter++;
                    if (counter == 3) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
