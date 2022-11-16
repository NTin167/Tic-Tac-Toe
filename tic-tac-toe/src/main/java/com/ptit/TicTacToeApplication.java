package com.ptit;

import com.ptit.model.CaroBoard;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import java.awt.*;

@SpringBootApplication
public class TicTacToeApplication {

	public static void main(String[] args) {
//		CaroBoard caro = new CaroBoard(20);
//		System.out.println("Bat dau");
//		AlphaBetaPrunning alphaBetaPrunning = new AlphaBetaPrunning(20, 6);
//		System.out.println("Khoi tao alphabeta");
//		Point p = alphaBetaPrunning.search(caro);
//		System.out.println("Tim kiem alphabeta xong");
		SpringApplication.run(TicTacToeApplication.class, args);
	}

}
