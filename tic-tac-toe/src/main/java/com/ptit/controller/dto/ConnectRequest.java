package com.ptit.controller.dto;

import com.ptit.model.Player;
import lombok.Data;

@Data
public class ConnectRequest {
    private Player player;
    private String gameId;
}
