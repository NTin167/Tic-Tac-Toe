package com.ptit.model;

import lombok.Data;

@Data
public class GamePlay {
    private TicToe type;
    private Integer coordinateX;
    private Integer coordinateY;
//    private State state;
    private String gameId;
}
